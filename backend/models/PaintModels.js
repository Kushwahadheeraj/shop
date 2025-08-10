const mongoose = require('mongoose');

const PaintProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: {
    type: [String],
    validate: [arr => arr.length >= 1 && arr.length <= 5, 'Photos must be between 1 and 5'],
    required: true
  },
  description: { type: String },
  fixPrice: { type: Number },
  discount: { type: Number, default: 0 },
  discountPrice: { type: Number },
  discountPercent: { type: Number },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  totalProduct: { type: Number },
  category: { type: String, required: true },
  tags: [String],
  variants: [{
    variantName: { type: String },
    fixPrice: { type: Number },
    discountPrice: { type: Number }
  }],
  colors: [String]
}, { timestamps: true });

PaintProductSchema.pre('save', function(next) {
  if (this.fixPrice && this.discount) {
    this.discountPrice = Math.max(this.fixPrice - this.discount, 0);
    this.discountPercent = Math.round((this.discount / this.fixPrice) * 100);
  } else {
    this.discountPrice = this.fixPrice;
    this.discountPercent = 0;
  }
  next();
});

module.exports = mongoose.model('PaintModels', PaintProductSchema);