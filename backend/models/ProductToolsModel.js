const mongoose = require('mongoose');

const ProductToolsSchema = new mongoose.Schema({
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
  brand: { 
    type: String, 
    trim: true
  },
  specifications: { 
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

module.exports = mongoose.model('ProductTools', ProductToolsSchema); 