 // AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.
 
 const Seller = require('../models/Seller');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const multer = require('multer');
 const mongoose = require('mongoose');

// Try to configure Cloudinary if credentials are available
let cloudinary = null;
try {
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
} catch (error) {
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * Uploads a buffer to Cloudinary and returns the secure URL.
 * Falls back to MongoDB GridFS if Cloudinary is not configured.
 * @param {Buffer} buffer
 * @param {{filename?: string, mimetype?: string}} options
 * @returns {Promise<{secure_url: string}>}
 */
function uploadToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    if (cloudinary) {
      // Use Cloudinary if configured
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'seller-avatars',
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      const streamifier = require('streamifier');
      streamifier.createReadStream(buffer).pipe(stream);
    } else {
      // Fallback to MongoDB GridFS
      try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        const filename = options.filename || `avatar_${Date.now()}`;
        const contentType = options.mimetype || 'image/jpeg';
        const uploadStream = bucket.openUploadStream(filename, { contentType });
        const { Readable } = require('stream');
        Readable.from(buffer)
          .pipe(uploadStream)
          .on('finish', () => {
            resolve({ secure_url: `/files/${uploadStream.id.toString()}` });
          })
          .on('error', reject);
      } catch (error) {
        reject(error);
      }
    }
  });
}

/**
 * Seller Login
 */
exports.loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ 
      token, 
      seller: { 
        id: seller._id, 
        email: seller.email, 
        username: seller.username, 
        mobile: seller.mobile,
        shopName: seller.shopName,
        gstNumber: seller.gstNumber,
        avatar: seller.avatar,
        role: seller.role || 'seller',
        status: seller.status || 'active'
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create a new Seller product.
 */
exports.createSeller = async (req, res) => {
  try {
    const { email, password, username, mobile, shopName, gstNumber, avatar } = req.body;
    if (!email || !password || !username || !mobile || !shopName || !gstNumber) {
      return res.status(400).json({ message: 'Email, password, username, mobile number, shop name, and GST number are required.' });
    }
    
    // Check if email already exists
    const existingEmail = await Seller.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already registered' });
    
    // Check if mobile already exists
    const existingMobile = await Seller.findOne({ mobile });
    if (existingMobile) return res.status(400).json({ message: 'Mobile number already registered' });
    
    // Check if GST number already exists
    const existingGST = await Seller.findOne({ gstNumber });
    if (existingGST) return res.status(400).json({ message: 'GST number already registered' });
    
    const seller = new Seller({ email, password, username, mobile, shopName, gstNumber, avatar });
    await seller.save();
    res.status(201).json({ 
      message: 'Registration successful', 
      seller: { 
        id: seller._id, 
        email: seller.email, 
        username: seller.username, 
        mobile: seller.mobile,
        shopName: seller.shopName,
        gstNumber: seller.gstNumber,
        avatar: seller.avatar,
        role: seller.role || 'user',
        status: seller.status || 'active'
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get all Sellers.
 */
exports.getAllSeller = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get one Seller by ID.
 */
exports.getOneSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ error: 'Not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update a Seller product by ID.
 */
exports.updateSeller = async (req, res) => {
  try {
    const { email, password, username, avatar } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { email, password, username, avatar },
      { new: true }
    );
    if (!seller) return res.status(404).json({ error: 'Not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete a Seller by ID.
 */
exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get current seller profile (authenticated user)
 */
exports.getCurrentSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select('-password');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json({
      id: seller._id,
      email: seller.email,
      username: seller.username,
      mobile: seller.mobile,
      shopName: seller.shopName,
      gstNumber: seller.gstNumber,
      avatar: seller.avatar,
      role: seller.role || 'seller',
      status: seller.status || 'active',
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update current seller profile with image upload (authenticated user)
 */
exports.updateCurrentSellerProfile = async (req, res) => {
  try {
    const { email, username, mobile, shopName, gstNumber } = req.body;
    let avatarUrl = null;
    
    // Validate required fields
    if (!email || !username || !mobile || !shopName || !gstNumber) {
      return res.status(400).json({ message: 'Email, username, mobile, shop name, and GST number are required' });
    }
    
    // Check if email is being changed and if it's already taken
    if (email) {
      const existingSeller = await Seller.findOne({ email, _id: { $ne: req.sellerId } });
      if (existingSeller) {
        return res.status(400).json({ message: 'Email already registered by another seller' });
      }
    }

    // Check if mobile is being changed and if it's already taken
    if (mobile) {
      const existingMobile = await Seller.findOne({ mobile, _id: { $ne: req.sellerId } });
      if (existingMobile) {
        return res.status(400).json({ message: 'Mobile number already registered by another seller' });
      }
    }

    // Check if GST number is being changed and if it's already taken
    if (gstNumber) {
      const existingGST = await Seller.findOne({ gstNumber, _id: { $ne: req.sellerId } });
      if (existingGST) {
        return res.status(400).json({ message: 'GST number already registered by another seller' });
      }
    }

    // Handle file upload if present
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, {
          filename: req.file.originalname,
          mimetype: req.file.mimetype
        });
        avatarUrl = result.secure_url;
        if (avatarUrl && avatarUrl.startsWith('/')) {
          const baseUrl = (process.env.BACKEND_URL || process.env.API_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/api$/, '');
          avatarUrl = `${baseUrl}${avatarUrl}`;
        }
      } catch (uploadError) {
        return res.status(500).json({ message: 'Failed to upload image' });
      }
    }

    const updateData = { email, username, mobile, shopName, gstNumber };
    if (avatarUrl) updateData.avatar = avatarUrl;

    const seller = await Seller.findByIdAndUpdate(
      req.sellerId,
      updateData,
      { new: true }
    ).select('-password');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      seller: {
        id: seller._id,
        email: seller.email,
        username: seller.username,
        mobile: seller.mobile,
        shopName: seller.shopName,
        gstNumber: seller.gstNumber,
        avatar: seller.avatar,
        role: seller.role || 'seller',
        status: seller.status || 'active',
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Change password for current seller
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const seller = await Seller.findById(req.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    seller.password = hashedPassword;
    await seller.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all sellers (accessible by all authenticated sellers)
const getAllSellers = async (req, res) => {
  try {
    // Allow all authenticated sellers to view the seller list
    const sellers = await Seller.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      sellers: sellers.map(seller => ({
        id: seller._id,
        username: seller.username,
        email: seller.email,
        mobile: seller.mobile,
        shopName: seller.shopName,
        gstNumber: seller.gstNumber,
        role: seller.role || 'seller',
        status: seller.status || 'active',
        avatar: seller.avatar,
        createdAt: seller.createdAt,
        updatedAt: seller.updatedAt
      }))
    });
  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
  }
};

// Access control for sellers (activate/deactivate)
const controlSellerAccess = async (req, res) => {
  try {
    const { sellerId, action, accessEmail } = req.body;

    // Verify access control permissions
    if (accessEmail !== "kushwahadheeraj245@gmail.com") {
      return res.status(403).json({ message: "Access denied. Only authorized users can control seller access." });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (action === 'activate') {
      seller.status = 'active';
    } else if (action === 'deactivate') {
      seller.status = 'inactive';
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller ${action === 'activate' ? 'activated' : 'deactivated'} successfully`,
      seller: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        status: seller.status,
        role: seller.role
      }
    });
  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
  }
};

// Update seller access (change email)
const updateSellerAccess = async (req, res) => {
  try {
    const { sellerId, newEmail, accessEmail } = req.body;

    // Verify access control permissions
    if (accessEmail !== "kushwahadheeraj245@gmail.com") {
      return res.status(403).json({ message: "Access denied. Only authorized users can update seller access." });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if email already exists
    const existingSeller = await Seller.findOne({ email: newEmail });
    if (existingSeller && existingSeller._id.toString() !== sellerId) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.email = newEmail;
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller email updated successfully",
      seller: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        status: seller.status,
        role: seller.role
      }
    });
  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
  }
};

// Update seller role (admin only)
const updateSellerRole = async (req, res) => {
  try {
    const { sellerId, newRole, adminEmail } = req.body;

    // Verify admin permissions
    if (adminEmail !== "kushwahadheeraj245@gmail.com") {
      return res.status(403).json({ message: "Access denied. Only admin can change roles." });
    }

    // Validate role
    if (!['user', 'seller', 'admin'].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role. Must be 'user', 'seller', or 'admin'" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing admin role unless it's the admin themselves
    if (seller.role === 'admin' && seller.email !== 'kushwahadheeraj245@gmail.com') {
      return res.status(403).json({ message: "Cannot change admin role" });
    }

    seller.role = newRole;
    await seller.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${newRole} successfully`,
      user: {
        id: seller._id,
        username: seller.username,
        email: seller.email,
        role: seller.role,
        status: seller.status
      }
    });
  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Check if the requesting user is admin
    const requestingUser = await Seller.findById(req.sellerId);
    if (!requestingUser || requestingUser.email !== "kushwahadheeraj245@gmail.com") {
      return res.status(403).json({ message: "Access denied. Only admin can view all users." });
    }

    const users = await Seller.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        status: user.status || 'active',
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user completely (admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId, adminEmail } = req.body;

    // Verify admin permissions
    if (adminEmail !== "kushwahadheeraj245@gmail.com") {
      return res.status(403).json({ message: "Access denied. Only admin can delete users." });
    }

    const user = await Seller.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user.email === "kushwahadheeraj245@gmail.com") {
      return res.status(400).json({ message: "Cannot delete admin account" });
    }

    await Seller.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: `User ${user.username || user.email} has been permanently deleted`
    });
  } catch (error) {
        res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  loginSeller: exports.loginSeller,
  createSeller: exports.createSeller,
  getAllSeller: exports.getAllSeller,
  getOneSeller: exports.getOneSeller,
  updateSeller: exports.updateSeller,
  deleteSeller: exports.deleteSeller,
  getCurrentSellerProfile: exports.getCurrentSellerProfile,
  updateCurrentSellerProfile: exports.updateCurrentSellerProfile,
  changePassword: exports.changePassword,
  getAllSellers,
  controlSellerAccess,
  updateSellerAccess,
  updateSellerRole,
  getAllUsers,
  deleteUser
};
