const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  image: { 
    type: String, 
    required: true
  },
  items: {
    type: [String],
    default: []
  },
 
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Categories', CategoriesSchema); 