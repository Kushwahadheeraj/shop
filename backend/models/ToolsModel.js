const mongoose = require('mongoose');

const ToolsSchema = new mongoose.Schema({
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
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Tools', ToolsSchema); 