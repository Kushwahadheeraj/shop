const mongoose = require('mongoose');

const brushProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: [String], // URLs or file paths
  description: String,
  rate: Number,
  min: Number,
  max: Number,
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('BrushModels', brushProductSchema);
