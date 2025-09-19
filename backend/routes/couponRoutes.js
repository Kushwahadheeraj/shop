const express = require('express');
const Coupon = require('../models/Coupon');
const router = express.Router();

// Create coupon (seller-only - rely on email check passed in body for now)
router.post('/', async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, startsAt, endsAt, usageLimit, createdByEmail } = req.body || {};
    if (!code || !discountType || !discountValue) return res.status(400).json({ message: 'code, discountType, discountValue required' });
    const normalized = String(code).toUpperCase().trim();
    const exists = await Coupon.findOne({ code: normalized });
    if (exists) return res.status(409).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({
      code: normalized,
      discountType,
      discountValue,
      minOrderAmount: Number(minOrderAmount || 0),
      maxDiscountAmount: Number(maxDiscountAmount || 0),
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
      usageLimit: Number(usageLimit || 0),
      createdByEmail: createdByEmail || null,
    });
    res.json({ success: true, data: coupon });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create coupon' });
  }
});

// List coupons (optionally filter by creator)
router.get('/', async (req, res) => {
  try {
    const { createdByEmail } = req.query || {};
    const filter = {};
    if (createdByEmail) filter.createdByEmail = String(createdByEmail).toLowerCase();
    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list coupons' });
  }
});

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount } = req.body || {};
    if (!code) return res.status(400).json({ message: 'code is required' });
    const now = new Date();
    const coupon = await Coupon.findOne({ code: String(code).toUpperCase().trim(), active: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon' });
    if (coupon.startsAt && now < coupon.startsAt) return res.status(400).json({ message: 'Coupon not started yet' });
    if (coupon.endsAt && now > coupon.endsAt) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });

    const total = Number(orderAmount || 0);
    if (coupon.minOrderAmount && total < coupon.minOrderAmount) return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrderAmount}` });

    let discount = 0;
    if (coupon.discountType === 'percent') {
      discount = Math.round((total * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount > 0) discount = Math.min(discount, coupon.maxDiscountAmount);
    } else {
      discount = Number(coupon.discountValue);
    }
    const payable = Math.max(0, total - discount);
    res.json({ success: true, data: { code: coupon.code, discount, payable } });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to validate coupon' });
  }
});

module.exports = router;


