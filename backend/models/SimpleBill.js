const mongoose = require('mongoose');

const simpleBillSchema = new mongoose.Schema({
  billNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  shopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Shop', 
    required: true,
    index: true 
  },
  shopName: { 
    type: String, 
    required: true 
  },
  shopAddress: { 
    type: String, 
    required: true 
  },
  items: [{
    name: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true,
      min: 1 
    },
    unitPrice: { 
      type: Number, 
      required: true,
      min: 0 
    },
    totalPrice: { 
      type: Number, 
      required: true,
      min: 0 
    },
    category: { 
      type: String 
    },
    description: { 
      type: String 
    }
  }],
  pricing: {
    subtotal: { 
      type: Number, 
      required: true,
      min: 0 
    },
    discount: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0 
    }
  },
  payment: {
    method: { 
      type: String, 
      enum: ['cash', 'card', 'upi', 'bank_transfer', 'cheque'], 
      default: 'cash' 
    },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'partial', 'overdue'], 
      default: 'pending' 
    },
    paidAmount: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    remainingAmount: { 
      type: Number, 
      required: true,
      min: 0 
    }
  },
  billDate: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  dueDate: { 
    type: Date 
  },
  description: { 
    type: String 
  },
  notes: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], 
    default: 'draft' 
  },
  recurring: {
    isRecurring: { 
      type: Boolean, 
      default: false 
    },
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] 
    },
    nextDueDate: { 
      type: Date 
    }
  },
  paymentHistory: [{
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    method: {
      type: String,
      enum: ['cash', 'upi', 'cheque', 'card', 'bank_transfer'],
      required: true
    },
    paymentDate: {
      type: Date,
      required: true
    },
    notes: {
      type: String
    },
    customerName: {
      type: String
    },
    billId: {
      type: String
    },
    transactionId: {
      type: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EUser', 
    required: true 
  }
}, { 
  timestamps: true 
});

// Pre-save middleware to generate bill number
simpleBillSchema.pre('save', async function(next) {
  if (this.isNew && !this.billNumber) {
    const count = await this.constructor.countDocuments();
    this.billNumber = `SIMPLE-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate remaining amount
simpleBillSchema.pre('save', function(next) {
  this.payment.remainingAmount = this.pricing.totalAmount - this.payment.paidAmount;
  next();
});

// Index for better query performance
simpleBillSchema.index({ shopId: 1, billDate: -1 });
simpleBillSchema.index({ createdBy: 1, billDate: -1 });
simpleBillSchema.index({ status: 1, billDate: -1 });

module.exports = mongoose.model('SimpleBill', simpleBillSchema);


