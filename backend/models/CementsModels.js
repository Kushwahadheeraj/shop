const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  weight: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const CementsProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, default: 'N/A' },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  description: String,
  totalProduct: { type: Number, required: true },
  category: { type: String, default: 'Cements' },
  tag: [String],
  weights: [weightSchema],
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('CementsModels', CementsProductSchema); 