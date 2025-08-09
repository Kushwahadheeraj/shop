const Lock = require('../../../models/LocksModels');
const cloudinary = require('../../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'doorStopper' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createDoorCloser = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const item = new Lock({ ...req.body, photos: photoUrls, type: 'DoorStopper' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllDoorCloser = async (req, res) => {
  try {
    const items = await Lock.find({ type: 'DoorStopper' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoorCloserById = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, type: 'DoorStopper' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoorCloser = async (req, res) => {
  try {
    const item = await Lock.findOneAndUpdate(
      { _id: req.params.id, type: 'DoorStopper' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteDoorCloser = async (req, res) => {
  try {
    const item = await Lock.findOneAndDelete({ _id: req.params.id, type: 'DoorStopper' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneDoorCloser = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, type: 'image' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
