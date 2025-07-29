const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ElectricImageModel = require('../../models/ElectricImageModel');

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

// Create a new electric image slider
exports.createElectricImage = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const electricImageData = {
      ...req.body,
      image: imageUrl
    };

    const electricImage = new ElectricImageModel(electricImageData);
    const savedElectricImage = await electricImage.save();
    
    res.status(201).json({
      success: true,
      message: 'Electric image slider created successfully',
      data: savedElectricImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating electric image slider',
      error: error.message
    });
  }
};

// Get all electric image sliders
exports.getAllElectricImages = async (req, res) => {
  try {
    const electricImages = await ElectricImageModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: electricImages.length,
      data: electricImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching electric image sliders',
      error: error.message
    });
  }
};

// Get one electric image slider by ID
exports.getOneElectricImage = async (req, res) => {
  try {
    const electricImage = await ElectricImageModel.findById(req.params.id);
    if (!electricImage) {
      return res.status(404).json({
        success: false,
        message: 'Electric image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: electricImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching electric image slider',
      error: error.message
    });
  }
};

// Update electric image slider by ID
exports.updateElectricImage = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const electricImage = await ElectricImageModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!electricImage) {
      return res.status(404).json({
        success: false,
        message: 'Electric image slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Electric image slider updated successfully',
      data: electricImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating electric image slider',
      error: error.message
    });
  }
};

// Delete electric image slider by ID
exports.deleteElectricImage = async (req, res) => {
  try {
    const electricImage = await ElectricImageModel.findByIdAndDelete(req.params.id);
    if (!electricImage) {
      return res.status(404).json({
        success: false,
        message: 'Electric image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Electric image slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting electric image slider',
      error: error.message
    });
  }
}; 