const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'eLCBsRCCBs' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create ELCBsRCCB
exports.createELCBsRCCB = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const elcbsrccb = new Electrical({ ...req.body, photos: photoUrls, type: 'ELCBsRCCB' });
    await elcbsrccb.save();
    res.status(201).json(elcbsrccb);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Fans
exports.getAllELCBsRCCBs = async (req, res) => {
  try {
    const fans = await Electrical.find({ type: 'Fans' });
    res.json(fans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Fan by ID
exports.getELCBsRCCBById = async (req, res) => {
  try {
    const fan = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!fan) return res.status(404).json({ message: 'Not found' });
    res.json(fan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Fan
exports.updateELCBsRCCB = async (req, res) => {
  try {
    const fan = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!fan) return res.status(404).json({ message: 'Not found' });
    res.json(fan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Fan
exports.deleteELCBsRCCB = async (req, res) => {
  try {
    const fan = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!fan) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 