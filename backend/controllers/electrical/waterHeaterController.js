const ElectricalModels = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const shouldLog = process.env.APP_DEBUG === 'true';

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

function coerceAmps(maybeAmps) {
  if (!maybeAmps) return [];
  if (typeof maybeAmps === 'string') {
    try {
      const parsed = JSON.parse(maybeAmps);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (Array.isArray(maybeAmps)) {
    const jsonCandidate = maybeAmps.find(v => typeof v === 'string' && v.trim().startsWith('['));
    if (jsonCandidate) {
      try {
        const parsed = JSON.parse(jsonCandidate);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // fallthrough to validation of object entries
      }
    }
    return maybeAmps;
  }
  return [];
}

function sanitizeAmps(amps) {
  if (!Array.isArray(amps)) return [];
  return amps.filter(amp =>
    amp && typeof amp === 'object' && amp.amps && amp.amps.trim() !== '' &&
    amp.price !== undefined && !isNaN(Number(amp.price))
  );
}

exports.createWaterHeater = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[WaterHeater] Create request');
      console.log('[WaterHeater] Body:', req.body);
      console.log('[WaterHeater] Files:', req.files);
    }

    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }

    if (shouldLog) console.log('[WaterHeater] Uploading images to Cloudinary...');
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    if (shouldLog) console.log('[WaterHeater] Uploaded URLs:', photoUrls);

    // Parse amps and tag if sent as JSON string or array entries
    let { amps, tag, ...rest } = req.body;
    if (shouldLog) {
      console.log('[WaterHeater] Raw amps:', amps);
      console.log('[WaterHeater] Raw tag:', tag);
    }

    // Coerce and sanitize amps
    const coercedAmps = coerceAmps(amps);
    const finalAmps = sanitizeAmps(coercedAmps);

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
      amps: finalAmps,
      tag,
      photos: photoUrls,
      category: rest.category || 'WaterHeater'
    };

    if (shouldLog) console.log('[WaterHeater] Creating with data:', productData);
    const product = new ElectricalModels(productData);
    await product.save();
    if (shouldLog) console.log('[WaterHeater] Created:', product._id);

    res.status(201).json(product);
  } catch (err) {
    console.error('Error in createWaterHeater:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllWaterHeater = async (req, res) => {
  try {
    const products = await ElectricalModels.find({ category: 'Waterheater' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneWaterHeater = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, category: 'Waterheater' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWaterHeater = async (req, res) => {
  try {
    if (shouldLog) {
      console.log('[WaterHeater] Update id:', req.params.id);
      console.log('[WaterHeater] Body:', req.body);
      console.log('[WaterHeater] Files:', req.files);
    }

    let update = { ...req.body };

    if (update.amps) {
      update.amps = sanitizeAmps(coerceAmps(update.amps));
    }

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

    const product = await ElectricalModels.findOneAndUpdate(
      { _id: req.params.id, category: 'Waterheater' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });

    res.json(product);
  } catch (err) {
    console.error('Error in updateWaterHeater:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteWaterHeater = async (req, res) => {
  try {
    const product = await ElectricalModels.findOneAndDelete({ _id: req.params.id, category: 'Waterheater' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
