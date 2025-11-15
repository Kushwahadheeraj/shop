import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
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
    gstRate: { 
      type: Number, 
      default: 18,
      min: 0,
      max: 100 
    },
    gstAmount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    totalAmount: { 
      type: Number, 
      required: true,
      min: 0 
    },
    discount: { 
      type: Number, 
      default: 0,
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
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    url: String
  }],
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
billSchema.pre('save', async function(next) {
  if (this.isNew && !this.billNumber) {
    const count = await this.constructor.countDocuments();
    this.billNumber = `BILL-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate remaining amount
billSchema.pre('save', function(next) {
  this.payment.remainingAmount = this.pricing.totalAmount - this.payment.paidAmount;
  next();
});

billSchema.index({ shopId: 1, billDate: -1 });
billSchema.index({ createdBy: 1, billDate: -1 });
billSchema.index({ status: 1, billDate: -1 });

const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);

export default Bill;

