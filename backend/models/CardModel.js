const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  subtitle: { 
    type: String, 
    trim: true
  },
  image: { 
    type: String, 
    required: true
  },
  link: { 
    type: String, 
    trim: true
  },
  category: { 
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

module.exports = mongoose.model('Card', CardSchema); 