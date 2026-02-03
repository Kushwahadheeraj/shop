const mongoose = require('mongoose');

const HomeSectionTitleSchema = new mongoose.Schema({
  sectionId: { type: String, required: true, unique: true }, // e.g. "shop-by-category"
  title: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HomeSectionTitle', HomeSectionTitleSchema);