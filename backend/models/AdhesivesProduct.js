const mongoose = require('mongoose');
const adhesivesProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  discount: Number,
  discountPrice: Number,
  description: String,
  totalProduct: Number,
  category: String,
  tag: String,
  photos: [String],
}, { timestamps: true });

adhesivesProductSchema.pre('save', function(next) {
  this.discountPrice = this.price - (this.price * (this.discount || 0) / 100);
  next();
});

module.exports = mongoose.model('AdhesivesProduct', adhesivesProductSchema);
