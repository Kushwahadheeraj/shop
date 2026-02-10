const PvcMats = require('../../models/PvcMatsModels');
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
 * Create a new Floor product.
 */
exports.createFloor = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    
    // Prepare product data with proper field mapping
    let productData = { ...req.body, photos: photoUrls, category: 'Floor' };
    
    // Handle price field mapping (frontend sends 'price', backend expects 'fixPrice')
    if (req.body.price && !req.body.fixPrice) {
      productData.fixPrice = parseFloat(req.body.price);
      delete productData.price;
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
    
    // Parse variants if present
    if (req.body.variants && typeof req.body.variants === 'string') {
      try {
        productData.variants = JSON.parse(req.body.variants);
      } catch (e) {
              }
    }
    
    // Handle custom fields
    const customFields = [];
    for (let i = 1; i <= 3; i++) {
      const fieldName = req.body[`customFieldName${i}`];
      const fieldValues = req.body[`customFieldValue${i}`];
      
      if (fieldName && fieldValues) {
        if (Array.isArray(fieldValues)) {
          customFields.push({
            fieldName: fieldName,
            fieldValues: fieldValues.filter(val => val && val.trim() !== '')
          });
        } else {
          customFields.push({
            fieldName: fieldName,
            fieldValues: [fieldValues].filter(val => val && val.trim() !== '')
          });
        }
      }
    }
    
    if (customFields.length > 0) {
      productData.customFields = customFields;
    }
    
    // Ensure numeric fields are properly parsed
    if (productData.fixPrice) productData.fixPrice = parseFloat(productData.fixPrice);
    if (productData.discount) productData.discount = parseFloat(productData.discount);
    if (productData.totalProduct) productData.totalProduct = parseInt(productData.totalProduct, 10);
    
        
    const product = new PvcMats(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
        res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Floor product by ID.
 */
exports.updateFloor = async (req, res) => {
  try {
    let update = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    
    // Handle price field mapping (frontend sends 'price', backend expects 'fixPrice')
    if (req.body.price && !req.body.fixPrice) {
      update.fixPrice = parseFloat(req.body.price);
      delete update.price;
    }
    
    // Parse tags if it's a string
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        update.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // If tags parsing fails, treat as single tag
        update.tags = [req.body.tags];
      }
    }
    
    // Parse variants if present
    if (req.body.variants && typeof req.body.variants === 'string') {
      try {
        update.variants = JSON.parse(req.body.variants);
      } catch (e) {
              }
    }
    
    // Handle custom fields
    const customFields = [];
    for (let i = 1; i <= 3; i++) {
      const fieldName = req.body[`customFieldName${i}`];
      const fieldValues = req.body[`customFieldValue${i}`];
      
      if (fieldName && fieldValues) {
        if (Array.isArray(fieldValues)) {
          customFields.push({
            fieldName: fieldName,
            fieldValues: fieldValues.filter(val => val && val.trim() !== '')
          });
        } else {
          customFields.push({
            fieldName: fieldName,
            fieldValues: [fieldValues].filter(val => val && val.trim() !== '')
          });
        }
      }
    }
    
    if (customFields.length > 0) {
      update.customFields = customFields;
    }
    
    // Ensure numeric fields are properly parsed
    if (update.fixPrice) update.fixPrice = parseFloat(update.fixPrice);
    if (update.discount) update.discount = parseFloat(update.discount);
    if (update.totalProduct) update.totalProduct = parseInt(update.totalProduct, 10);
    
        
    const product = await PvcMats.findOneAndUpdate(
      { _id: req.params.id, category: 'Floor' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
        res.status(500).json({ error: err.message });
  }
};
exports.getAllFloor = async (req, res) => {
  try {
    const products = await PvcMats.find({ category: 'Floor' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneFloor = async (req, res) => {
  try {
    const product = await PvcMats.findOne({ _id: req.params.id, category: 'Floor' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFloor = async (req, res) => {
  try {
    const product = await PvcMats.findOneAndDelete({ _id: req.params.id, category: 'Floor' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
