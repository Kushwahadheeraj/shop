const express = require('express');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, items, totals, address, clientOrderId, paymentMethod, coupon } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });

    if (clientOrderId) {
      const existing = await Order.findOne({ clientOrderId });
      if (existing) {
        return res.json({ ok: true, data: existing, idempotent: true });
      }
    }

    // Create order first
    const order = await Order.create({ 
      clientOrderId, 
      userId, 
      items, 
      totals, 
      address, 
      paymentMethod: paymentMethod || 'prepaid',
      couponCode: coupon?.code // Store coupon code in order if needed
    });

    // Update coupon usage
    if (coupon && coupon.code) {
      try {
        await Coupon.findOneAndUpdate(
          { code: coupon.code },
          { 
            $inc: { usageCount: 1 },
            $push: { usedByUsers: { userId, usedAt: new Date() } }
          }
        );
      } catch (couponErr) {
        console.error('Failed to update coupon usage:', couponErr);
      }
    }

    // After successful order creation, decrement inventory quantities per item
    // We attempt to find the product by _id across known collections and decrement totalProduct safely
    try {
      const productModels = [
        '../models/ElectricalModels',
        '../models/AdhesivesModels',
        '../models/LocksModels',
        '../models/PaintModels',
        '../models/SanitaryModels',
        '../models/ToolsModels',
        '../models/HardwareModels',
        '../models/HomeModels',
        '../models/HomeDecorModels',
        '../models/PipeModels',
        '../models/PvcMatsModels',
        '../models/RooferModels',
        '../models/UncategorizedModels',
        '../models/WaterProofingModels',
        '../models/BrushModels',
        '../models/CementsModels',
        '../models/CleaningModels',
        '../models/DryModels',
        '../models/FiberModels',
        '../models/FittingModels'
      ].map((p) => {
        try { return require(p); } catch { return null; }
      }).filter(Boolean);

      const clampNonNegative = (n) => (n < 0 ? 0 : n);

      // For each item, try decrement in the first collection that matches the productId
      for (const item of items) {
        const productId = item.productId || item._id; // fallback
        const qty = Number(item.quantity || 1);
        if (!productId || !qty) continue;

        for (const Model of productModels) {
          try {
            // Read current value first to compute clamped decrement
            const existing = await Model.findById(productId).lean();
            if (!existing) continue;
            const current = Number(existing.totalProduct || 0);
            const next = clampNonNegative(current - qty);
            await Model.findByIdAndUpdate(productId, { $set: { totalProduct: next } });
            break; // stop after first match
          } catch {
            // try next model
          }
        }
      }
    } catch (invErr) {
      // Log and proceed without failing order creation
      console.error('Inventory decrement error:', invErr);
    }

    res.json({ ok: true, data: order });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Get orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const orders = await Order.find({ userId })
      .sort({ 
        createdAt: -1 // Newest first
      })
      .populate('userId', 'username email name');

    res.json({ 
      success: true, 
      count: orders.length,
      data: orders 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ error: 'orderId required' });

    const order = await Order.findById(orderId)
      .populate('userId', 'username email name');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ 
      success: true, 
      data: order 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch order' });
  }
});

// List all orders with optional filters
router.get('/', async (req, res) => {
  try {
    const { q, status, from, to, limit, skip } = req.query || {};
    const filter = {};
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { 'address.firstName': regex },
        { 'address.lastName': regex },
        { 'address.email': regex },
        { 'address.phone': regex },
      ];
    }
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const query = Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Math.min(Number(limit) || 200, 500))
      .populate('userId', 'username email name');

    const [orders, total] = await Promise.all([
      query,
      Order.countDocuments(filter),
    ]);

    res.json({ success: true, total, data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to list orders' });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!orderId) return res.status(400).json({ error: 'orderId required' });
    if (!status) return res.status(400).json({ error: 'status required' });

    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status }, 
      { new: true }
    ).populate('userId', 'username email name');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      data: order 
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update order status' });
  }
});

// Add tracking update
router.post('/:orderId/tracking', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body || {};
    if (!orderId) return res.status(400).json({ error: 'orderId required' });
    if (!status) return res.status(400).json({ error: 'status required' });

    // Use findByIdAndUpdate to avoid overwriting other fields or triggering validation on unchanged fields
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status },
        $push: { tracking: { status, note, at: new Date() } }
      },
      { new: true }
    ).populate('userId', 'username email name');

    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ success: true, message: 'Tracking updated', data: order });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update tracking' });
  }
});

module.exports = router;


