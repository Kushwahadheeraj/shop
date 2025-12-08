const mongoose = require('mongoose');

const balanceEntrySchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
    index: true
  },
  // Person details
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  // Entry type: 'credit' (baki lena) or 'payment' (paisa jama karna)
  entryType: {
    type: String,
    enum: ['credit', 'payment'],
    required: true
  },
  // Amount
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  // Description of what was taken on credit
  description: {
    type: String,
    trim: true,
    default: ''
  },
  // Date of the entry
  entryDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  // Payment date (for payment entries)
  paymentDate: {
    type: Date,
    default: null
  },
  // Notes
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  // Status: active or cleared (when all payment is done)
  status: {
    type: String,
    enum: ['active', 'cleared'],
    default: 'active'
  }
}, { timestamps: true });

// Index for faster queries
balanceEntrySchema.index({ sellerId: 1, status: 1 });
balanceEntrySchema.index({ sellerId: 1, phone: 1 });
balanceEntrySchema.index({ sellerId: 1, entryDate: -1 });

module.exports = mongoose.model('BalanceEntry', balanceEntrySchema);

