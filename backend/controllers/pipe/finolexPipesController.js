const Pipe = require('../../models/PipeModels');
// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../../config/cloudinary');
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
 * Create a new FinolexPipes product.
 */
exports.createFinolexPipes = async (req, res) => {
  try {
    // Debug: log received data
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files ? req.files.length : 'No files');
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    // Parse JSON fields if they exist
    let productData = { ...req.body, photos: photoUrls, category: 'FinolexPipes' };
    
    // Parse type field if it's a string
    if (req.body.type && typeof req.body.type === 'string') {
      try {
        productData.type = JSON.parse(req.body.type);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid type field format' });
      }
    }
    
    // Parse tags if it's a string
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        productData.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // If tags parsing fails, treat as single tag
        productData.tags = [req.body.tags];
      }
    }
    
    // Ensure min and max price are numbers
    if (req.body.minPrice) {
      productData.minPrice = parseFloat(req.body.minPrice);
      if (isNaN(productData.minPrice)) {
        return res.status(400).json({ error: 'Invalid min price' });
      }
    }
    
    if (req.body.maxPrice) {
      productData.maxPrice = parseFloat(req.body.maxPrice);
      if (isNaN(productData.maxPrice)) {
        return res.status(400).json({ error: 'Invalid max price' });
      }
    }
    
    // Validate that maxPrice >= minPrice
    if (productData.maxPrice && productData.minPrice && productData.maxPrice < productData.minPrice) {
      return res.status(400).json({ error: 'Max price must be greater than or equal to min price' });
    }
    
    console.log('Product data to save:', productData);
    
    const product = new Pipe(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    
    // Check if it's a validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: Object.values(err.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a FinolexPipes product by ID.
 */
exports.updateFinolexPipes = async (req, res) => {
  try {
    let update = { ...req.body };
    
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    
    // Parse JSON fields if they exist
    if (req.body.type && typeof req.body.type === 'string') {
      try {
        update.type = JSON.parse(req.body.type);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid type field format' });
      }
    }
    
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        update.tags = JSON.parse(req.body.tags);
      } catch (e) {
        update.tags = [req.body.tags];
      }
    }
    
    // Ensure min and max price are numbers
    if (req.body.minPrice) {
      update.minPrice = parseFloat(req.body.minPrice);
      if (isNaN(update.minPrice)) {
        return res.status(400).json({ error: 'Invalid min price' });
      }
    }
    
    if (req.body.maxPrice) {
      update.maxPrice = parseFloat(req.body.maxPrice);
      if (isNaN(update.maxPrice)) {
        return res.status(400).json({ error: 'Invalid max price' });
      }
    }
    
    // Validate that maxPrice >= minPrice
    if (update.maxPrice && update.minPrice && update.maxPrice < update.minPrice) {
      return res.status(400).json({ error: 'Max price must be greater than or equal to min price' });
    }
    
    const product = await Pipe.findOneAndUpdate(
      { _id: req.params.id, category: 'FinolexPipes' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllFinolexPipes = async (req, res) => {
  try {
    const items = await Pipe.find({ category: 'FinolexPipes' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneFinolexPipes = async (req, res) => {
  try {
    const item = await Pipe.findOne({ _id: req.params.id, category: 'FinolexPipes' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFinolexPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndDelete({ _id: req.params.id, category: 'FinolexPipes' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
