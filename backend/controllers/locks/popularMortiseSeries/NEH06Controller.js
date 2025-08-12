// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const Lock = require('../../../models/LocksModels');
const cloudinary = require('../../../config/cloudinary');
const streamifier = require('streamifier');
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
 * Create a new NEH06 product.
 */
exports.createNEH06 = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new Lock({
      ...req.body,
      photos: photoUrls,
      category: 'NEH06',
      type: 'NEH06',
      productNo: req.body.productNo || 'NEH06-' + Date.now(),
      productQualityName: req.body.productQualityName || 'Standard'
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a NEH06 product by ID.
 */
exports.updateNEH06 = async (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      req.body.photos = photoUrls;
    }
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await Lock.findOneAndUpdate(
      { _id: req.params.id, category: 'NEH06' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllNEH06 = async (req, res) => {
  try {
    const items = await Lock.find({ category: 'NEH06' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNEH06 = async (req, res) => {
  try {
    const item = await Lock.findOneAndDelete({ _id: req.params.id, category: 'NEH06' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneNEH06 = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, category: 'NEH06' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
