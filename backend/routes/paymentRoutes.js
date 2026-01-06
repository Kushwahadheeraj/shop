const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');

const router = express.Router();

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.');
  }
  return new Razorpay({ key_id, key_secret });
}

router.post('/razorpay/order', async (req, res) => {
  try {
    const { amount, currency, receipt, notes } = req.body || {};
    const amt = Number(amount);
    if (!amt || isNaN(amt) || amt <= 0) {
      return res.status(400).json({ success: false, message: 'Valid amount (in paise) required' });
    }
    const _currency = (currency || 'INR').toUpperCase();
    const _receipt = receipt || `rcpt_${Date.now()}`;

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amt,
      currency: _currency,
      receipt: _receipt,
      notes: notes || {},
    });

    return res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to create Razorpay order' });
  }
});

router.post('/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const verified = expected === razorpay_signature;
    return res.json({ success: verified, verified, message: verified ? 'Payment verified' : 'Signature mismatch' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Failed to verify payment' });
  }
});

module.exports = router;

