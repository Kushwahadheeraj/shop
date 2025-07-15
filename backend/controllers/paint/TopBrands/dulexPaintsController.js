const Paint = require('../../../models/PaintModels');
// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../../../config/cloudinary');
const streamifier = require('streamifier');
/**
 * Uploads a buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Create a new AgsarPaints product.
 */
exports.createDulexPaints = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new Paint({ ...req.body, photos: photoUrls, category: 'dulexPaints' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a AgsarPaints product by ID.
 */
exports.updateDulexPaints = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await Paint.findOneAndUpdate(
      { _id: req.params.id, category: 'dulexPaints' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllDulexPaints = async (req, res) => {
  try {
    const items = await Paint.find({ category: 'DulexPaints' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOneDulexPaints = async (req, res) => {
  try {
    const item = await Paint.findOne({ _id: req.params.id, category: 'DulexPaints' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDulexPaints = async (req, res) => {
  try {
    const item = await Paint.findOneAndDelete({ _id: req.params.id, category: 'DulexPaints' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
