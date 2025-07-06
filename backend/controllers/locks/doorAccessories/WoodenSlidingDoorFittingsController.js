const Lock = require('../../models/locksModel');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'woodenSlidingDoorFittings' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createWoodenSlidingDoorFitting = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const item = new Lock({ ...req.body, photos: photoUrls, type: 'WoodenSlidingDoorFitting' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllWoodenSlidingDoorFittings = async (req, res) => {
  try {
    const items = await Lock.find({ type: 'WoodenSlidingDoorFitting' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWoodenSlidingDoorFittingById = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, type: 'WoodenSlidingDoorFitting' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateWoodenSlidingDoorFitting = async (req, res) => {
  try {
    const item = await Lock.findOneAndUpdate(
      { _id: req.params.id, type: 'WoodenSlidingDoorFitting' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteWoodenSlidingDoorFitting = async (req, res) => {
  try {
    const item = await Lock.findOneAndDelete({ _id: req.params.id, type: 'WoodenSlidingDoorFitting' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 