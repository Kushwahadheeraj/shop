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
 * Create a new EarthingAccessories product.
 */
exports.createEarthingAccessories = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new EarthingAccessoriesModel({ ...req.body, photos: photoUrls, category: 'earthingAccessories' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a EarthingAccessories product by ID.
 */
exports.updateEarthingAccessories = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await EarthingAccessoriesModel.findOneAndUpdate(
      { _id: req.params.id, category: 'earthingAccessories' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllEarthingAccessories = async (req, res) => {
  try {
    const accessories = await Electrical.find({ type: 'Fans' });
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEarthingAccessory = async (req, res) => {
  try {
    const accessory = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!accessory) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOneEarthingAccessories = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, category: 'earthingAccessories' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
