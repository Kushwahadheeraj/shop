const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create order
router.post('/', async (req, res) => {
  try {
    const { userId, items, totals, address } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'userId required' });
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });

    const order = await Order.create({ userId, items, totals, address });
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
        status: 1, // Pending orders first (status: 'created' comes before 'delivered')
        createdAt: -1 // Then by newest first
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

module.exports = router;


