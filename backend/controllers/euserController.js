const jwt = require('jsonwebtoken');
const EUser = require('../models/EUser');

function sign(user) {
  return jwt.sign({ id: user._id, role: 'euser' }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
  try {
    const { username, email, password, name, phone } = req.body || {};
    if ((!email || !email.trim()) && (!username || !username.trim())) {
      return res.status(400).json({ message: 'Username or email is required' });
    }

    const existing = await EUser.findOne({ $or: [ { email }, { username } ] });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await EUser.create({ username, email, password, name, phone });
    const token = sign(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to register' });
  }
};

exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body || {};
    if (!usernameOrEmail || !password) {
      return res.status(400).json({ message: 'usernameOrEmail and password are required' });
    }

    const user = await EUser.findOne({ $or: [ { email: usernameOrEmail.toLowerCase() }, { username: usernameOrEmail } ] });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = sign(user);
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, name: user.name, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Login failed' });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId; // flexible
    const user = await EUser.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId;
    const { name, phone, avatar } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.avatar = avatar;
    
    const user = await EUser.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, select: '-password' }
    );
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully', 
      user 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old password and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }
    
    const user = await EUser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Verify old password
    const isOldPasswordValid = await user.comparePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update password' });
  }
};