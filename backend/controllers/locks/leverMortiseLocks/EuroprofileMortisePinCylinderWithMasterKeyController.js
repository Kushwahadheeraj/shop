const Lock = require('../../models/locksModel');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'EuroprofileMortisePinCylinderWithMasterKey', folder: 'europrofilemortisepincylinderwithmasterkey' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

exports.createEuroprofileMortisePinCylinderWithMasterKey = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const item = new Lock({ ...req.body, photos: photoUrls, type: 'EuroprofileMortisePinCylinderWithMasterKey' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllEuroprofileMortisePinCylinderWithMasterKey = async (req, res) => {
  try {
    const items = await Lock.find({ type: 'EuroprofileMortisePinCylinderWithMasterKey' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEuroprofileMortisePinCylinderWithMasterKeyById = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, type: 'EuroprofileMortisePinCylinderWithMasterKey' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateEuroprofileMortisePinCylinderWithMasterKey = async (req, res) => {
  try {
    const item = await Lock.findOneAndUpdate(
      { _id: req.params.id, type: 'EuroprofileMortisePinCylinderWithMasterKey' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEuroprofileMortisePinCylinderWithMasterKey = async (req, res) => {
  try {
    const item = await Lock.findOneAndDelete({ _id: req.params.id, type: 'EuroprofileMortisePinCylinderWithMasterKey' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 