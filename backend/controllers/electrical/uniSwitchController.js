const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'uniSwitch' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create UniSwitch
exports.createUniSwitch = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const uniSwitch = new Electrical({ ...req.body, photos: photoUrls, type: 'UniSwitch' });
    await uniSwitch.save();
    res.status(201).json(uniSwitch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All UniSwitches
exports.getAllUniSwitches = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'UniSwitch' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get UniSwitch by ID
exports.getUniSwitchById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'UniSwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update UniSwitch
exports.updateUniSwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'UniSwitch' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete UniSwitch
exports.deleteUniSwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'UniSwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 