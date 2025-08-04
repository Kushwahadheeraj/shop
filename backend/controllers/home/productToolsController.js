const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ProductToolsModel = require('../../models/ProductToolsModel');

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