const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  // Optional shop association (if client is tied to a specific shop)
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: null
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  // Structured address fields (optional)
  country: { type: String, trim: true, default: 'India' },
  stateName: { type: String, trim: true, default: '' },
  stateCode: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  pincode: { type: String, trim: true, default: '' },
  street: { type: String, trim: true, default: '' },
  gstin: {
    type: String,
    trim: true,
    uppercase: true,
    default: '',
    match: [/^$|^(0[1-9]|[1-2][0-9]|3[0-8]|97|99)[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Invalid GSTIN format']
  },
  pan: { type: String, trim: true, uppercase: true, default: '' },
  clientType: { type: String, enum: ['Individual', 'Business', 'Company'], default: 'Individual' },
  taxTreatment: { type: String, trim: true, default: '' },
  paymentTerms: {
    type: String,
    enum: ['immediate', '7_days', '15_days', '30_days', '45_days', '60_days'],
    default: 'immediate'
  },
  alias: { type: String, trim: true, default: '' },
  uniqueKey: { type: String, trim: true, default: '' },
  showEmailInInvoice: { type: Boolean, default: false },
  showPhoneInInvoice: { type: Boolean, default: false },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

clientSchema.index({ sellerId: 1, name: 1 });
clientSchema.index({ sellerId: 1, phone: 1 });
clientSchema.index({ sellerId: 1, gstin: 1 });

module.exports = mongoose.model('Client', clientSchema);


