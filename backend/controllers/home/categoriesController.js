const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const CategoriesModel = require('../../models/CategoriesModel');

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

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const categoryData = {
      ...req.body,
      image: imageUrl
    };

    const category = new CategoriesModel(categoryData);
    const savedCategory = await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: savedCategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Get all cards
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoriesModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get cards by category
exports.getCategoriesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const categories = await CategoriesModel.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories by category',
      error: error.message
    });
  }
};

// Get one card by ID
exports.getOneCategory = async (req, res) => {
  try {
    const category = await CategoriesModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};

// Update card by ID
exports.updateCategory = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const category = await CategoriesModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete card by ID
exports.deleteCategory = async (req, res) => {
  try {
    const category = await CategoriesModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
}; 