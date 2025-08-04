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
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Brands', BrandsSchema); 