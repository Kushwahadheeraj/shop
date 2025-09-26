const Review = require('../models/Review');
const Seller = require('../models/Seller');
const EUser = require('../models/EUser');

exports.listByProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) return res.status(400).json({ success: false, message: 'productId required' });
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: reviews });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { productId, rating, comment, userName, userAvatar } = req.body || {};
    if (!productId || !rating) return res.status(400).json({ success: false, message: 'productId and rating required' });
    let finalName = userName;
    let finalAvatar = userAvatar;
    try {
      if ((!finalName || !finalName.trim() || !finalAvatar) && (req.sellerId || req.euserId)) {
        const uid = req.sellerId || req.euserId;
        let profile = await Seller.findById(uid).select('username name avatar').lean();
        if (!profile) profile = await EUser.findById(uid).select('username name avatar').lean();
        if (profile) {
          if (!finalName || !finalName.trim()) finalName = profile.username || profile.name || 'User';
          if (!finalAvatar && profile.avatar) finalAvatar = profile.avatar;
        }
      }
    } catch {}
    const review = await Review.create({ productId, rating, comment, userName: finalName || 'User', userId: req.sellerId || req.euserId, userAvatar: finalAvatar });
    res.json({ success: true, data: review });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};


