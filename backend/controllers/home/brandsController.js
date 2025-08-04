const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const BrandsModel = require('../../models/BrandsModel');

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

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    let logoUrl = '';
    
    // Handle logo upload if provided
    if (req.file) {
      logoUrl = await uploadToCloudinary(req.file.buffer);
    }

    const brandData = {
      ...req.body,
      logo: logoUrl
    };

    const brand = new BrandsModel(brandData);
    const savedBrand = await brand.save();
    
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: savedBrand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating brand',
      error: error.message
    });
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await BrandsModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brands',
      error: error.message
    });
  }
};

// Get one brand by ID
exports.getOneBrand = async (req, res) => {
  try {
    const brand = await BrandsModel.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    res.status(200).json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching brand',
      error: error.message
    });
  }
};

// Update brand by ID
exports.updateBrand = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // Handle logo upload if provided
    if (req.file) {
      const logoUrl = await uploadToCloudinary(req.file.buffer);
      updateData.logo = logoUrl;
    }

    const brand = await BrandsModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating brand',
      error: error.message
    });
  }
};

// Delete brand by ID
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await BrandsModel.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting brand',
      error: error.message
    });
  }
}; 