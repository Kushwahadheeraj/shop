const mongoose = require('mongoose');

const billFileSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
    index: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    index: true
  },
  billType: {
    type: String,
    enum: ['gst', 'bill'],
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true // 'image/jpeg', 'application/pdf', etc.
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
billFileSchema.index({ sellerId: 1, shopId: 1 });
billFileSchema.index({ sellerId: 1, billType: 1 });
billFileSchema.index({ shopId: 1, billType: 1 });

module.exports = mongoose.model('BillFile', billFileSchema);

