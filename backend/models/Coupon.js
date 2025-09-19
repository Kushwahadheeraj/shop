const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
  discountType: { type: String, enum: ['percent', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: 0 },
  startsAt: { type: Date },
  endsAt: { type: Date },
  active: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 0 },
  usageCount: { type: Number, default: 0 },
  createdByEmail: { type: String, trim: true, lowercase: true },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);


