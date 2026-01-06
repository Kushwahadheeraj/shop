// const mongoose = require('mongoose');

// const couponSchema = new mongoose.Schema({
//   code: { type: String, required: true, uppercase: true, trim: true, unique: true, index: true },
//   discountType: { type: String, enum: ['percent', 'flat'], required: true },
//   discountValue: { type: Number, required: true },
//   minOrderAmount: { type: Number, default: 0 },
//   maxDiscountAmount: { type: Number, default: 0 },
//   startsAt: { type: Date },
//   endsAt: { type: Date },
//   active: { type: Boolean, default: true },
//   usageLimit: { type: Number, default: 0 },
//   usageCount: { type: Number, default: 0 },
//   createdByEmail: { type: String, trim: true, lowercase: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Coupon', couponSchema);


const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true,
    index: true
  },

  caption: { type: String, trim: true }, // 🔹 dashboard caption

  discountType: {
    type: String,
    enum: ['percent', 'flat', 'random_upto'],
    required: true
  },

  discountValue: { type: Number, required: true },

  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: 0 },

  // 🔹 Product specific coupon
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  startsAt: { type: Date },
  endsAt: { type: Date },

  active: { type: Boolean, default: true },

  usageLimit: { type: Number, default: 0 }, // total usage
  usageCount: { type: Number, default: 0 }, // dashboard count

  // 🔹 Track user usage
  usedByUsers: [{
    userId: mongoose.Schema.Types.ObjectId,
    usedAt: Date
  }],

  createdByEmail: { type: String, trim: true, lowercase: true }

}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
