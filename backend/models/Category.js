const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    maxlength: 50
  },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  parentCategory: { 
    type: String, 
    trim: true,
    maxlength: 50
  },
  description: { 
    type: String, 
    trim: true,
    maxlength: 200
  },
  icon: { 
    type: String, 
    default: 'circle',
    maxlength: 30
  },
  color: { 
    type: String, 
    default: '#6B7280',
    match: [/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color']
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  sortOrder: { 
    type: Number, 
    default: 0 
  },
  // Category metadata
  keywords: [{ 
    type: String, 
    trim: true,
    maxlength: 30
  }],
  // Budget settings
  budgetEnabled: { 
    type: Boolean, 
    default: true 
  },
  defaultBudgetAmount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  // AI recognition settings
  aiKeywords: [{ 
    type: String, 
    trim: true,
    maxlength: 50
  }],
  confidence: { 
    type: Number, 
    min: 0, 
    max: 1,
    default: 0.8
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: 'name',
  foreignField: 'parentCategory'
});

// Index for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ type: 1, isActive: 1 });
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ sortOrder: 1 });

// Pre-save middleware to ensure unique names
categorySchema.pre('save', function(next) {
  this.name = this.name.toLowerCase().trim();
  next();
});

// Static method to get categories by type
categorySchema.statics.getByType = function(type) {
  return this.find({ type, isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Static method to get default categories
categorySchema.statics.getDefaultCategories = function() {
  return this.find({ isDefault: true, isActive: true }).sort({ sortOrder: 1 });
};

// Method to check if category can be deleted
categorySchema.methods.canBeDeleted = async function() {
  const Transaction = mongoose.model('Transaction');
  const count = await Transaction.countDocuments({ category: this.name });
  return count === 0;
};

// Method to get category usage statistics
categorySchema.methods.getUsageStats = async function(userId = null) {
  const Transaction = mongoose.model('Transaction');
  const query = { category: this.name };
  if (userId) query.userId = userId;
  
  const stats = await Transaction.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalTransactions: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
        lastTransaction: { $max: '$date' }
      }
    }
  ]);
  
  return stats[0] || {
    totalTransactions: 0,
    totalAmount: 0,
    averageAmount: 0,
    lastTransaction: null
  };
};

module.exports = mongoose.model('Category', categorySchema);
