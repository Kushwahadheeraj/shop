const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const PaintsImageModel = require('../../models/PaintsImageModel');

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

// Create a new paints image slider
exports.createPaintsImage = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const paintsImageData = {
      ...req.body,
      image: imageUrl
    };

    const paintsImage = new PaintsImageModel(paintsImageData);
    const savedPaintsImage = await paintsImage.save();
    
    res.status(201).json({
      success: true,
      message: 'Paints image slider created successfully',
      data: savedPaintsImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating paints image slider',
      error: error.message
    });
  }
};

// Get all paints image sliders
exports.getAllPaintsImages = async (req, res) => {
  try {
    const paintsImages = await PaintsImageModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: paintsImages.length,
      data: paintsImages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching paints image sliders',
      error: error.message
    });
  }
};

// Get one paints image slider by ID
exports.getOnePaintsImage = async (req, res) => {
  try {
    const paintsImage = await PaintsImageModel.findById(req.params.id);
    if (!paintsImage) {
      return res.status(404).json({
        success: false,
        message: 'Paints image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: paintsImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching paints image slider',
      error: error.message
    });
  }
};

// Update paints image slider by ID
exports.updatePaintsImage = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const paintsImage = await PaintsImageModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!paintsImage) {
      return res.status(404).json({
        success: false,
        message: 'Paints image slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Paints image slider updated successfully',
      data: paintsImage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating paints image slider',
      error: error.message
    });
  }
};

// Delete paints image slider by ID
exports.deletePaintsImage = async (req, res) => {
  try {
    const paintsImage = await PaintsImageModel.findByIdAndDelete(req.params.id);
    if (!paintsImage) {
      return res.status(404).json({
        success: false,
        message: 'Paints image slider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Paints image slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting paints image slider',
      error: error.message
    });
  }
}; 