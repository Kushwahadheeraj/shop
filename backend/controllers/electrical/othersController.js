const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'others' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Other
exports.createOther = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const other = new Electrical({ ...req.body, photos: photoUrls, type: 'Other' });
    await other.save();
    res.status(201).json(other);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Others
exports.getAllOthers = async (req, res) => {
  try {
    const others = await Electrical.find({ type: 'Fans' });
    res.json(others);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Other by ID
exports.getOtherById = async (req, res) => {
  try {
    const other = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!other) return res.status(404).json({ message: 'Not found' });
    res.json(other);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Other
exports.updateOther = async (req, res) => {
  try {
    const other = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!other) return res.status(404).json({ message: 'Not found' });
    res.json(other);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Other
exports.deleteOther = async (req, res) => {
  try {
    const other = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!other) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 