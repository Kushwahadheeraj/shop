const mongoose = require('mongoose');

const ampsSchema = new mongoose.Schema({
  amps: String,
  price: Number,
  discountPrice: Number
}, { _id: false });

const HomeElectricalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  // pricing
  price: { type: Number }, // base/original
  originalPrice: { type: Number },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number },
  discountPrice: { type: Number },
  // stock/sku/category/brand
  totalProduct: { type: Number, default: 0 },
  sku: { type: String, default: 'N/A' },
  category: { type: String, trim: true },
  brand: { type: String, trim: true },
  // attributes
  tag: [String],
  colour: [String],
  way: { type: String },
  packageContents: { type: String },
  amps: [ampsSchema],
  // media
  photos: [String],
  image: { type: String }, // first image for quick display
  // meta
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HomeElectrical', HomeElectricalSchema);