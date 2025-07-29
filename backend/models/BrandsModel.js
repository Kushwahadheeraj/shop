const mongoose = require('mongoose');

const BrandsSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  logo: { 
    type: String, 
    required: true
  },
  description: { 
    type: String, 
    trim: true
  },
  website: { 
    type: String, 
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Brands', BrandsSchema); 