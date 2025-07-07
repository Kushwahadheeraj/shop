// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const ElectricalModels = require('../models/ElectricalModels');
// TODO: Set correct model import
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
 * Create a new InsulationTapes product.
 */
exports.createInsulationTapes = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new InsulationTapesModel({ ...req.body, photos: photoUrls, category: 'insulationTapes' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a InsulationTapes product by ID.
 */
exports.updateInsulationTapes = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await InsulationTapesModel.findOneAndUpdate(
      { _id: req.params.id, category: 'insulationTapes' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllInsulationTapes = async (req, res) => {
  try {
    const insulationTapes = await Electrical.find({ type: 'Fans' });
    res.json(insulationTapes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteInsulationTape = async (req, res) => {
  try {
    const insulationTape = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!insulationTape) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOneInsulationTapes = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, category: 'insulationTapes' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
