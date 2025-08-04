const mongoose = require('mongoose');

const SanitaryImageSchema = new mongoose.Schema({
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
 
  descText: { 
    type: String, 
    trim: true
  },
 
  image: { 
    type: String, 
    required: true
  },
  
}, { 
  timestamps: true 
});

module.exports = mongoose.model('SanitaryImage', SanitaryImageSchema); 