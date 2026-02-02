const mongoose = require('mongoose');

const promoBannerSchema = new mongoose.Schema({
  title: { type: String, required: true, default: 'Up to 35% OFF' },
  subtitle: { type: String, required: true, default: 'on first order' },
  highlightText: { type: String, required: true, default: '*Only on App' },
  buttonText: { type: String, required: true, default: 'Download Now' },
  buttonLink: { type: String, required: true, default: '/' },
  cards: [{
    image: { type: String, required: true },
    label: { type: String, required: true },
    link: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('PromoBanner', promoBannerSchema);
