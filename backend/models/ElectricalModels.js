const mongoose = require('mongoose');

const electricalProductSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., Adaptors, CeilingRoses, etc.
  name: { type: String, required: true },
  productNo: { type: String, required: true },
  productQualityName: { type: String, required: true },
  photos: [String],
  description: String,
  discount: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tag: [String],
}, { timestamps: true });

electricalProductSchema.pre('save', function(next) {
  if (this.price && this.discount) {
    this.discountPrice = Math.max(this.price - this.discount, 0);
  }
  next();
});

module.exports = mongoose.model('ElectricalModels', electricalProductSchema); 