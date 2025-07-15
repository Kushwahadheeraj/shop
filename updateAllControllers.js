const fs = require('fs');
const path = require('path');

const folders = [
  './backend/controllers/electrical/Lights',
  './backend/controllers/electrical/Fans',
  './backend/controllers/electrical/ElectricalFittings'
];

const boilerplate = `
const Electrical = require('../../models/electricalModel');
const cloudinary = require('../../config/cloudinary');

// Create
exports.create = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) return res.status(400).json({ error: 'At least 1 photo required' });
    if (req.files.length > 5) return res.status(400).json({ error: 'Max 5 photos allowed' });
    const photos = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      photos.push(result.secure_url);
    }
    const item = new Electrical({ ...req.body, photos });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All
exports.getAll = async (req, res) => {
  try {
    const items = await Electrical.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get One
exports.getOne = async (req, res) => {
  try {
    const item = await Electrical.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const item = await Electrical.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    const item = await Electrical.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;

folders.forEach(folder => {
  fs.readdirSync(folder).forEach(file => {
    if (file.endsWith('.js')) {
      fs.writeFileSync(path.join(folder, file), boilerplate.trim());
      console.log(`Updated: ${path.join(folder, file)}`);
    }
  });
}); 