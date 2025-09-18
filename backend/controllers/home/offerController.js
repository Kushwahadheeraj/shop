const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const OfferModel = require('../../models/OfferModel');

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

// Create a new offer
exports.createOffer = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const offerData = {
      title: req.body.title,
      description: req.body.description,
      image: imageUrl
    };

    const offer = new OfferModel(offerData);
    const savedOffer = await offer.save();
    
    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      data: savedOffer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating offer',
      error: error.message
    });
  }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await OfferModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offers',
      error: error.message
    });
  }
};

// Get offers by offer type
exports.getOffersByType = async (req, res) => {
  try {
    const { offerType } = req.params;
    const offers = await OfferModel.find({ offer: offerType, isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offers by type',
      error: error.message
    });
  }
};

// Get one offer by ID
exports.getOneOffer = async (req, res) => {
  try {
    const offer = await OfferModel.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching offer',
      error: error.message
    });
  }
};

// Update offer by ID
exports.updateOffer = async (req, res) => {
  try {
    let updateData = {
      title: req.body.title,
      description: req.body.description
    };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const offer = await OfferModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Offer updated successfully',
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating offer',
      error: error.message
    });
  }
};

// Delete offer by ID
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await OfferModel.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting offer',
      error: error.message
    });
  }
}; 