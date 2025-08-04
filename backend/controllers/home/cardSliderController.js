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

// Create a new card
exports.createCardSlider = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const cardData = {
      ...req.body,
      image: imageUrl
    };

    const cardSlider = new CardSliderModel(cardData);
    const savedCardSlider = await cardSlider.save();
    
    res.status(201).json({
      success: true,
      message: 'CardSlider created successfully',
      data: savedCardSlider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating cardSlider',
      error: error.message
    });
  }
};

// Get all cards
exports.getAllCardSliders = async (req, res) => {
  try {
    const cardSliders = await CardSliderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cardSliders.length,
      data: cardSliders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cardSliders',
      error: error.message
    });
  }
};

// Get cards by category
exports.getCardSlidersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const cardSliders = await CardSliderModel.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cardSliders.length,
      data: cardSliders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cards by category',
      error: error.message
    });
  }
};

// Get one card by ID
exports.getOneCardSlider = async (req, res) => {
  try {
    const cardSlider = await CardSliderModel.findById(req.params.id);
    if (!cardSlider) {
      return res.status(404).json({
        success: false,
        message: 'CardSlider not found'
      });
    }
    res.status(200).json({
      success: true,
      data: cardSlider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cardSlider',
      error: error.message
    });
  }
};

// Update card by ID
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
        message: 'CardSlider not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'CardSlider updated successfully',
      data: cardSlider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cardSlider',
      error: error.message
    });
  }
};

// Delete card by ID
exports.deleteCardSlider = async (req, res) => {
  try {
    const cardSlider = await CardSliderModel.findByIdAndDelete(req.params.id);
    if (!cardSlider) {
      return res.status(404).json({
        success: false,
        message: 'CardSlider not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'CardSlider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting cardSlider',
      error: error.message
    });
  }
}; 