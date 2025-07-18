const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema({
  weight: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const adhesivesProductSchema = new mongoose.Schema({
  name: String,
  sku: String,
  minPrice: Number,
  maxPrice: Number,
  discount: Number,
  description: String,
  totalProduct: Number,
  category: String,
  tag: [String],
  weights: [weightSchema],
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('AdhesivesModels', adhesivesProductSchema);
