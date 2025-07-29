const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ToolsImageModel = require('../../models/ToolsImageModel');

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

// Create a new tools image slider
exports.createToolsImage = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const toolsImageData = {
      ...req.body,
      image: imageUrl
    };

    const toolsImage = new ToolsImageModel(toolsImageData);
    const savedToolsImage = await toolsImage.save();
    
    res.status(201).json({
      success: true,
      message: 'Tools image slider created successfully',
      data: savedToolsImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating tools image slider',
      error: error.message
    });
  }
};

// Get all tools image sliders
exports.getAllToolsImages = async (req, res) => {
  try {
    const toolsImages = await ToolsImageModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: toolsImages.length,
      data: toolsImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tools image sliders',
      error: error.message
    });
  }
};

// Get one tools image slider by ID
exports.getOneToolsImage = async (req, res) => {
  try {
    const toolsImage = await ToolsImageModel.findById(req.params.id);
    if (!toolsImage) {
      return res.status(404).json({
        success: false,
        message: 'Tools image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: toolsImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tools image slider',
      error: error.message
    });
  }
};

// Update tools image slider by ID
exports.updateToolsImage = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const toolsImage = await ToolsImageModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!toolsImage) {
      return res.status(404).json({
        success: false,
        message: 'Tools image slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Tools image slider updated successfully',
      data: toolsImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tools image slider',
      error: error.message
    });
  }
};

// Delete tools image slider by ID
exports.deleteToolsImage = async (req, res) => {
  try {
    const toolsImage = await ToolsImageModel.findByIdAndDelete(req.params.id);
    if (!toolsImage) {
      return res.status(404).json({
        success: false,
        message: 'Tools image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Tools image slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tools image slider',
      error: error.message
    });
  }
}; 