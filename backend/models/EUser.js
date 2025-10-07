const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const eUserSchema = new mongoose.Schema({
  username: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true, index: true },
  password: { type: String, required: true, minlength: 6 },
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  avatar: { type: String, default: '' },
  status: { type: String, default: 'active' },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  resetCodeHash: { type: String, default: null },
  resetCodeExpires: { type: Date, default: null },
}, { timestamps: true });

// Either username or email must be provided
eUserSchema.path('username');

// Hash on save
eUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

eUserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('EUser', eUserSchema);
