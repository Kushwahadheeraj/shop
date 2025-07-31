// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const AdhesivesModels = require('../models/AdhesivesModels');
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
 * Create a new Adhesives product.
 */
exports.createAdhesives = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));

    // Parse weights and tag if sent as JSON string
    let { weights, tag, ...rest } = req.body;
    if (typeof weights === 'string') {
      weights = JSON.parse(weights);
    }
    if (typeof tag === 'string') {
      // If tag is a single string, wrap in array
      try {
        tag = JSON.parse(tag);
      } catch {
        tag = [tag];
      }
    }

    const product = new AdhesivesModels({
      ...rest,
      weights,
      tag,
      photos: photoUrls,
      category: 'adhesives'
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Adhesives product by ID.
 */
exports.updateAdhesives = async (req, res) => {
  try {
    console.log('Update request received:', req.params.id);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    let update = { ...req.body };
    
    // Parse weights and tag if sent as JSON string
    if (update.weights && typeof update.weights === 'string') {
      update.weights = JSON.parse(update.weights);
    }
    
    // Filter out invalid weight entries
    if (update.weights && Array.isArray(update.weights)) {
      update.weights = update.weights.filter(weight => 
        weight && 
        typeof weight === 'object' && 
        weight.weight && 
        weight.price && 
        weight.weight.trim() !== '' && 
        !isNaN(Number(weight.price))
      );
    }
    
    if (update.tag && typeof update.tag === 'string') {
      // If tag is a single string, wrap in array
      try {
        update.tag = JSON.parse(update.tag);
      } catch {
        update.tag = [update.tag];
      }
    }
    
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    
    console.log('Final update object:', update);
    
    const product = await AdhesivesModels.findOneAndUpdate(
      { _id: req.params.id, category: 'adhesives' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('Error in updateAdhesives:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.getOneAdhesives = async (req, res) => {
  try {
    const adhesive = await AdhesivesModels.findById(req.params.id);
    if (!adhesive) return res.status(404).json({ message: 'Not found' });
    res.json(adhesive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAdhesives = async (req, res) => {
  try {
    const adhesives = await AdhesivesModels.find();
    res.json(adhesives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAdhesives = async (req, res) => {
  try {
    const adhesive = await AdhesivesModels.findByIdAndDelete(req.params.id);
    if (!adhesive) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
