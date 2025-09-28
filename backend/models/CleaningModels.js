const mongoose = require('mongoose');

const CleaningProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number, required: true },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  sku: { type: String, default: 'N/A' },
  category: { type: String, default: 'Cleaning' },
  tags: [String],
  description: String,
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('CleaningModels', CleaningProductSchema); 