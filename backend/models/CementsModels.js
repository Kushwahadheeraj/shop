const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  weight: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const CementsProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, default: 'N/A' },
  fixPrice: { type: Number },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  discount: { type: Number, default: 0 },
  discountPrice: { type: Number },
  description: String,
  totalProduct: { type: Number, required: true },
  category: { type: String, default: 'Cements' },
  tags: [String],
  weights: [weightSchema],
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('CementsModels', CementsProductSchema); 