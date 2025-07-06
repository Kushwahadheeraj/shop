const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  liter: { type: Number }, // for liter-based option
  kg: { type: Number },    // for kg-based option
}, { _id: false });

const PaintProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: {
    type: [String],
    validate: [arr => arr.length >= 1 && arr.length <= 5, 'Photos must be between 1 and 5'],
    required: true
  },
  description: { type: String },
  fixPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountPrice: { type: Number },
  discountPercent: { type: Number },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  type: {
    type: [OptionSchema],
    validate: [arr => arr.length > 0, 'At least one type option is required']
  },
  colors: {
    type: [String],
    validate: [arr => arr.length > 0, 'At least one color is required']
  }
}, { timestamps: true });

PaintProductSchema.pre('save', function(next) {
  if (this.fixPrice && this.discount) {
    this.discountPrice = Math.max(this.fixPrice - this.discount, 0);
    this.discountPercent = Math.round((this.discount / this.fixPrice) * 100);
  } else {
    this.discountPrice = this.fixPrice;
    this.discountPercent = 0;
  }

  // Calculate minPrice and maxPrice from type options
  if (Array.isArray(this.type) && this.type.length > 0) {
    const prices = this.type.map(opt => opt.price).filter(p => typeof p === 'number');
    this.minPrice = Math.min(...prices);
    this.maxPrice = Math.max(...prices);
  } else {
    this.minPrice = undefined;
    this.maxPrice = undefined;
  }

  next();
});

module.exports = mongoose.model('PaintModels', PaintProductSchema);