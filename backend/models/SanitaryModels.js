const mongoose = require('mongoose');

const SanitaryProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: [String],
  description: String,
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number, required: true },
  discountPrice: { type: Number },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  variants: [{
    variantName: String,
    price: Number,
    discountPrice: Number
  }],
  customFields: [{
    fieldName: String,
    fieldValues: [String]
  }],
  type: [{
    fit: String,
    rate: Number
  }]
}, { timestamps: true });

SanitaryProductSchema.pre('save', function(next) {
  if (this.fixPrice && this.discount) {
    this.discountPrice = Math.max(this.fixPrice - this.discount, 0);
  }
  next();
});

module.exports = mongoose.model('SanitaryModels', SanitaryProductSchema);