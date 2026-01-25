const mongoose = require('mongoose');

const DealsDiscountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subtitle: { type: String },
    link: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DealsDiscount', DealsDiscountSchema);

