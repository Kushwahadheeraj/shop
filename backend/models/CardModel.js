const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  mainText: { 
    type: String, 
    required: true,
    trim: true
  },
  
  image: { 
    type: String, 
    required: true
  },
  
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Card', CardSchema); 