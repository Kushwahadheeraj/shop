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

module.exports = router;


