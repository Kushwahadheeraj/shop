const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const seller = new Seller({ email, password: hash, username });
    await seller.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, seller.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      token,
      username: seller.username,
      message: 'Logged in successfully'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// exports.getMe = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.sellerId).select('email username');
//     if (!seller) {
//       return res.status(404).json({ message: 'Seller not found' });
//     }
//     res.json({
//       name: seller.username,
//       email: seller.email
//     });
//   } catch (error) {
//     console.error('Get seller info error:', error);
//     res.status(500).json({ message: 'Failed to get seller info' });
//   }
// };
exports.getMe = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select('email username avatar');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json({
      name: seller.username,
      email: seller.email,
      avatar: seller.avatar || "" // Add avatar field to your model if not present
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get seller info' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }
    const seller = await Seller.findById(req.sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const match = await bcrypt.compare(oldPassword, seller.password);
    if (!match) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    seller.password = await bcrypt.hash(newPassword, 10);
    await seller.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
}; 