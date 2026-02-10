const Lock = require('../../models/LocksModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'PatchFittings', folder: 'PatchFittings' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createPatchFittings = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const item = new Lock({ 
      ...req.body, 
      photos: photoUrls, 
      category: 'PatchFittings',
      type: 'PatchFittings',
      productNo: req.body.productNo || 'PF-' + Date.now(),
      productQualityName: req.body.productQualityName || 'Standard'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllPatchFittings = async (req, res) => {
  try {
    const items = await Lock.find({ category: 'PatchFittings' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePatchFittings = async (req, res) => {
  try {
    const item = await Lock.findOneAndUpdate(
      { _id: req.params.id, category: 'PatchFittings' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePatchFittings = async (req, res) => {
  try {
    const item = await Lock.findOneAndDelete({ _id: req.params.id, category: 'PatchFittings' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOnePatchFittings = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, category: 'PatchFittings' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


