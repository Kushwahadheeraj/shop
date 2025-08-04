const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const CardModel = require('../../models/CardModel');

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
exports.createCard = async (req, res) => {
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

    const card = new CardModel(cardData);
    const savedCard = await card.save();
    
    res.status(201).json({
      success: true,
      message: 'Card created successfully',
      data: savedCard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating card',
      error: error.message
    });
  }
};

// Get all cards
exports.getAllCards = async (req, res) => {
  try {
    const cards = await CardModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cards',
      error: error.message
    });
  }
};

// Get cards by category
exports.getCardsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const cards = await CardModel.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: cards.length,
      data: cards
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
exports.getOneCard = async (req, res) => {
  try {
    const card = await CardModel.findById(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    res.status(200).json({
      success: true,
      data: card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching card',
      error: error.message
    });
  }
};

// Update card by ID
exports.updateCard = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const card = await CardModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Card updated successfully',
      data: card
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating card',
      error: error.message
    });
  }
};

// Delete card by ID
exports.deleteCard = async (req, res) => {
  try {
    const card = await CardModel.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Card not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting card',
      error: error.message
    });
  }
}; 