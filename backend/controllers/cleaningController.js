// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const CleaningModels = require('../models/CleaningModels');
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
 * Create a new Cleaning product.
 */
exports.createCleaning = async (req, res) => {
  try {
    

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }

    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    // Parse tag if sent as JSON string or array entries
    let { tag, ...rest } = req.body;
    // Ensure tag is an array
    if (typeof tag === 'string') {
      try {
        tag = JSON.parse(tag);
      } catch {
        tag = [tag];
      }
    }
    if (!Array.isArray(tag)) {
      tag = tag ? [tag] : [];
    }

    // Filter out empty tags
    tag = tag.filter(t => t && t.trim() !== '');

    const productData = {
      ...rest,
      tag,
      photos: photoUrls,
      category: rest.category || 'Cleaning'
    };

    const product = new CleaningModels(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
        res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Cleaning product by ID.
 */
exports.updateCleaning = async (req, res) => {
  try {
    

    let update = { ...req.body };

    // Parse tag
    if (update.tag && typeof update.tag === 'string') {
      try {
        update.tag = JSON.parse(update.tag);
      } catch {
        update.tag = [update.tag];
      }
    }
    if (update.tag && !Array.isArray(update.tag)) {
      update.tag = [update.tag];
    }
    if (update.tag) {
      update.tag = update.tag.filter(t => t && t.trim() !== '');
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }

    const product = await CleaningModels.findOneAndUpdate(
      { _id: req.params.id, category: 'Cleaning' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (err) {
        res.status(500).json({ error: err.message });
  }
};

exports.getAllCleaning = async (req, res) => {
  try {
    const cleanings = await CleaningModels.find({ category: 'Cleaning' });
    res.json(cleanings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCleaning = async (req, res) => {
  try {
    const cleaning = await CleaningModels.findOneAndDelete({ _id: req.params.id, category: 'Cleaning' });
    if (!cleaning) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneCleaning = async (req, res) => {
  try {
    const cleaning = await CleaningModels.findOne({ _id: req.params.id, category: 'Cleaning' });
    if (!cleaning) return res.status(404).json({ error: 'Not found' });
    res.json(cleaning);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
