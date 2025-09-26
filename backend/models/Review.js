const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  userName: { type: String, default: 'Guest' },
  userId: { type: String },
  userAvatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);


