import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  address: { 
    type: String, 
    required: true,
    trim: true 
  },
  contact: {
    phone: { 
      type: String,
      trim: true 
    },
    email: { 
      type: String,
      trim: true,
      lowercase: true 
    },
    ownerName: { 
      type: String,
      trim: true 
    }
  },
  location: {
    city: { 
      type: String,
      trim: true 
    },
    state: { 
      type: String,
      trim: true 
    },
    pincode: { 
      type: String,
      trim: true 
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  business: {
    type: { 
      type: String,
      enum: ['retail', 'wholesale', 'distributor', 'manufacturer', 'service'],
      default: 'retail'
    },
    gstNumber: { 
      type: String,
      trim: true,
      uppercase: true 
    },
    panNumber: { 
      type: String,
      trim: true,
      uppercase: true 
    },
    licenseNumber: { 
      type: String,
      trim: true 
    }
  },
  financial: {
    creditLimit: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    currentBalance: { 
      type: Number, 
      default: 0 
    },
    paymentTerms: { 
      type: String,
      enum: ['immediate', '7_days', '15_days', '30_days', '45_days', '60_days'],
      default: 'immediate'
    }
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'], 
    default: 'active' 
  },
  notes: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EUser', 
    required: true 
  },
  lastTransactionDate: { 
    type: Date 
  }
}, { 
  timestamps: true 
});

shopSchema.index({ name: 1 });
shopSchema.index({ createdBy: 1 });
shopSchema.index({ status: 1 });
shopSchema.index({ 'contact.phone': 1 });
shopSchema.index({ 'business.gstNumber': 1 });

const Shop = mongoose.models.Shop || mongoose.model('Shop', shopSchema);

export default Shop;

