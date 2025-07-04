const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'sockets' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Socket
exports.createSocket = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const socket = new Electrical({ ...req.body, photos: photoUrls, type: 'Sockets' });
    await socket.save();
    res.status(201).json(socket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Sockets
exports.getAllSockets = async (req, res) => {
  try {
    const sockets = await Electrical.find({ type: 'Sockets' });
    res.json(sockets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Socket by ID
exports.getSocketById = async (req, res) => {
  try {
    const socket = await Electrical.findOne({ _id: req.params.id, type: 'Sockets' });
    if (!socket) return res.status(404).json({ message: 'Not found' });
    res.json(socket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Socket
exports.updateSocket = async (req, res) => {
  try {
    const socket = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Sockets' },
      req.body,
      { new: true }
    );
    if (!socket) return res.status(404).json({ message: 'Not found' });
    res.json(socket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Socket
exports.deleteSocket = async (req, res) => {
  try {
    const socket = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Sockets' });
    if (!socket) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 