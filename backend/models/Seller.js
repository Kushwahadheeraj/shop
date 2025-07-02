const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Seller', sellerSchema); 