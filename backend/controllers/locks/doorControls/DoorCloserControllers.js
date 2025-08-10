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
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const item = new Lock({ 
      ...req.body, 
      photos: photoUrls, 
      category: 'DoorCloser',
      type: 'DoorCloser',
      productNo: req.body.productNo || 'DC-' + Date.now(),
      productQualityName: req.body.productQualityName || 'Standard'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDoorCloser = async (req, res) => {
  try {
    const items = await Lock.find({ category: 'DoorCloser' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDoorCloserById = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, category: 'DoorCloser' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDoorCloser = async (req, res) => {
  try {
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      req.body.photos = photoUrls;
    }
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      req.body.photos = photoUrls;
    }
    let update = { ...req.body };
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      update.photos = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const item = await Lock.findOneAndUpdate(
      { _id: req.params.id, category: 'DoorCloser' },
      update,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteDoorCloser = async (req, res) => {
  try {
    const item = await Lock.findOneAndDelete({ _id: req.params.id, category: 'DoorCloser' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOneDoorCloser = async (req, res) => {
  try {
    const item = await Lock.findOne({ _id: req.params.id, category: 'DoorCloser' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
