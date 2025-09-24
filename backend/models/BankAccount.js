const mongoose = require('mongoose');

const bankAccountSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
  accountHolder: { type: String, required: true, trim: true },
  bankName: { type: String, required: true, trim: true },
  accountNumber: { type: String, required: true, trim: true },
  ifsc: { type: String, required: true, trim: true, uppercase: true },
  branch: { type: String, trim: true, default: '' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', bankAccountSchema);


