const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'backend/controllers/electrical');

const template = (resource) => `
const ElectricalModels = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.create${resource} = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new ElectricalModels({ ...req.body, photos: photoUrls, category: '${resource.charAt(0).toLowerCase() + resource.slice(1)}' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll${resource} = async (req, res) => {
  try {
    const products = await ElectricalModels.find({ category: '${resource.charAt(0).toLowerCase() + resource.slice(1)}' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOne${resource} = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, category: '${resource.charAt(0).toLowerCase() + resource.slice(1)}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update${resource} = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await ElectricalModels.findOneAndUpdate(
      { _id: req.params.id, category: '${resource.charAt(0).toLowerCase() + resource.slice(1)}' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete${resource} = async (req, res) => {
  try {
    const product = await ElectricalModels.findOneAndDelete({ _id: req.params.id, category: '${resource.charAt(0).toLowerCase() + resource.slice(1)}' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
`;

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('Controller.js')) return;
  const resource = file.replace('Controller.js', '');
  // Capitalize first letter for function names
  const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1);
  fs.writeFileSync(
    path.join(dir, file),
    template(resourceName).trim() + '\n'
  );
  console.log(`Updated: ${file}`);
}); 