const Paint = require('../../models/PaintModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

// Helper for Cloudinary upload
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'paint/WallStickersWallpapers' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// CREATE
exports.createWallStickersWallpapers = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) return res.status(400).json({ message: 'Max 5 images allowed' });
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    if (photoUrls.length < 1) return res.status(400).json({ message: 'At least 1 image required' });

    const item = new Paint({
      ...req.body,
      photos: photoUrls,
      category: 'WallStickersWallpapers'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAllWallStickersWallpapers = async (req, res) => {
  try {
    const items = await Paint.find({ category: 'WallStickersWallpapers' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
exports.getOneWallStickersWallpapers = async (req, res) => {
  try {
    const item = await Paint.findOne({ _id: req.params.id, category: 'WallStickersWallpapers' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateWallStickersWallpapers = async (req, res) => {
  try {
    const item = await Paint.findOneAndUpdate(
      { _id: req.params.id, category: 'WallStickersWallpapers' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteWallStickersWallpapers = async (req, res) => {
  try {
    const item = await Paint.findOneAndDelete({ _id: req.params.id, category: 'WallStickersWallpapers' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
