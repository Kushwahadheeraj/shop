const mongoose = require('mongoose');

const HomePaintsSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  images: [{ 
    type: String, 
    required: true
  }],
  description: { 
    type: String, 
    trim: true
  },
  category: { 
    type: String, 
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: { 
    type: Number,
    required: true
  },
  originalPrice: { 
    type: Number
  },
  discount: { 
    type: Number, 
    default: 0
  },
  discountPrice: {
    type: Number
  },
  brand: { 
    type: String, 
    trim: true
  },
  colors: [{
    type: String,
    trim: true
  }],
  finish: { 
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

// Pre-save middleware to calculate discount price
HomePaintsSchema.pre('save', function(next) {
  if (this.price && this.discount) {
    this.discountPrice = this.price - (this.price * this.discount / 100);
  } else if (this.price) {
    this.discountPrice = this.price;
  }
  next();
});

// Pre-update middleware to calculate discount price
HomePaintsSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.price && update.discount) {
    update.discountPrice = update.price - (update.price * update.discount / 100);
  } else if (update.price) {
    update.discountPrice = update.price;
  }
  next();
});

module.exports = mongoose.model('HomePaints', HomePaintsSchema); 