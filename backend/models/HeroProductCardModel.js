const mongoose = require('mongoose');

const HeroProductCardSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['Construction', 'Home Decor', 'Electrical', 'Tools'], // Fixed 4 sections as requested
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  image: { 
    type: String, 
    required: true
  },
  link: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('HeroProductCard', HeroProductCardSchema);
