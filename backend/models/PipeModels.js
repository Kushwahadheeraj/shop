const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  fit: { type: String, required: true },
  rate: { type: Number, required: true }
}, { _id: false });

const PipeProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photos: [String],
  description: String,
  discount: { type: Number, default: 0 },
  fixPrice: { type: Number, required: true },
  discountPrice: { type: Number },
  totalProduct: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [String],
  type: {
    type: [OptionSchema],
    required: true,
    validate: [arr => arr.length > 0, 'At least one type option is required']
  }
}, { timestamps: true });

PipeProductSchema.pre('save', function(next) {
  if (this.fixPrice && this.discount) {
    this.discountPrice = Math.max(this.fixPrice - this.discount, 0);
  }
  next();
});

module.exports = mongoose.model('PipeModels', PipeProductSchema);