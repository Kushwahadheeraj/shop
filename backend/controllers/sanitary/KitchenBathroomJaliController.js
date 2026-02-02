const Sanitary = require('../../models/SanitaryModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createKitchenBathroomJali = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));

    let productData = { ...req.body, photos: photoUrls, category: 'KitchenBathroomJali' };

    if (req.body.price && !req.body.fixPrice) {
      productData.fixPrice = parseFloat(req.body.price);
      delete productData.price;
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      try { productData.tags = JSON.parse(req.body.tags); } catch (_) { productData.tags = [req.body.tags]; }
    }

    if (req.body.variants && typeof req.body.variants === 'string') {
      try { productData.variants = JSON.parse(req.body.variants); } catch (_) {}
    }
    
    if (typeof req.body.customFields === 'string') {
      try {
        const parsed = JSON.parse(req.body.customFields);
        if (Array.isArray(parsed)) {
          productData.customFields = parsed;
        } else {
          delete productData.customFields;
        }
      } catch (e) {
        delete productData.customFields;
      }
    }

    if (!productData.customFields) {
        const customFields = [];
        for (let i = 1; i <= 10; i++) {
          const fieldName = req.body[`customFieldName${i}`];
          const fieldValue = req.body[`customFieldValue${i}`];
          
          if (fieldName && fieldName.trim()) {
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

    const candidateRates = Array.isArray(productData.variants)
      ? productData.variants.map(v => parseFloat(v.price)).filter(n => !isNaN(n))
      : [];
    if (candidateRates.length > 0) {
      productData.minPrice = Math.min(...candidateRates);
      productData.maxPrice = Math.max(...candidateRates);
    }

    if (productData.minPrice === undefined && productData.fixPrice) {
      productData.minPrice = parseFloat(productData.fixPrice);
    }
    if (productData.maxPrice === undefined && productData.fixPrice) {
      productData.maxPrice = parseFloat(productData.fixPrice);
    }

    const numericFields = ['fixPrice', 'discount', 'totalProduct', 'minPrice', 'maxPrice', 'discountPrice'];
    numericFields.forEach(field => {
        if (productData[field] === '' || productData[field] === null || productData[field] === undefined || productData[field] === 'NaN') {
            delete productData[field];
        } else {
            productData[field] = parseFloat(productData[field]);
        }
    });

    if (productData.maxPrice !== undefined && productData.minPrice !== undefined && productData.maxPrice < productData.minPrice) {
      return res.status(400).json({ error: 'maxPrice must be greater than or equal to minPrice' });
    }

    const newProduct = new Sanitary(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('Error creating KitchenBathroomJali product:', err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      return res.status(400).json({ error: 'Validation Error', details: err.message });
    }
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getAllKitchenBathroomJali = async (req, res) => {
  try {
    const products = await Sanitary.find({ category: 'KitchenBathroomJali' });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching KitchenBathroomJali products:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getKitchenBathroomJaliById = async (req, res) => {
  try {
    const product = await Sanitary.findOne({ _id: req.params.id, category: 'KitchenBathroomJali' });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching KitchenBathroomJali product:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateKitchenBathroomJali = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    let existingPhotos = [];
    if (updateData.existingPhotos) {
        existingPhotos = Array.isArray(updateData.existingPhotos) ? updateData.existingPhotos : [updateData.existingPhotos];
        delete updateData.existingPhotos;
    }

    if (req.files && req.files.length > 0) {
      const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      updateData.photos = [...existingPhotos, ...photoUrls];
    } else if (existingPhotos.length > 0) {
      updateData.photos = existingPhotos;
    }

    if (updateData.variants) {
       if (typeof updateData.variants === 'string') {
          try { updateData.variants = JSON.parse(updateData.variants); } catch (_) {}
       }
    }
    
    const customFields = [];
    for (let i = 1; i <= 10; i++) {
      const fieldName = req.body[`customFieldName${i}`];
      const fieldValue = req.body[`customFieldValue${i}`];
      if (fieldName && fieldName.trim()) {
        const fieldValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        customFields.push({
          fieldName: fieldName.trim(),
          fieldValues: fieldValues.filter(val => val && val.trim())
        });
      }
    }
    if (customFields.length > 0) {
      updateData.customFields = customFields;
    }

    const updatedProduct = await Sanitary.findOneAndUpdate(
      { _id: id, category: 'KitchenBathroomJali' },
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating KitchenBathroomJali product:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteKitchenBathroomJali = async (req, res) => {
  try {
    const deletedProduct = await Sanitary.findOneAndDelete({ _id: req.params.id, category: 'KitchenBathroomJali' });
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting KitchenBathroomJali product:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
