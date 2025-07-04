const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'tVOutlets' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create TVOutlet
exports.createTVOutlet = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const tvOutlet = new Electrical({ ...req.body, photos: photoUrls, type: 'TVOutlet' });
    await tvOutlet.save();
    res.status(201).json(tvOutlet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All TVOutlets
exports.getAllTVOutlets = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'TVOutlets' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get TVOutlet by ID
exports.getTVOutletById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'TVOutlets' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update TVOutlet
exports.updateTVOutlet = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'TVOutlets' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete TVOutlet
exports.deleteTVOutlet = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'TVOutlets' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 