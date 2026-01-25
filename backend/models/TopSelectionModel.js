const mongoose = require('mongoose');

const TopSelectionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  image: { 
    type: String, 
    required: true
  },
  tag: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('TopSelection', TopSelectionSchema);
