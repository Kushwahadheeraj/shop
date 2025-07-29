const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const CardSliderModel = require('../../models/CardSliderModel');

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

// Create a new card slider
exports.createCardSlider = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const cardSliderData = {
      ...req.body,
      image: imageUrl
    };

    const cardSlider = new CardSliderModel(cardSliderData);
    const savedCardSlider = await cardSlider.save();
    
    res.status(201).json({
      success: true,
      message: 'Card slider created successfully',
      data: savedCardSlider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating card slider',
      error: error.message
    });
  }
};

// Get all card sliders
exports.getAllCardSliders = async (req, res) => {
  try {
    const cardSliders = await CardSliderModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cardSliders.length,
      data: cardSliders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching card sliders',
      error: error.message
    });
  }
};

// Get one card slider by ID
exports.getOneCardSlider = async (req, res) => {
  try {
    const cardSlider = await CardSliderModel.findById(req.params.id);
    if (!cardSlider) {
      return res.status(404).json({
        success: false,
        message: 'Card slider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: cardSlider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching card slider',
      error: error.message
    });
  }
};

// Update card slider by ID
exports.updateCardSlider = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const cardSlider = await CardSliderModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!cardSlider) {
      return res.status(404).json({
        success: false,
        message: 'Card slider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Card slider updated successfully',
      data: cardSlider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating card slider',
      error: error.message
    });
  }
};

// Delete card slider by ID
exports.deleteCardSlider = async (req, res) => {
  try {
    const cardSlider = await CardSliderModel.findByIdAndDelete(req.params.id);
    if (!cardSlider) {
      return res.status(404).json({
        success: false,
        message: 'Card slider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Card slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting card slider',
      error: error.message
    });
  }
}; 