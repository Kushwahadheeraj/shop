const mongoose = require('mongoose');

const ItemsSchema = new mongoose.Schema({
  image: { 
    type: String, 
    required: true,
    trim: true
  },
  link: { 
    type: String, 
    required: true,
    trim: true
  },
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  subtitle: { 
    type: String, 
    trim: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Items', ItemsSchema); 