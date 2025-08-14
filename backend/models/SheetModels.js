const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  fit: { type: String, required: true },
  rate: { type: Number, required: true }
}, { _id: false });

const SheetProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: [String],
  description: String,
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number, required: true },
  discountPrice: { type: Number },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  type: {
    type: [OptionSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one type option is required']
  },
  variants: [{
    variantName: String,
    price: Number,
    discountPrice: Number
  }],
  customFields: [{
    fieldName: String,
    fieldValues: [String]
  }]
}, { timestamps: true });

SheetProductSchema.pre('save', function(next) {
  if (this.fixPrice && this.discount) {
    this.discountPrice = Math.max(this.fixPrice - this.discount, 0);
  }
  next();
});

module.exports = mongoose.model('SheetModels', SheetProductSchema);
