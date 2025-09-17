const ProductToolsModel = require('../../models/ProductToolsModel');
const ToolsModels = require('../../models/ToolsModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

// Get selected categories
exports.getSelectedCategories = async (req, res) => {
  try {
    const cats = await ProductToolsModel.distinct('category');
    const filtered = cats.filter(c => typeof c === 'string' && c.trim().length > 0);
    res.status(200).json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching selected categories', error: error.message });
  }
};

// Select categories: copy first product from main ToolsModels into ProductToolsModel
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
      const exists = await ProductToolsModel.findOne({ category: cat });
      if (exists) {
        results.push({ category: cat, status: 'exists', id: exists._id });
        continue;
      }
      const src = await ToolsModels.findOne({ category: cat }).sort({ createdAt: 1 });
      if (!src) {
        results.push({ category: cat, status: 'not_found' });
        continue;
      }
      const doc = new ProductToolsModel({
        name: src.name,
        description: src.description,
        category: src.category,
        minPrice: src.fixPrice ?? src.discountPrice ?? undefined,
        maxPrice: src.fixPrice ?? undefined,
        price: src.fixPrice ?? src.discountPrice ?? undefined,
        discount: src.discount ?? 0,
        brand: src.brand,
        images: Array.isArray(src.photos) && src.photos.length > 0 ? [src.photos[0]] : [],
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

// Get all product tools for home (mirror electrical behaviour)
exports.getAll = async (req, res) => {
  try {
    const { categories, firstPerCategory } = req.query;
    if (firstPerCategory === 'true') {
      let categoryList = [];
      if (categories) {
        try {
          const parsed = JSON.parse(categories);
          if (Array.isArray(parsed)) categoryList = parsed;
        } catch {
          categoryList = String(categories).split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      if (categoryList.length === 0) {
        categoryList = await ToolsModels.distinct('category');
      }
      const results = await Promise.all(
        categoryList.map(async (cat) => {
          const doc = await ToolsModels.findOne({ category: cat }).sort({ createdAt: 1 });
          return doc ? { category: cat, product: doc } : { category: cat, product: null };
        })
      );
      return res.status(200).json({ success: true, data: results.filter(r => r.product) });
    }

    const filter = {};
    if (categories) {
      try {
        const parsed = JSON.parse(categories);
        if (Array.isArray(parsed) && parsed.length > 0) {
          filter.category = { $in: parsed };
        }
      } catch {
        const list = String(categories).split(',').map(s => s.trim()).filter(Boolean);
        if (list.length > 0) filter.category = { $in: list };
      }
    }
    const products = await ProductToolsModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching home product tools', error: error.message });
  }
};



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

// Create a new product tool
exports.createProductTool = async (req, res) => {
  try {
    let imageUrls = [];
    
    // Handle multiple image uploads if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
      }
    }

    // Parse tags from request body
    let tags = [];
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(tag => tag.trim()) : req.body.tags;
    }

    // Parse custom fields from request body
    let customFields = [];
    if (req.body.customFields) {
      try {
        customFields = JSON.parse(req.body.customFields);
      } catch (e) {
        console.log('Error parsing custom fields:', e);
      }
    }

    // Parse variants from request body
    let variants = [];
    if (req.body.variants) {
      try {
        variants = JSON.parse(req.body.variants);
      } catch (e) {
        console.log('Error parsing variants:', e);
      }
    }

    const productToolData = {
      ...req.body,
      images: imageUrls,
      tags: tags,
      customFields: customFields,
      variants: variants,
      price: parseFloat(req.body.price) || 0,
      minPrice: parseFloat(req.body.minPrice) || 0,
      maxPrice: parseFloat(req.body.maxPrice) || 0,
      discount: parseFloat(req.body.discount) || 0,
      rating: parseFloat(req.body.rating) || 0
    };

    const productTool = new ProductToolsModel(productToolData);
    const savedProductTool = await productTool.save();
    
    res.status(201).json({
      success: true,
      message: 'Product tool created successfully',
      data: savedProductTool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product tool',
      error: error.message
    });
  }
};

// Get all product tools
exports.getAllProductTools = async (req, res) => {
  try {
    const productTools = await ProductToolsModel.find({ isActive: true }).sort({ rating: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: productTools.length,
      data: productTools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product tools',
      error: error.message
    });
  }
};

// Get product tools by category
exports.getProductToolsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const productTools = await ProductToolsModel.find({ category, isActive: true }).sort({ rating: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: productTools.length,
      data: productTools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product tools by category',
      error: error.message
    });
  }
};

// Get product tools by brand
exports.getProductToolsByBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const productTools = await ProductToolsModel.find({ brand, isActive: true }).sort({ rating: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: productTools.length,
      data: productTools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product tools by brand',
      error: error.message
    });
  }
};

// Get one product tool by ID
exports.getOneProductTool = async (req, res) => {
  try {
    const productTool = await ProductToolsModel.findById(req.params.id);
    if (!productTool) {
      return res.status(404).json({
        success: false,
        message: 'Product tool not found'
      });
    }
    res.status(200).json({
      success: true,
      data: productTool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product tool',
      error: error.message
    });
  }
};

// Update product tool by ID
exports.updateProductTool = async (req, res) => {
  try {
    // Parse tags from request body
    let tags = [];
    if (req.body.tags) {
      tags = typeof req.body.tags === 'string' ? req.body.tags.split(',').map(tag => tag.trim()) : req.body.tags;
    }

    // Parse custom fields from request body
    let customFields = [];
    if (req.body.customFields) {
      try {
        customFields = JSON.parse(req.body.customFields);
      } catch (e) {
        console.log('Error parsing custom fields:', e);
      }
    }

    // Parse variants from request body
    let variants = [];
    if (req.body.variants) {
      try {
        variants = JSON.parse(req.body.variants);
      } catch (e) {
        console.log('Error parsing variants:', e);
      }
    }

    let updateData = { 
      ...req.body,
      tags: tags,
      customFields: customFields,
      variants: variants,
      price: parseFloat(req.body.price) || 0,
      minPrice: parseFloat(req.body.minPrice) || 0,
      maxPrice: parseFloat(req.body.maxPrice) || 0,
      discount: parseFloat(req.body.discount) || 0,
      rating: parseFloat(req.body.rating) || 0
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

    const productTool = await ProductToolsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!productTool) {
      return res.status(404).json({
        success: false,
        message: 'Product tool not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Product tool updated successfully',
      data: productTool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product tool',
      error: error.message
    });
  }
};

// Delete product tool by ID
exports.deleteProductTool = async (req, res) => {
  try {
    const productTool = await ProductToolsModel.findByIdAndDelete(req.params.id);
    if (!productTool) {
      return res.status(404).json({
        success: false,
        message: 'Product tool not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product tool deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product tool',
      error: error.message
    });
  }
}; 