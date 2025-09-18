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
  // pricing
  price: { type: Number }, // base/original
  fixPrice: { type: Number },
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
  discountPercent: { type: Number },
  minPrice: { type: Number },
  maxPrice: { type: Number },
  totalProduct: { type: Number, default: 0 },
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
  variants: [{
    variantName: { type: String },
    fixPrice: { type: Number },
    discountPrice: { type: Number }
  }],
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

// Pre-save middleware to calculate discount price / percent
HomePaintsSchema.pre('save', function(next) {
  const base = this.fixPrice ?? this.price;
  if (base && this.discount) {
    this.discountPrice = base - (base * this.discount / 100);
    this.discountPercent = this.discount;
  } else if (base) {
    this.discountPrice = base;
    this.discountPercent = 0;
  }
  next();
});

// Pre-update middleware to calculate discount price / percent
HomePaintsSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  const base = update.fixPrice ?? update.price;
  if (base && update.discount) {
    update.discountPrice = base - (base * update.discount / 100);
    update.discountPercent = update.discount;
  } else if (base) {
    update.discountPrice = base;
    update.discountPercent = 0;
  }
  next();
});

module.exports = mongoose.model('HomePaints', HomePaintsSchema); 