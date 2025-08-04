const mongoose = require('mongoose');

const HomeElectricalSchema = new mongoose.Schema({
  name: { 
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
    trim: true
  },
  category: { 
    type: String, 
    trim: true
  },
  price: { 
    type: Number
  },
  originalPrice: { 
    type: Number
  },
  discount: { 
    type: Number, 
    default: 0
  },
  brand: { 
    type: String, 
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('HomeElectrical', HomeElectricalSchema); 