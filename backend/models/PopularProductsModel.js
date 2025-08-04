const mongoose = require('mongoose');

const PopularProductsSchema = new mongoose.Schema({
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
    type: Number
  },
  minPrice: { 
    type: Number
  },
  maxPrice: { 
    type: Number
  },
  discount: { 
    type: Number, 
    default: 0
  },
  rating: { 
    type: Number, 
    default: 0
  },
  variants: [{
    variantName: { type: String, trim: true },
    price: { type: Number },
    discountPrice: { type: Number }
  }],
  customFields: [{
    fieldName: { type: String, trim: true },
    fieldValues: [{ type: String, trim: true }]
  }],
  isActive: { 
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('PopularProducts', PopularProductsSchema); 