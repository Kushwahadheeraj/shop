const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ToolsModel = require('../../models/ToolsModel');

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

// Create a new tool
exports.createTool = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const toolData = {
      ...req.body,
      image: imageUrl
    };

    const tool = new ToolsModel(toolData);
    const savedTool = await tool.save();
    
    res.status(201).json({
      success: true,
      message: 'Tool created successfully',
      data: savedTool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating tool',
      error: error.message
    });
  }
};

// Get all tools
exports.getAllTools = async (req, res) => {
  try {
    const tools = await ToolsModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tools',
      error: error.message
    });
  }
};

// Get tools by category
exports.getToolsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const tools = await ToolsModel.find({ category, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tools.length,
      data: tools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tools by category',
      error: error.message
    });
  }
};

// Get one tool by ID
exports.getOneTool = async (req, res) => {
  try {
    const tool = await ToolsModel.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }
    res.status(200).json({
      success: true,
      data: tool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tool',
      error: error.message
    });
  }
};

// Update tool by ID
exports.updateTool = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const tool = await ToolsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Tool updated successfully',
      data: tool
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tool',
      error: error.message
    });
  }
};

// Delete tool by ID
exports.deleteTool = async (req, res) => {
  try {
    const tool = await ToolsModel.findByIdAndDelete(req.params.id);
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: 'Tool not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Tool deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tool',
      error: error.message
    });
  }
}; 