const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  image: { 
    type: String, 
    trim: true
  },
  alt: { 
    type: String, 
    trim: true
  },
  overlay: { 
    type: Boolean, 
    default: false
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  subtitle: { 
    type: String, 
    trim: true
  },
  description: { 
    type: String, 
    required: true,
    trim: true
  },
  buttonText: { 
    type: String, 
    trim: true
  },
  textColor: { 
    type: String, 
    default: 'text-white',
    enum: ['text-white', 'text-black', 'text-gray-800', 'text-blue-600', 'text-red-600']
  },
  content: { 
    type: String, 
    trim: true
  },
  uploadedImage: { 
    type: String 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Items', ItemsSchema); 