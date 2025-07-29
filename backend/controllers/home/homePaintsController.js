const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const HomePaintsModel = require('../../models/HomePaintsModel');

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
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const productData = {
      ...req.body,
      image: imageUrl
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
    const products = await HomePaintsModel.find({ color, isActive: true }).sort({ createdAt: -1 });
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
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
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