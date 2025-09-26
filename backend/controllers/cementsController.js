// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const CementsModels = require('../models/CementsModels');
const shouldLog = process.env.APP_DEBUG === 'true';
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

function coerceWeights(maybeWeights) {
  // Accept: stringified JSON, array of objects, or array of strings (one of which is JSON)
  if (!maybeWeights) return [];
  if (typeof maybeWeights === 'string') {
    try {
      const parsed = JSON.parse(maybeWeights);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(maybeWeights)) {
    // If it's already array of objects, return after validation below
    // If it's array of strings, try to find a JSON array among them
    const jsonCandidate = maybeWeights.find(v => typeof v === 'string' && v.trim().startsWith('['));
    if (jsonCandidate) {
      try {
        const parsed = JSON.parse(jsonCandidate);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // fallthrough to validation of object entries
      }
    }
    return maybeWeights;
  }
  return [];
}

function sanitizeWeights(weights) {
  if (!Array.isArray(weights)) return [];
  return weights.filter(w =>
    w && typeof w === 'object' && w.weight && w.weight.trim() !== '' &&
    w.price !== undefined && !isNaN(Number(w.price))
  );
}

/**
 * Create a new Cements product.
 */
exports.createCements = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[Cements] Create request');
      console.log('[Cements] Body:', req.body);
      console.log('[Cements] Files:', req.files);
    }

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }

    if (shouldLog) console.log('[Cements] Uploading images to Cloudinary...');
    const photoUrls = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );
    if (shouldLog) console.log('[Cements] Uploaded URLs:', photoUrls);

    let { weights, tags, ...rest } = req.body;

    // Coerce and sanitize weights
    const coercedWeights = coerceWeights(weights);
    const finalWeights = sanitizeWeights(coercedWeights);

    // Ensure tags is an array
    if (typeof tags === 'string') {
      try { tags = JSON.parse(tags); } catch { tags = [tags]; }
    }
    if (!Array.isArray(tags)) tags = tags ? [tags] : [];

    const productData = {
      ...rest,
      weights: finalWeights,
      tags,
      photos: photoUrls,
      category: rest.category || 'Cements'
    };

    if (shouldLog) console.log('[Cements] Creating with data:', productData);
    const product = new CementsModels(productData);
    await product.save();
    if (shouldLog) console.log('[Cements] Created:', product._id);

    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createCements:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Cements product by ID.
 */
exports.updateCements = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[Cements] Update id:', req.params.id);
      console.log('[Cements] Body:', req.body);
      console.log('[Cements] Files:', req.files);
    }

    let update = { ...req.body };

    if (update.weights) {
      update.weights = sanitizeWeights(coerceWeights(update.weights));
    }

    if (update.tags && typeof update.tags === 'string') {
      try { update.tags = JSON.parse(update.tags); } catch { update.tags = [update.tags]; }
    }
    if (update.tags && !Array.isArray(update.tags)) {
      update.tags = [update.tags];
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(
        req.files.map(file => uploadToCloudinary(file.buffer))
      );
    }

    const product = await CementsModels.findOneAndUpdate(
      { _id: req.params.id, category: 'Cements' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (err) {
    console.error('Error in updateCements:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCements = async (req, res) => {
  try {
    const cements = await CementsModels.find({ category: 'Cements' });
    res.json(cements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCements = async (req, res) => {
  try {
    const cement = await CementsModels.findOneAndDelete({ _id: req.params.id, category: 'Cements' });
    if (!cement) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneCements = async (req, res) => {
  try {
    const cements = await CementsModels.findOne({ _id: req.params.id, category: 'Cements' });
    if (!cements) return res.status(404).json({ error: 'Not found' });
    res.json(cements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
