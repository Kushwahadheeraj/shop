const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const HomeElectricalModel = require('../../models/HomeElectricalModel');

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
      photos: imageUrl,
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

// Get all home electrical products
exports.getAllHomeElectrical = async (req, res) => {
  try {
    const products = await HomeElectricalModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching home electrical products',
      error: error.message
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
      updateData.photos = imageUrl;
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