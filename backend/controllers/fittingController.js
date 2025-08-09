// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const FittingModels = require('../models/FittingModels');
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
 * Create a new Fitting product.
 */
exports.createFitting = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new FittingModels({ ...req.body, photos: photoUrls, category: 'Fitting' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Fitting product by ID.
 */
exports.updateFitting = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await FittingModels.findOneAndUpdate(
      { _id: req.params.id, category: 'Fitting' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllFitting = async (req, res) => {
  try {
    const fittings = await FittingModels.find({ category: 'Fitting' });
    res.json(fittings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFitting = async (req, res) => {
  try {
    const fitting = await FittingModels.findOneAndDelete({ _id: req.params.id, category: 'Fitting' });
    if (!fitting) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneFitting = async (req, res) => {
  try {
    const fitting = await FittingModels.findOne({ _id: req.params.id, category: 'Fitting' });
    if (!fitting) return res.status(404).json({ error: 'Not found' });
    res.json(fitting);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
