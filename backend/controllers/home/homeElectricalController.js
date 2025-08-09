const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const HomeElectricalModel = require('../../models/HomeElectricalModel');
// Import main ElectricalModels to source categories and products from main electrical DB
const ElectricalModels = require('../../models/ElectricalModels');

// Upload photos to Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create a new home electrical product
exports.createHomeElectrical = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle photos upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    // Handle tags array - if tags is sent as multiple values, it will be an array
    let tags = [];
    if (req.body.tags) {
      // If tags is already an array, use it directly
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      } else {
        // If tags is a single value, convert to array
        tags = [req.body.tags];
      }
    }

    const productData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      brand: req.body.brand,
      image: imageUrl,
      tags: tags
    };

    const product = new HomeElectricalModel(productData);
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Home electrical product created successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating home electrical product',
      error: error.message
    });
  }
};

// Get all home electrical products (with optional category filter and first-per-category mode)
exports.getAllHomeElectrical = async (req, res) => {
  try {
    const { categories, firstPerCategory } = req.query;

    if (firstPerCategory === 'true') {
      let categoryList = [];
      if (categories) {
        try {
          const parsed = JSON.parse(categories);
          if (Array.isArray(parsed)) categoryList = parsed;
        } catch {
          categoryList = String(categories)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }

      if (categoryList.length === 0) {
        categoryList = await ElectricalModels.distinct('category');
      }

      const results = await Promise.all(
        categoryList.map(async (cat) => {
          const doc = await ElectricalModels
            .findOne({ category: cat })
            .sort({ createdAt: 1 });
          return doc ? { category: cat, product: doc } : { category: cat, product: null };
        })
      );

      return res.status(200).json({ success: true, data: results.filter((r) => r.product) });
    }

    const filter = { isActive: true };
    if (categories) {
      try {
        const parsed = JSON.parse(categories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          filter.category = { $in: parsed };
        }
      } catch {
        const list = String(categories)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        if (list.length > 0) filter.category = { $in: list };
      }
    }

    // When not in firstPerCategory mode, still return Home model list
    const products = await HomeElectricalModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home electrical products',
      error: error.message,
    });
  }
};

// Get home electrical products by category
exports.getHomeElectricalByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await HomeElectricalModel.find({ category, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home electrical products by category',
      error: error.message
    });
  }
};

// Get categories already selected into HomeElectricalModel
exports.getSelectedCategories = async (req, res) => {
  try {
    const cats = await HomeElectricalModel.distinct('category');
    const filtered = cats.filter(c => typeof c === 'string' && c.trim().length > 0);
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching selected categories', error: error.message });
  }
};

// Select categories: copy first product from main ElectricalModels into HomeElectricalModel (if not exists)
exports.selectCategories = async (req, res) => {
  try {
    let { categories } = req.body;
    if (!categories) categories = [];
    if (typeof categories === 'string') {
      try { categories = JSON.parse(categories); } catch { categories = String(categories).split(',').map(s => s.trim()).filter(Boolean); }
    }
    if (!Array.isArray(categories)) categories = [];

    const results = [];
    for (const cat of categories) {
      if (!cat) continue;
      // skip if already selected
      const exists = await HomeElectricalModel.findOne({ category: cat });
      if (exists) {
        results.push({ category: cat, status: 'exists', id: exists._id });
        continue;
      }
      // source from main electrical collection
      const src = await ElectricalModels.findOne({ category: cat }).sort({ createdAt: 1 });
      if (!src) {
        results.push({ category: cat, status: 'not_found' });
        continue;
      }
      const doc = new HomeElectricalModel({
        name: src.name,
        description: src.description,
        category: src.category,
        price: src.fixPrice ?? src.discountPrice ?? src.price ?? undefined,
        originalPrice: src.price ?? undefined,
        discount: src.discount ?? 0,
        brand: src.brand,
        image: Array.isArray(src.photos) && src.photos.length > 0 ? src.photos[0] : '',
        tags: Array.isArray(src.tag) ? src.tag : (src.tag ? [src.tag] : [])
      });
      await doc.save();
      results.push({ category: cat, status: 'created', id: doc._id });
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error selecting categories', error: error.message });
  }
};

// Get home electrical products by brand
exports.getHomeElectricalByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const products = await HomeElectricalModel.find({ brand, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home electrical products by brand',
      error: error.message
    });
  }
};

// Get one home electrical product by ID
exports.getOneHomeElectrical = async (req, res) => {
  try {
    const product = await HomeElectricalModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Home electrical product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home electrical product',
      error: error.message
    });
  }
};

// Update home electrical product by ID
exports.updateHomeElectrical = async (req, res) => {
  try {
    let updateData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      discount: req.body.discount,
      brand: req.body.brand
    };
    
    // Handle photos upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    // Handle tags array
    if (req.body.tags) {
      let tags = [];
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      } else {
        tags = [req.body.tags];
      }
      updateData.tags = tags;
    }

    const product = await HomeElectricalModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Home electrical product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Home electrical product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating home electrical product',
      error: error.message
    });
  }
};

// Delete home electrical product by ID
exports.deleteHomeElectrical = async (req, res) => {
  try {
    const product = await HomeElectricalModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Home electrical product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Home electrical product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting home electrical product',
      error: error.message
    });
  }
}; 