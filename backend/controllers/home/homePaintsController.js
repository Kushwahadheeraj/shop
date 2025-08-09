const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const HomePaintsModel = require('../../models/HomePaintsModel');
const PaintModels = require('../../models/PaintModels');

// Upload image to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create a new home paint product
exports.createHomePaint = async (req, res) => {
  try {
    console.log('Create home paint request received');
    console.log('Files received:', req.files ? req.files.length : 0);
    console.log('Body received:', req.body);
    
    let imageUrls = [];
    
    // Handle multiple image uploads if provided
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'files');
      for (const file of req.files) {
        console.log('Uploading file:', file.originalname, file.size);
        const imageUrl = await uploadToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
        console.log('Uploaded to:', imageUrl);
      }
    } else {
      console.log('No files received');
    }

    // Parse tags and colors from request body
    let tags = [];
    let colors = [];
    
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(tag => tag.trim()) : req.body.tags;
    }
    
    if (req.body.colors) {
      colors = typeof req.body.colors === 'string' ? req.body.colors.split(',').map(color => color.trim()) : req.body.colors;
    }

    const productData = {
      ...req.body,
      images: imageUrls,
      tags: tags,
      colors: colors,
      price: parseFloat(req.body.price) || 0,
      discount: parseFloat(req.body.discount) || 0
    };

    const product = new HomePaintsModel(productData);
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Home paint product created successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating home paint product',
      error: error.message
    });
  }
};

// Get all home paint products
exports.getAllHomePaints = async (req, res) => {
  try {
    const products = await HomePaintsModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home paint products',
      error: error.message
    });
  }
};

// New: Distinct categories from source PaintModels (only those having data)
exports.getSourceCategories = async (_req, res) => {
  try {
    const cats = await PaintModels.distinct('category');
    const filtered = cats.filter(c => typeof c === 'string' && c.trim().length > 0).sort((a,b)=>a.localeCompare(b));
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching paint categories', error: error.message });
  }
};

// New: Distinct categories already selected into HomePaintsModel
exports.getSelectedCategories = async (_req, res) => {
  try {
    const cats = await HomePaintsModel.distinct('category');
    const filtered = cats.filter(c => typeof c === 'string' && c.trim().length > 0).sort((a,b)=>a.localeCompare(b));
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching selected paint categories', error: error.message });
  }
};

// New: Select categories → copy first product from PaintModels into HomePaintsModel (if not exists)
exports.selectCategories = async (req, res) => {
  try {
    let { categories } = req.body;
    if (!categories) categories = [];
    if (typeof categories === 'string') {
      try { categories = JSON.parse(categories); } catch { categories = String(categories).split(',').map(s=>s.trim()).filter(Boolean); }
    }
    if (!Array.isArray(categories)) categories = [];

    const results = [];
    for (const cat of categories) {
      if (!cat) continue;
      const exists = await HomePaintsModel.findOne({ category: cat });
      if (exists) { results.push({ category: cat, status: 'exists', id: exists._id }); continue; }
      const src = await PaintModels.findOne({ category: cat }).sort({ createdAt: 1 });
      if (!src) { results.push({ category: cat, status: 'not_found' }); continue; }
      const doc = new HomePaintsModel({
        name: src.name,
        description: src.description,
        category: src.category,
        brand: src.brand,
        price: src.fixPrice ?? 0,
        discount: (typeof src.discountPercent === 'number' ? src.discountPercent : (src.discount || 0)),
        tags: Array.isArray(src.tags) ? src.tags : (src.tags ? [src.tags] : []),
        colors: Array.isArray(src.colors) ? src.colors : [],
        images: Array.isArray(src.photos) && src.photos.length > 0 ? [src.photos[0]] : [],
        isActive: true
      });
      await doc.save();
      results.push({ category: cat, status: 'created', id: doc._id });
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error selecting paint categories', error: error.message });
  }
};

// Get home paint products by category
exports.getHomePaintsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await HomePaintsModel.find({ category, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home paint products by category',
      error: error.message
    });
  }
};

// Get home paint products by brand
exports.getHomePaintsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const products = await HomePaintsModel.find({ brand, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home paint products by brand',
      error: error.message
    });
  }
};

// Get home paint products by color
exports.getHomePaintsByColor = async (req, res) => {
  try {
    const { color } = req.params;
    const products = await HomePaintsModel.find({ 
      colors: { $in: [color] }, 
      isActive: true 
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home paint products by color',
      error: error.message
    });
  }
};

// Get home paint products by finish
exports.getHomePaintsByFinish = async (req, res) => {
  try {
    const { finish } = req.params;
    const products = await HomePaintsModel.find({ finish, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home paint products by finish',
      error: error.message
    });
  }
};

// Get one home paint product by ID
exports.getOneHomePaint = async (req, res) => {
  try {
    const product = await HomePaintsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Home paint product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home paint product',
      error: error.message
    });
  }
};

// Update home paint product by ID
exports.updateHomePaint = async (req, res) => {
  try {
    // Parse tags and colors from request body
    let tags = [];
    let colors = [];
    
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(tag => tag.trim()) : req.body.tags;
    }
    
    if (req.body.colors) {
      colors = typeof req.body.colors === 'string' ? req.body.colors.split(',').map(color => color.trim()) : req.body.colors;
    }

    let updateData = {
      ...req.body,
      tags: tags,
      colors: colors,
      price: parseFloat(req.body.price) || 0,
      discount: parseFloat(req.body.discount) || 0
    };
    
    // Handle multiple image uploads if provided
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
      }
      updateData.images = imageUrls;
    }

    const product = await HomePaintsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Home paint product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Home paint product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating home paint product',
      error: error.message
    });
  }
};

// Delete home paint product by ID
exports.deleteHomePaint = async (req, res) => {
  try {
    const product = await HomePaintsModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Home paint product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Home paint product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting home paint product',
      error: error.message
    });
  }
}; 