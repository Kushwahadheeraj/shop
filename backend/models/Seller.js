const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true,
    // unique: true
  },
  shopName: {
    type: String,
    required: true
  },
  gstNumber: {
    type: String,
    required: true,
    unique: true
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }
}, { timestamps: true });

sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  
  // Set admin role for specific email
  if (this.email === 'kushwahadheeraj245@gmail.com') {
    this.role = 'admin';
  }
  
  next();
});

module.exports = mongoose.model('Seller', sellerSchema); 