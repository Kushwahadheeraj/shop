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
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const productToolData = {
      ...req.body,
      image: imageUrl
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
    const productTools = await ProductToolsModel.find({ isActive: true }).sort({ createdAt: -1 });
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
    const productTools = await ProductToolsModel.find({ category, isActive: true }).sort({ createdAt: -1 });
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
    const productTools = await ProductToolsModel.find({ brand, isActive: true }).sort({ createdAt: -1 });
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
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
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