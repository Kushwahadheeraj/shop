const Sanitary = require('../../../../models/SanitaryModels');
// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../../../../config/cloudinary');
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
 * Create a new Square product.
 */
exports.createSquare = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new Sanitary({ ...req.body, photos: photoUrls, category: 'Square' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Square product by ID.
 */
exports.updateSquare = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await Sanitary.findOneAndUpdate(
      { _id: req.params.id, category: 'Square' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllSquare = async (req, res) => {
  try {
    const products = await require('../../models/SanitaryModels').find({ category: 'Square' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneSquare = async (req, res) => {
  try {
    const product = await require('../../models/SanitaryModels').findOne({ _id: req.params.id, category: 'Square' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSquare = async (req, res) => {
  try {
    const product = await require('../../models/SanitaryModels').findOneAndDelete({ _id: req.params.id, category: 'Square' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
