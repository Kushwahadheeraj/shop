const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema({
  label: { type: String, trim: true, default: '' },
  value: { type: String, trim: true, default: '' }
}, { _id: false });

const gstShopSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  name: { type: String, required: true, trim: true },
  alias: { type: String, trim: true, default: '' },
  gstin: { type: String, trim: true, uppercase: true, default: '', match: [/^$|^(0[1-9]|[1-2][0-9]|3[0-8]|97|99)[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Invalid GSTIN format'] },
  pan: { type: String, trim: true, uppercase: true, default: '' },
  country: { type: String, trim: true, default: 'India' },
  stateName: { type: String, trim: true, default: '' },
  stateCode: { type: String, trim: true, default: '' },
  city: { type: String, trim: true, default: '' },
  pincode: { type: String, trim: true, default: '' },
  street: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, trim: true, default: '' },
  showEmailInInvoice: { type: Boolean, default: false },
  showPhoneInInvoice: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
  customFields: { type: [customFieldSchema], default: [] },
}, { timestamps: true });

gstShopSchema.index({ sellerId: 1, name: 1 });
gstShopSchema.index({ sellerId: 1, gstin: 1 });
gstShopSchema.index({ sellerId: 1, isDefault: 1 });

module.exports = mongoose.model('GSTShop', gstShopSchema);


