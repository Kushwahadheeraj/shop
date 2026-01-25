const mongoose = require('mongoose');

const FashionBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subtitle: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    link: {
      type: String,
      trim: true
    },
    buttonText: {
      type: String,
      default: 'Shop Now',
      trim: true
    },
    backgroundColor: {
      type: String,
      default: '#f3f4f6',
      trim: true
    },
    contentPosition: {
      type: String,
      enum: ['left', 'right'],
      default: 'left'
    },
    verticalAlign: {
      type: String,
      enum: ['start', 'center', 'end'],
      default: 'center'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FashionBanner', FashionBannerSchema);
