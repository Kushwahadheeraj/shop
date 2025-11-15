import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    templateId: {
      type: String,
      default: 'default',
    },
    shopName: {
      type: String,
      required: true,
    },
    shopAddress: {
      type: String,
      required: true,
    },
    shopPhone: {
      type: String,
    },
    shopEmail: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
        },
        unit: {
          type: String,
          default: 'pc',
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    pricing: {
      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
        min: 0,
      },
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    payment: {
      paidAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      remainingAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      status: {
        type: String,
        enum: ['pending', 'partial', 'paid'],
        default: 'pending',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EUser',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.pre('validate', async function (next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

export default Invoice;

