const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ItemsModel = require('../../models/ItemsModel');

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

// Create a new item
exports.createItem = async (req, res) => {
  try {
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image is required'
      });
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    try {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    } catch (uploadError) {
            return res.status(500).json({
        success: false,
        message: 'Error uploading image to Cloudinary',
        error: uploadError.message
      });
    }

    // Validate required fields
    if (!req.body.link || !req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Link and title are required fields'
      });
    }

    const itemData = {
      image: imageUrl,
      link: req.body.link,
      title: req.body.title,
      subtitle: req.body.subtitle || ''
    };

    const item = new ItemsModel(itemData);
    const savedItem = await item.save();
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: savedItem
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await ItemsModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message
    });
  }
};

// Get one item by ID
exports.getOneItem = async (req, res) => {
  try {
    const item = await ItemsModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
};

// Update item by ID
exports.updateItem = async (req, res) => {
  try {
    let updateData = {
      link: req.body.link,
      title: req.body.title,
      subtitle: req.body.subtitle || ''
    };
    
    // Handle image upload if provided
    if (req.file) {
      try {
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        updateData.image = imageUrl;
      } catch (uploadError) {
                return res.status(500).json({
          success: false,
          message: 'Error uploading image to Cloudinary',
          error: uploadError.message
        });
      }
    }

    // Validate required fields
    if (!req.body.link || !req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Link and title are required fields'
      });
    }

    const item = await ItemsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};

// Delete item by ID
exports.deleteItem = async (req, res) => {
  try {
    const item = await ItemsModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
}; 