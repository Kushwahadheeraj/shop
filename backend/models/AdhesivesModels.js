const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  weight: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const adhesivesProductSchema = new mongoose.Schema({
  name: String,
  sku: String,
  fixPrice: Number,
  minPrice: Number,
  maxPrice: Number,
  discount: Number,
  discountPrice: Number,
  description: String,
  totalProduct: Number,
  category: String,
  tags: [String],
  weights: [weightSchema],
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('AdhesivesModels', adhesivesProductSchema);
