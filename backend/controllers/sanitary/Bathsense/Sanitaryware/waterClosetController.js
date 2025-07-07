// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.
// AUTO-GENERATED IMAGE UPLOAD LOGIC. DO NOT EDIT MANUALLY.

const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
// Helper for Cloudinary upload
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createWaterCloset = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new (require('../../models/SanitaryModels'))({ ...req.body, photos: photoUrls, category: 'bathsense/Sanitaryware/waterCloset' });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllWaterCloset = async (req, res) => {
  try {
    const products = await require('../../models/SanitaryModels').find({ category: 'bathsense/Sanitaryware/waterCloset' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneWaterCloset = async (req, res) => {
  try {
    const product = await require('../../models/SanitaryModels').findOne({ _id: req.params.id, category: 'bathsense/Sanitaryware/waterCloset' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateWaterCloset = async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const product = await require('../../models/SanitaryModels').findOneAndUpdate(
      { _id: req.params.id, category: 'bathsense/Sanitaryware/waterCloset' },
      update,
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteWaterCloset = async (req, res) => {
  try {
    const product = await require('../../models/SanitaryModels').findOneAndDelete({ _id: req.params.id, category: 'bathsense/Sanitaryware/waterCloset' });
    if (!product) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
