const mongoose = require('mongoose');

const BestQualitySchema = new mongoose.Schema({
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

module.exports = mongoose.model('BestQuality', BestQualitySchema);
