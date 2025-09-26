const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
  size: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const DryProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, default: 'N/A' },
  fixPrice: { type: Number },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  discountPrice: { type: Number },
  description: String,
  totalProduct: { type: Number, required: true },
  category: { type: String, default: 'Dry' },
  tags: [String],
  sizes: [sizeSchema],
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('DryModels', DryProductSchema); 