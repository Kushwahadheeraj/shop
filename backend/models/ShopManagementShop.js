const mongoose = require('mongoose');

const shopManagementShopSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    files: [
      {
        originalName: String,
        mimeType: String,
        size: Number,
        url: String, // public URL to access the file
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

shopManagementShopSchema.index({ sellerId: 1, name: 1 });

module.exports = mongoose.model('ShopManagementShop', shopManagementShopSchema);

