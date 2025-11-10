const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  hsnSac: {
    type: String,
    trim: true,
    default: ''
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  gstRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 18
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 }
});

const gstBillSchema = new mongoose.Schema({
  // Seller information
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },

  // Shop information
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  shopAddress: {
    type: String,
    trim: true,
    default: ''
  },
  shopStateName: {
    type: String,
    trim: true,
    default: ''
  },
  shopStateCode: {
    type: String,
    trim: true,
    default: ''
  },
  shopGST: {
    type: String,
    trim: true,
    default: ''
  },
  shopPAN: {
    type: String,
    trim: true,
    default: ''
  },
  shopPhone: {
    type: String,
    trim: true,
    default: ''
  },
  shopEmail: {
    type: String,
    trim: true,
    default: ''
  },

  // Invoice details
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  invoiceDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    default: null
  },

  // Customer information
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    trim: true,
    default: ''
  },
  customerPhone: {
    type: String,
    trim: true,
    default: ''
  },
  customerAddress: {
    type: String,
    trim: true,
    default: ''
  },
  customerGST: {
    type: String,
    trim: true,
    default: ''
  },

  // Items
  items: [itemSchema],

  // Financial details
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  gstAmount: {
    type: Number,
    required: true,
    min: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0
  },

  // Additional information
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  terms: {
    type: String,
    trim: true,
    default: ''
  },

  // Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },

  // Payment information
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingAmount: {
    type: Number,
    default: 0,
    min: 0
  },

  // Linked bank account
  bankAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BankAccount',
    default: null
  },

  // Invoice template
  templateId: {
    type: Number,
    default: 10, // Default to original detailed template
    min: 1,
    max: 10
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
gstBillSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Calculate remaining amount before saving
gstBillSchema.pre('save', function(next) {
  this.remainingAmount = this.grandTotal - this.paidAmount;
  next();
});

// Index for better query performance
gstBillSchema.index({ sellerId: 1, invoiceDate: -1 });
gstBillSchema.index({ shopId: 1, invoiceDate: -1 });
gstBillSchema.index({ invoiceNumber: 1 });
gstBillSchema.index({ customerName: 1 });

module.exports = mongoose.model('GSTBill', gstBillSchema);
