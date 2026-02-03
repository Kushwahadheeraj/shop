const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const ShopByCategoryModel = require('../../models/ShopByCategoryModel');
const HomeSectionTitle = require('../../models/HomeSectionTitle');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createItem = async (req, res) => {
  try {
    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const itemData = {
      ...req.body,
      image: imageUrl,
    };

    const item = new ShopByCategoryModel(itemData);
    const savedItem = await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: savedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message,
    });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await ShopByCategoryModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching items',
      error: error.message,
    });
  }
};

exports.getOneItem = async (req, res) => {
  try {
    const item = await ShopByCategoryModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer);
      updateData.image = imageUrl;
    }

    const item = await ShopByCategoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await ShopByCategoryModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message,
    });
  }
};

exports.getTitle = async (req, res) => {
  try {
    let titleDoc = await HomeSectionTitle.findOne({ sectionId: 'shop-by-category' });
    if (!titleDoc) {
      // Default fallback
      return res.status(200).json({
        success: true,
        data: { title: 'SHOP BY CATEGORY' }
      });
    }
    res.status(200).json({
      success: true,
      data: titleDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching title',
      error: error.message
    });
  }
};

exports.updateTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const titleDoc = await HomeSectionTitle.findOneAndUpdate(
      { sectionId: 'shop-by-category' },
      { title },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Title updated successfully',
      data: titleDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating title',
      error: error.message
    });
  }
};
