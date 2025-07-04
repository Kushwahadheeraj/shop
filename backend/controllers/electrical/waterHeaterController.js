const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'waterHeater' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create WaterHeater
exports.createWaterHeater = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const waterHeater = new Electrical({ ...req.body, photos: photoUrls, type: 'WaterHeater' });
    await waterHeater.save();
    res.status(201).json(waterHeater);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All WaterHeaters
exports.getAllWaterHeaters = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'WaterHeater' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get WaterHeater by ID
exports.getWaterHeaterById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'WaterHeater' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update WaterHeater
exports.updateWaterHeater = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'WaterHeater' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete WaterHeater
exports.deleteWaterHeater = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'WaterHeater' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 