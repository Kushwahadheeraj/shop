const mongoose = require('mongoose');

const PvcMatsProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: [String],
  description: String,
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number, required: true },
  discountPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  variants: [{ 
    variantName: String, 
    price: Number, 
    discountPrice: Number 
  }],
  // Custom fields for storing additional product information
  customFields: [{
    fieldName: String,
    fieldValues: [String]
  }]
}, { timestamps: true });

PvcMatsProductSchema.pre('save', function(next) {
  if (this.fixPrice && this.discount) {
    this.discountPrice = Math.max(this.fixPrice - this.discount, 0);
  }
  next();
});

module.exports = mongoose.model('PvcMatsModels', PvcMatsProductSchema);