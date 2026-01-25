import mongoose from 'mongoose';

const CategoryBannerSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.CategoryBanner || mongoose.model('CategoryBanner', CategoryBannerSchema);
