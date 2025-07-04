const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'motors' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Motor
exports.createMotor = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const motor = new Electrical({ ...req.body, photos: photoUrls, type: 'Motor' });
    await motor.save();
    res.status(201).json(motor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Motors
exports.getAllMotors = async (req, res) => {
  try {
    const motors = await Electrical.find({ type: 'Fans' });
    res.json(motors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Motor by ID
exports.getMotorById = async (req, res) => {
  try {
    const motor = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!motor) return res.status(404).json({ message: 'Not found' });
    res.json(motor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Motor
exports.updateMotor = async (req, res) => {
  try {
    const motor = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!motor) return res.status(404).json({ message: 'Not found' });
    res.json(motor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Motor
exports.deleteMotor = async (req, res) => {
  try {
    const motor = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!motor) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 