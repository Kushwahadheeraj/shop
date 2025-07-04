const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'doorBells' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create DoorBell
exports.createDoorBell = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const doorBell = new Electrical({ ...req.body, photos: photoUrls, type: 'DoorBell' });
    await doorBell.save();
    res.status(201).json(doorBell);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All DoorBells
exports.getAllDoorBells = async (req, res) => {
  try {
    const doorBells = await Electrical.find({ type: 'Fans' });
    res.json(doorBells);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get DoorBell by ID
exports.getDoorBellById = async (req, res) => {
  try {
    const doorBell = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!doorBell) return res.status(404).json({ message: 'Not found' });
    res.json(doorBell);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update DoorBell
exports.updateDoorBell = async (req, res) => {
  try {
    const doorBell = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!doorBell) return res.status(404).json({ message: 'Not found' });
    res.json(doorBell);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete DoorBell
exports.deleteDoorBell = async (req, res) => {
  try {
    const doorBell = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!doorBell) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 