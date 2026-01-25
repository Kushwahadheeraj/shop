
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'app/shop/.env') });

const CategoryBannerSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

const CategoryBanner = mongoose.models.CategoryBanner || mongoose.model('CategoryBanner', CategoryBannerSchema);

async function checkBanners() {
  try {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI is missing from app/shop/.env');
        return;
    }
    await mongoose.connect(process.env.MONGO_URI);

    const banners = await CategoryBanner.find({});
    banners.forEach(b => {
        console.log(`Category: ${b.category}`);
        console.log(`Image URL Length: ${b.imageUrl.length}`);
        console.log(`Image URL: ${b.imageUrl}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBanners();
