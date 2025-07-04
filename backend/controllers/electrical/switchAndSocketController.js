const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'switchAndSocket' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create SwitchAndSocket
exports.createSwitchAndSocket = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const switchAndSocket = new Electrical({ ...req.body, photos: photoUrls, type: 'SwitchAndSocket' });
    await switchAndSocket.save();
    res.status(201).json(switchAndSocket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All SwitchAndSockets
exports.getAllSwitchAndSockets = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'SwitchAndSocket' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get SwitchAndSocket by ID
exports.getSwitchAndSocketById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'SwitchAndSocket' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update SwitchAndSocket
exports.updateSwitchAndSocket = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'SwitchAndSocket' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete SwitchAndSocket
exports.deleteSwitchAndSocket = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'SwitchAndSocket' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 