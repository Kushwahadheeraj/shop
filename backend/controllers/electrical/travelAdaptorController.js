const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'travelAdaptor' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create TravelAdaptor
exports.createTravelAdaptor = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const travelAdaptor = new Electrical({ ...req.body, photos: photoUrls, type: 'TravelAdaptor' });
    await travelAdaptor.save();
    res.status(201).json(travelAdaptor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All TravelAdaptors
exports.getAllTravelAdaptors = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'TravelAdaptor' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get TravelAdaptor by ID
exports.getTravelAdaptorById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'TravelAdaptor' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update TravelAdaptor
exports.updateTravelAdaptor = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'TravelAdaptor' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete TravelAdaptor
exports.deleteTravelAdaptor = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'TravelAdaptor' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 