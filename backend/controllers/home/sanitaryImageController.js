const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const SanitaryImageModel = require('../../models/SanitaryImageModel');

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

// Create a new sanitary image slider
exports.createSanitaryImage = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const sanitaryImageData = {
      ...req.body,
      image: imageUrl
    };

    const sanitaryImage = new SanitaryImageModel(sanitaryImageData);
    const savedSanitaryImage = await sanitaryImage.save();
    
    res.status(201).json({
      success: true,
      message: 'Sanitary image slider created successfully',
      data: savedSanitaryImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating sanitary image slider',
      error: error.message
    });
  }
};

// Get all sanitary image sliders
exports.getAllSanitaryImages = async (req, res) => {
  try {
    const sanitaryImages = await SanitaryImageModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: sanitaryImages.length,
      data: sanitaryImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sanitary image sliders',
      error: error.message
    });
  }
};

// Get one sanitary image slider by ID
exports.getOneSanitaryImage = async (req, res) => {
  try {
    const sanitaryImage = await SanitaryImageModel.findById(req.params.id);
    if (!sanitaryImage) {
      return res.status(404).json({
        success: false,
        message: 'Sanitary image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: sanitaryImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sanitary image slider',
      error: error.message
    });
  }
};

// Update sanitary image slider by ID
exports.updateSanitaryImage = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const sanitaryImage = await SanitaryImageModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!sanitaryImage) {
      return res.status(404).json({
        success: false,
        message: 'Sanitary image slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Sanitary image slider updated successfully',
      data: sanitaryImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sanitary image slider',
      error: error.message
    });
  }
};

// Delete sanitary image slider by ID
exports.deleteSanitaryImage = async (req, res) => {
  try {
    const sanitaryImage = await SanitaryImageModel.findByIdAndDelete(req.params.id);
    if (!sanitaryImage) {
      return res.status(404).json({
        success: false,
        message: 'Sanitary image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Sanitary image slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sanitary image slider',
      error: error.message
    });
  }
}; 