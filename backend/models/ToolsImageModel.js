const mongoose = require('mongoose');

const ToolsImageSchema = new mongoose.Schema({
  mainText: { 
    type: String, 
    required: true,
    trim: true
  },
  subtext: { 
    type: String, 
    required: true,
    trim: true
  },
  descrText: { 
    type: String, 
    required: true,
    trim: true
  },
  descText: { 
    type: String, 
    trim: true
  },
  offer: { 
    type: String, 
    trim: true
  },
  image: { 
    type: String, 
    required: true
  },
  category: { 
    type: String, 
    default: 'ToolsImage',
    enum: ['ToolsImage']
  },
  order: { 
    type: Number, 
    default: 0
  },
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('ToolsImage', ToolsImageSchema); 