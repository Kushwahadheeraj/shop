const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'backend', 'controllers', 'paint');

function pascalCase(str) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_\-\s]+/g, ' ')
    .replace(/(?:^|\s)([a-z])/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/\s+/g, '');
}

function getCrudCode(filePath, importLevel) {
  const fileName = path.basename(filePath, '.js');
  const baseName = fileName.replace(/Controller$/, '');
  const pascal = pascalCase(baseName);
  const importPrefix = '../'.repeat(importLevel);
  return `const Paint = require('${importPrefix}models/PaintModels');
const cloudinary = require('${importPrefix}config/cloudinary');
const streamifier = require('streamifier');

// Helper for Cloudinary upload
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'paint/${pascal}' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// CREATE
exports.create${pascal} = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) return res.status(400).json({ message: 'Max 5 images allowed' });
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    if (photoUrls.length < 1) return res.status(400).json({ message: 'At least 1 image required' });

    const item = new Paint({
      ...req.body,
      photos: photoUrls,
      category: '${pascal}'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAll${pascal} = async (req, res) => {
  try {
    const items = await Paint.find({ category: '${pascal}' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
exports.getOne${pascal} = async (req, res) => {
  try {
    const item = await Paint.findOne({ _id: req.params.id, category: '${pascal}' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.update${pascal} = async (req, res) => {
  try {
    const item = await Paint.findOneAndUpdate(
      { _id: req.params.id, category: '${pascal}' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.delete${pascal} = async (req, res) => {
  try {
    const item = await Paint.findOneAndDelete({ _id: req.params.id, category: '${pascal}' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
`;
}

function updateControllers(dir, importLevel = 2) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      updateControllers(fullPath, importLevel + 1);
    } else if (item.endsWith('Controller.js')) {
      const code = getCrudCode(fullPath, importLevel);
      fs.writeFileSync(fullPath, code);
      console.log('Updated:', fullPath);
    }
  }
}

updateControllers(baseDir);
console.log('All paint controllers updated!'); 