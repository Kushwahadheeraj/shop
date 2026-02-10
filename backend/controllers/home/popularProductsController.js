const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const PopularProductsModel = require('../../models/PopularProductsModel');

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

// Create a new popular product
exports.createPopularProduct = async (req, res) => {
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
              }
    }

    // Parse variants from request body
    let variants = [];
    if (req.body.variants) {
      try {
        variants = JSON.parse(req.body.variants);
      } catch (e) {
              }
    }

    const productData = {
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

    const product = new PopularProductsModel(productData);
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      message: 'Popular product created successfully',
      data: savedProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating popular product',
      error: error.message
    });
  }
};

// Get all popular products
exports.getAllPopularProducts = async (req, res) => {
  try {
    const products = await PopularProductsModel.find({ isActive: true }).sort({ rating: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular products',
      error: error.message
    });
  }
};

// Get popular products by category
exports.getPopularProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await PopularProductsModel.find({ category, isActive: true }).sort({ rating: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular products by category',
      error: error.message
    });
  }
};

// Get top rated popular products
exports.getTopRatedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const products = await PopularProductsModel.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(parseInt(limit));
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching top rated products',
      error: error.message
    });
  }
};

// Get one popular product by ID
exports.getOnePopularProduct = async (req, res) => {
  try {
    const product = await PopularProductsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Popular product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular product',
      error: error.message
    });
  }
};

// Update popular product by ID
exports.updatePopularProduct = async (req, res) => {
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
              }
    }

    // Parse variants from request body
    let variants = [];
    if (req.body.variants) {
      try {
        variants = JSON.parse(req.body.variants);
      } catch (e) {
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

    const product = await PopularProductsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Popular product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Popular product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating popular product',
      error: error.message
    });
  }
};

// Delete popular product by ID
exports.deletePopularProduct = async (req, res) => {
  try {
    const product = await PopularProductsModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Popular product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Popular product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting popular product',
      error: error.message
    });
  }
}; 