const mongoose = require('mongoose');

const ampsSchema = new mongoose.Schema({
  amps: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const electricalProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number }, // keep for compatibility
  minPrice: { type: Number }, // NEW
  maxPrice: { type: Number }, // NEW
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number },
  discountPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  sku: { type: String, default: 'N/A' },
  category: { type: String, default: 'Adaptors' },
  tag: [String],
  colour: [String],
  brand: { type: String },
  way: { type: String },
  packageContents: { type: String },
  amps: [ampsSchema], // NEW
  description: String,
  photos: [String],
}, { timestamps: true });

module.exports = mongoose.model('ElectricalModels', electricalProductSchema); 