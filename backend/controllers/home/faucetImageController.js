const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const FaucetImageModel = require('../../models/FaucetImageModel');

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

// Create a new faucet image slider
exports.createFaucetImage = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const faucetImageData = {
      ...req.body,
      image: imageUrl
    };

    const faucetImage = new FaucetImageModel(faucetImageData);
    const savedFaucetImage = await faucetImage.save();
    
    res.status(201).json({
      success: true,
      message: 'Faucet image slider created successfully',
      data: savedFaucetImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating faucet image slider',
      error: error.message
    });
  }
};

// Get all faucet image sliders
exports.getAllFaucetImages = async (req, res) => {
  try {
    const faucetImages = await FaucetImageModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: faucetImages.length,
      data: faucetImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faucet image sliders',
      error: error.message
    });
  }
};

// Get one faucet image slider by ID
exports.getOneFaucetImage = async (req, res) => {
  try {
    const faucetImage = await FaucetImageModel.findById(req.params.id);
    if (!faucetImage) {
      return res.status(404).json({
        success: false,
        message: 'Faucet image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: faucetImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faucet image slider',
      error: error.message
    });
  }
};

// Update faucet image slider by ID
exports.updateFaucetImage = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const faucetImage = await FaucetImageModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!faucetImage) {
      return res.status(404).json({
        success: false,
        message: 'Faucet image slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Faucet image slider updated successfully',
      data: faucetImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating faucet image slider',
      error: error.message
    });
  }
};

// Delete faucet image slider by ID
exports.deleteFaucetImage = async (req, res) => {
  try {
    const faucetImage = await FaucetImageModel.findByIdAndDelete(req.params.id);
    if (!faucetImage) {
      return res.status(404).json({
        success: false,
        message: 'Faucet image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Faucet image slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting faucet image slider',
      error: error.message
    });
  }
}; 