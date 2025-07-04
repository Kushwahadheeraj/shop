const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'adaptors' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Adaptor
exports.createAdaptor = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      // Upload all files in parallel
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const adaptor = new Electrical({ ...req.body, photos: photoUrls, type: 'Adaptors' });
    await adaptor.save();
    res.status(201).json(adaptor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Adaptors
exports.getAllAdaptors = async (req, res) => {
  try {
    const adaptors = await Electrical.find({ type: 'Adaptors' });
    res.json(adaptors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Adaptor by ID
exports.getAdaptorById = async (req, res) => {
  try {
    const adaptor = await Electrical.findOne({ _id: req.params.id, type: 'Adaptors' });
    if (!adaptor) return res.status(404).json({ message: 'Not found' });
    res.json(adaptor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Adaptor
exports.updateAdaptor = async (req, res) => {
  try {
    const adaptor = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Adaptors' },
      req.body,
      { new: true }
    );
    if (!adaptor) return res.status(404).json({ message: 'Not found' });
    res.json(adaptor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Adaptor
exports.deleteAdaptor = async (req, res) => {
  try {
    const adaptor = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Adaptors' });
    if (!adaptor) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
