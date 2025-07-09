// AUTO-REFRACTORED FOR CLOUDINARY IMAGE UPLOAD. DO NOT EDIT MANUALLY.

const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
/**
 * Uploads a buffer to Cloudinary and returns the secure URL.
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
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
    res.json({ token, seller: { id: seller._id, email: seller.email, username: seller.username, avatar: seller.avatar } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Create a new Seller product.
 */
exports.createSeller = async (req, res) => {
  try {
    const { email, password, username, avatar } = req.body;
    const existing = await Seller.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = new Seller({ email, password: hashedPassword, username, avatar });
    await seller.save();
    res.status(201).json({ message: 'Registration successful', seller: { id: seller._id, email: seller.email, username: seller.username, avatar: seller.avatar } });
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
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get one Seller by ID.
 */
exports.getOneSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    if (!seller) return res.status(404).json({ message: 'Not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete a Seller by ID.
 */
exports.deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
