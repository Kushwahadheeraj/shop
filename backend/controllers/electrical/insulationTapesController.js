const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'insulationTapes' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Insulation Tape
exports.createInsulationTape = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const insulationTape = new Electrical({ ...req.body, photos: photoUrls, type: 'InsulationTape' });
    await insulationTape.save();
    res.status(201).json(insulationTape);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Insulation Tapes
exports.getAllInsulationTapes = async (req, res) => {
  try {
    const insulationTapes = await Electrical.find({ type: 'Fans' });
    res.json(insulationTapes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Insulation Tape by ID
exports.getInsulationTapeById = async (req, res) => {
  try {
    const insulationTape = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!insulationTape) return res.status(404).json({ message: 'Not found' });
    res.json(insulationTape);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Insulation Tape
exports.updateInsulationTape = async (req, res) => {
  try {
    const insulationTape = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!insulationTape) return res.status(404).json({ message: 'Not found' });
    res.json(insulationTape);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Insulation Tape
exports.deleteInsulationTape = async (req, res) => {
  try {
    const insulationTape = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!insulationTape) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 