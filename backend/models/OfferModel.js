const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  image: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Offer', OfferSchema); 