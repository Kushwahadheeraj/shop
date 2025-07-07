// AUTO-REFRACTORED FOR PROFESSIONAL USAGE. DO NOT EDIT MANUALLY.

const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ToolsModel = require('../../models/ToolsModels');
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
 * Create a new Brush product.
 */
exports.createBrush = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new ToolsModel({ ...req.body, photos: photoUrls, category: 'brush' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all Brush products.
 */
exports.getAllBrush = async (req, res) => {
  try {
    const products = await ToolsModel.find({ category: 'brush' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a single Brush product by ID.
 */
exports.getOneBrush = async (req, res) => {
  try {
    const product = await ToolsModel.findOne({ _id: req.params.id, category: 'brush' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Brush product by ID.
 */
exports.updateBrush = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await ToolsModel.findOneAndUpdate(
      { _id: req.params.id, category: 'brush' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a Brush product by ID.
 */
exports.deleteBrush = async (req, res) => {
  try {
    const product = await ToolsModel.findOneAndDelete({ _id: req.params.id, category: 'brush' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
