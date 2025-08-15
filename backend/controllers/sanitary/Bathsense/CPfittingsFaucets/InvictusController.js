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
 * Create a new Invictus product.
 */
exports.createInvictus = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));

    // Build product data with proper mappings and parsing
    let productData = { ...req.body, photos: photoUrls, category: 'Invictus' };

    // Map price -> fixPrice if needed
    if (req.body.price && !req.body.fixPrice) {
      productData.fixPrice = parseFloat(req.body.price);
      delete productData.price;
    }

    // Parse tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      try { productData.tags = JSON.parse(req.body.tags); } catch (_) { productData.tags = [req.body.tags]; }
    }

    // Parse variants for min/max calculation support
    if (req.body.variants && typeof req.body.variants === 'string') {
      try { productData.variants = JSON.parse(req.body.variants); } catch (_) {}
    
    // Process Custom Fields
    const customFields = [];
    for (let i = 1; i <= 10; i++) { // Support up to 10 custom fields
      const fieldName = req.body[`customFieldName${i}`];
      const fieldValue = req.body[`customFieldValue${i}`];
      
      if (fieldName && fieldName.trim()) {
        // Handle multiple values for the same field
        const fieldValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        customFields.push({
          fieldName: fieldName.trim(),
          fieldValues: fieldValues.filter(val => val && val.trim())
        });
      }
    }
    
    if (customFields.length > 0) {
      productData.customFields = customFields;
    }

    }

    // Derive minPrice/maxPrice if not provided explicitly
    const candidateRates = Array.isArray(productData.variants)
      ? productData.variants.map(v => parseFloat(v.price)).filter(n => !isNaN(n))
      : [];
    if (candidateRates.length > 0) {
      productData.minPrice = Math.min(...candidateRates);
      productData.maxPrice = Math.max(...candidateRates);
    }

    // If still missing, fallback to fixPrice
    if (productData.minPrice === undefined && productData.fixPrice) {
      productData.minPrice = parseFloat(productData.fixPrice);
    }
    if (productData.maxPrice === undefined && productData.fixPrice) {
      productData.maxPrice = parseFloat(productData.fixPrice);
    }

    // Numeric parsing
    if (productData.fixPrice) productData.fixPrice = parseFloat(productData.fixPrice);
    if (productData.discount) productData.discount = parseFloat(productData.discount);
    if (productData.totalProduct) productData.totalProduct = parseInt(productData.totalProduct, 10);
    if (productData.minPrice) productData.minPrice = parseFloat(productData.minPrice);
    if (productData.maxPrice) productData.maxPrice = parseFloat(productData.maxPrice);

    if (productData.maxPrice < productData.minPrice) {
      return res.status(400).json({ error: 'maxPrice must be greater than or equal to minPrice' });
    }

    const product = new Sanitary(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Invictus product by ID.
 */
exports.updateInvictus = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    // Map price -> fixPrice
    if (req.body.price && !req.body.fixPrice) {
      update.fixPrice = parseFloat(req.body.price);
      delete update.price;
    }
    // Parse tags
    if (req.body.tags && typeof req.body.tags === 'string') {
      try { update.tags = JSON.parse(req.body.tags); } catch (_) { update.tags = [req.body.tags]; }
    }
    // Parse variants
    if (req.body.variants && typeof req.body.variants === 'string') {
      try { update.variants = JSON.parse(req.body.variants); } catch (_) {} 
    }
    // Derive/validate min/max
    const candidateUpdateRates = Array.isArray(update.variants)
      ? update.variants.map(v => parseFloat(v.price)).filter(n => !isNaN(n))
      : [];
    if (candidateUpdateRates.length > 0) {
      update.minPrice = Math.min(...candidateUpdateRates);
      update.maxPrice = Math.max(...candidateUpdateRates);
    }
    if (update.fixPrice && (update.minPrice === undefined || update.maxPrice === undefined)) {
      const fx = parseFloat(update.fixPrice);
      update.minPrice = update.minPrice === undefined ? fx : update.minPrice;
      update.maxPrice = update.maxPrice === undefined ? fx : update.maxPrice;
    }
    if (update.fixPrice) update.fixPrice = parseFloat(update.fixPrice);
    if (update.discount) update.discount = parseFloat(update.discount);
    if (update.totalProduct) update.totalProduct = parseInt(update.totalProduct, 10);
    if (update.minPrice) update.minPrice = parseFloat(update.minPrice);
    if (update.maxPrice) update.maxPrice = parseFloat(update.maxPrice);
    if (update.maxPrice !== undefined && update.minPrice !== undefined && update.maxPrice < update.minPrice) {
      return res.status(400).json({ error: 'maxPrice must be greater than or equal to minPrice' });
    }
    const product = await Sanitary.findOneAndUpdate(
      { _id: req.params.id, category: 'Invictus' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllInvictus = async (req, res) => {
  try {
    const products = await Sanitary.find({ category: 'Invictus' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneInvictus = async (req, res) => {
  try {
    const product = await Sanitary.findOne({ _id: req.params.id, category: 'Invictus' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInvictus = async (req, res) => {
  try {
    const product = await Sanitary.findOneAndDelete({ _id: req.params.id, category: 'Invictus' });
    if (!product) return res.status(404).json({ message: 'Deleted' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};