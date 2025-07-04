const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'rotarySwitch' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create RotarySwitch
exports.createRotarySwitch = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const rotarySwitch = new Electrical({ ...req.body, photos: photoUrls, type: 'RotarySwitch' });
    await rotarySwitch.save();
    res.status(201).json(rotarySwitch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All RotarySwitches
exports.getAllRotarySwitchs = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'RotarySwitch' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get RotarySwitch by ID
exports.getRotarySwitchById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'RotarySwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update RotarySwitch
exports.updateRotarySwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'RotarySwitch' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete RotarySwitch
exports.deleteRotarySwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'RotarySwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 