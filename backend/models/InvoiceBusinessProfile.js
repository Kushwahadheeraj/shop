const mongoose = require('mongoose');

const invoiceBusinessProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true
  },
  logo: {
    type: String, // URL to logo image
    default: ''
  },
  signature: {
    type: String, // URL to signature image
    default: ''
  },
  terms: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InvoiceBusinessProfile', invoiceBusinessProfileSchema);
