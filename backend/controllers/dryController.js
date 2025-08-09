// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const DryModels = require('../models/DryModels');
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

/**
 * Create a new Dry product.
 */
exports.createDry = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[Dry] Create request');
      console.log('[Dry] Body:', req.body);
      console.log('[Dry] Files:', req.files);
    }

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }

    if (shouldLog) console.log('[Dry] Uploading images to Cloudinary...');
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    if (shouldLog) console.log('[Dry] Uploaded URLs:', photoUrls);

    // Parse sizes and tag if sent as JSON string
    let { sizes, tag, ...rest } = req.body;
    if (shouldLog) {
      console.log('[Dry] Raw sizes:', sizes);
      console.log('[Dry] Raw tag:', tag);
    }

    if (typeof sizes === 'string') {
      try {
        sizes = JSON.parse(sizes);
      } catch (parseErr) {
        if (shouldLog) console.error('[Dry] Error parsing sizes:', parseErr);
        return res.status(400).json({ error: 'Invalid sizes format' });
      }
    }

    if (typeof tag === 'string') {
      try {
        tag = JSON.parse(tag);
      } catch {
        tag = [tag];
      }
    }

    // Ensure tag is an array
    if (!Array.isArray(tag)) {
      tag = tag ? [tag] : [];
    }

    // Filter out empty tags
    tag = tag.filter(t => t && t.trim() !== '');

    // Filter out invalid size entries
    if (sizes && Array.isArray(sizes)) {
      sizes = sizes.filter(size => 
        size && 
        typeof size === 'object' && 
        size.size && 
        size.price && 
        size.size.trim() !== '' && 
        !isNaN(Number(size.price))
      );
    }

    const productData = {
      ...rest,
      sizes: sizes || [],
      tag,
      photos: photoUrls,
      category: rest.category || 'Dry'
    };

    if (shouldLog) console.log('[Dry] Creating with data:', productData);
    const product = new DryModels(productData);
    await product.save();
    if (shouldLog) console.log('[Dry] Created:', product._id);

    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createDry:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Dry product by ID.
 */
exports.updateDry = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[Dry] Update id:', req.params.id);
      console.log('[Dry] Body:', req.body);
      console.log('[Dry] Files:', req.files);
    }

    let update = { ...req.body };

    // Parse sizes
    if (update.sizes && typeof update.sizes === 'string') {
      try {
        update.sizes = JSON.parse(update.sizes);
      } catch (parseErr) {
        if (shouldLog) console.error('[Dry] Error parsing sizes in update:', parseErr);
        return res.status(400).json({ error: 'Invalid sizes format' });
      }
    }
    if (update.sizes && Array.isArray(update.sizes)) {
      update.sizes = update.sizes.filter(size => 
        size && 
        typeof size === 'object' && 
        size.size && 
        size.price && 
        size.size.trim() !== '' && 
        !isNaN(Number(size.price))
      );
    }

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

    const product = await DryModels.findOneAndUpdate(
      { _id: req.params.id, category: 'Dry' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (err) {
    console.error('Error in updateDry:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDry = async (req, res) => {
  try {
    const drys = await DryModels.find({ category: 'Dry' });
    res.json(drys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDry = async (req, res) => {
  try {
    const dry = await DryModels.findOneAndDelete({ _id: req.params.id, category: 'Dry' });
    if (!dry) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneDry = async (req, res) => {
  try {
    const dry = await DryModels.findOne({ _id: req.params.id, category: 'Dry' });
    if (!dry) return res.status(404).json({ error: 'Not found' });
    res.json(dry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
