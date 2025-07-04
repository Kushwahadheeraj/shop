const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'plug' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Plug
exports.createPlug = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const plug = new Electrical({ ...req.body, photos: photoUrls, type: 'Plug' });
    await plug.save();
    res.status(201).json(plug);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Plugs
exports.getAllPlugs = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'Plug' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Plug by ID
exports.getPlugById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'Plug' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Plug
exports.updatePlug = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Plug' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Plug
exports.deletePlug = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Plug' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 