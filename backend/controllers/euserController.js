const jwt = require('jsonwebtoken');
const EUser = require('../models/EUser');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

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

// email transporter (simple SMTP using env)
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

// Request password reset: generate 6-digit code and email it
exports.requestPasswordReset = async (req, res) => {
  try {
    const { emailOrUsername } = req.body || {};
    if (!emailOrUsername) return res.status(400).json({ message: 'Email or username is required' });
    const user = await EUser.findOne({ $or: [ { email: emailOrUsername.toLowerCase() }, { username: emailOrUsername } ] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = await bcrypt.hash(code, 10);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    user.resetCodeHash = codeHash;
    user.resetCodeExpires = expires;
    await user.save();

    try {
      if (user.email) {
        const transporter = createTransporter();
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@hardware-shack',
          to: user.email,
          subject: 'Your password reset code',
          text: `Your password reset code is ${code}. It expires in 15 minutes.`,
          html: `<p>Your password reset code is <b>${code}</b>. It expires in 15 minutes.</p>`,
        });
      }
    } catch (mailErr) {
      // Mailing failure shouldn't leak code; still allow fallback display in dev
    }

    // In dev, do not expose the code in response unless explicitly allowed
    res.json({ success: true, message: 'Reset code sent to email if available', expires });
  } catch (err) {
    res.status(500).json({ message: 'Failed to request password reset' });
  }
};

// Verify code and reset password
exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token, code, emailOrUsername, newPassword } = req.body || {};
    if ((!token && !code) || !newPassword) return res.status(400).json({ message: 'Code and newPassword are required' });
    const user = await EUser.findOne({
      $or: [
        { resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } },
        { $and: [
          { $or: [ { email: emailOrUsername?.toLowerCase() }, { username: emailOrUsername } ] },
          { resetCodeExpires: { $gt: new Date() } }
        ]}
      ]
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

    if (code) {
      const ok = await bcrypt.compare(String(code), user.resetCodeHash || '');
      if (!ok) return res.status(400).json({ message: 'Invalid code' });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.resetCodeHash = null;
    user.resetCodeExpires = null;
    await user.save();
    res.json({ success: true, message: 'Password has been reset' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

// List e-users with optional search and date range
exports.list = async (req, res) => {
  try {
    const { q, from, to, limit, skip } = req.query || {};

    const filter = {};
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { username: regex },
        { email: regex },
        { name: regex },
        { phone: regex },
      ];
    }

    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    const query = EUser.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(Number(skip) || 0)
      .limit(Math.min(Number(limit) || 200, 500));

    const [users, total] = await Promise.all([
      query,
      EUser.countDocuments(filter),
    ]);

    const mapped = users.map(u => ({
      id: u._id,
      username: u.username,
      name: u.name,
      email: u.email,
      phone: u.phone,
      avatar: u.avatar,
      status: u.status,
      createdAt: u.createdAt,
    }));

    res.json({ total, users: mapped });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users' });
  }
};

// Stats for predefined windows
exports.stats = async (req, res) => {
  try {
    const now = new Date();

    const startOf = (date) => new Date(date);

    const ranges = {
      '1d': new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      '3d': new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      '1w': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '15d': new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '6m': new Date(new Date(now).setMonth(now.getMonth() - 6)),
      '1y': new Date(new Date(now).setFullYear(now.getFullYear() - 1)),
    };

    const total = await EUser.countDocuments({});

    const entries = await Promise.all(
      Object.entries(ranges).map(async ([key, start]) => {
        const count = await EUser.countDocuments({ createdAt: { $gte: start } });
        return [key, count];
      })
    );

    const stats = Object.fromEntries(entries);
    stats.total = total;

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats' });
  }
};

// ---- Address management for e-users ----

// Get all saved addresses for current euser
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId;
    const user = await EUser.findById(userId).select('addresses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, addresses: user.addresses || [] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load addresses' });
  }
};

// Add new address (max 6)
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId;
    const user = await EUser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses || [];
    if (user.addresses.length >= 6) {
      return res.status(400).json({ message: 'Maximum 6 addresses allowed' });
    }

    const incoming = req.body || {};
    // If this is default, clear other defaults
    if (incoming.isDefault) {
      user.addresses = user.addresses.map(a => ({ ...a.toObject(), isDefault: false }));
    }

    user.addresses.push(incoming);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add address' });
  }
};

// Update existing address by index
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId;
    const { index, address } = req.body || {};
    if (typeof index !== 'number') {
      return res.status(400).json({ message: 'index is required' });
    }

    const user = await EUser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses || [];
    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ message: 'Invalid address index' });
    }

    // If setting default, clear others
    const incoming = address || {};
    if (incoming.isDefault) {
      user.addresses = user.addresses.map((a, i) =>
        i === index ? a : { ...a.toObject(), isDefault: false }
      );
    }

    user.addresses[index] = { ...user.addresses[index].toObject(), ...incoming };
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update address' });
  }
};

// Delete address by index
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user?.id || req.euserId || req.sellerId;
    const { index } = req.body || {};
    if (typeof index !== 'number') {
      return res.status(400).json({ message: 'index is required' });
    }

    const user = await EUser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses || [];
    if (index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ message: 'Invalid address index' });
    }

    user.addresses.splice(index, 1);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete address' });
  }
};
