const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'isolators' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Isolator
exports.createIsolator = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const isolator = new Electrical({ ...req.body, photos: photoUrls, type: 'Isolator' });
    await isolator.save();
    res.status(201).json(isolator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Isolators
exports.getAllIsolators = async (req, res) => {
  try {
    const isolators = await Electrical.find({ type: 'Fans' });
    res.json(isolators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Isolator by ID
exports.getIsolatorById = async (req, res) => {
  try {
    const isolator = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!isolator) return res.status(404).json({ message: 'Not found' });
    res.json(isolator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Isolator
exports.updateIsolator = async (req, res) => {
  try {
    const isolator = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!isolator) return res.status(404).json({ message: 'Not found' });
    res.json(isolator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Isolator
exports.deleteIsolator = async (req, res) => {
  try {
    const isolator = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!isolator) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 