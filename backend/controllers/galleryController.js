const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const GalleryModel = require('../models/GalleryModels');

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

// Create a new gallery
exports.createGallery = async (req, res) => {
  try {
    let imageUrl = '';
    
    // Handle image upload if provided
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const galleryData = {
      ...req.body,
      image: imageUrl
    };

    const gallery = new GalleryModel(galleryData);
    const savedGallery = await gallery.save();
    
    res.status(201).json({
      success: true,
      message: 'Gallery created successfully',
      data: savedGallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating gallery',
      error: error.message
    });
  }
};

// Get all gallerys
exports.getAllGallerys = async (req, res) => {
  try {
    const gallerys = await GalleryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: gallerys.length,
      data: gallerys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallerys',
      error: error.message
    });
  }
};

// Get gallerys by category
exports.getGallerysByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const gallerys = await GalleryModel.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: gallerys.length,
      data: gallerys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallerys by category',
      error: error.message
    });
  }
};

// Get one gallery by ID
exports.getOneGallery = async (req, res) => {
  try {
    const gallery = await GalleryModel.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }
    res.status(200).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery',
      error: error.message
    });
  }
};

// Update gallery by ID
exports.updateGallery = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle image upload if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const gallery = await GalleryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Gallery updated successfully',
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating gallery',
      error: error.message
    });
  }
};

// Delete gallery by ID
exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await GalleryModel.findByIdAndDelete(req.params.id);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery',
      error: error.message
    });
  }
}; 