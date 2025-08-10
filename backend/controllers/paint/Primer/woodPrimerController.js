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
 * Create a new WoodPrimer product.
 */
exports.createWoodPrimer = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    
    // Parse variants if it's a JSON string
    let productData = { ...req.body };
    if (req.body.variants && typeof req.body.variants === 'string') {
      try {
        productData.variants = JSON.parse(req.body.variants);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid variants data format' });
      }
    }
    
    const product = new Paint({ ...productData, photos: photoUrls, category: 'WoodPrimer' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating WoodPrimer:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a WoodPrimer product by ID.
 */
exports.updateWoodPrimer = async (req, res) => {
  try {
    let update = { ...req.body };
    
    // Parse variants if it's a JSON string
    if (req.body.variants && typeof req.body.variants === 'string') {
      try {
        update.variants = JSON.parse(req.body.variants);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid variants data format' });
      }
    }
    
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    
    const product = await Paint.findOneAndUpdate(
      { _id: req.params.id, category: 'WoodPrimer' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('Error updating WoodPrimer:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllWoodPrimer = async (req, res) => {
  try {
    const items = await Paint.find({ category: 'WoodPrimer' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneWoodPrimer = async (req, res) => {
  try {
    const item = await Paint.findOne({ _id: req.params.id, category: 'WoodPrimer' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWoodPrimer = async (req, res) => {
  try {
    const item = await Paint.findOneAndDelete({ _id: req.params.id, category: 'WoodPrimer' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
