const mongoose = require('mongoose');

const ShopByCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String }, // For "50-80% OFF"
    link: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopByCategory', ShopByCategorySchema);
