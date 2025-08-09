// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const FiberModels = require('../models/FiberModels');
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
 * Create a new Fiber product.
 */
exports.createFiber = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new FiberModels({ ...req.body, photos: photoUrls, category: 'Fiber' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Fiber product by ID.
 */
exports.updateFiber = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await FiberModels.findOneAndUpdate(
      { _id: req.params.id, category: 'Fiber' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllFiber = async (req, res) => {
  try {
    const fibers = await FiberModels.find({ category: 'Fiber' });
    res.json(fibers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFiber = async (req, res) => {
  try {
    const fiber = await FiberModels.findOneAndDelete({ _id: req.params.id, category: 'Fiber' });
    if (!fiber) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneFiber = async (req, res) => {
  try {
    const fiber = await FiberModels.findOne({ _id: req.params.id, category: 'Fiber' });
    if (!fiber) return res.status(404).json({ error: 'Not found' });
    res.json(fiber);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
