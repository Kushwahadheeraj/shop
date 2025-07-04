const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'earthingAccessories' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Earthing Accessory
exports.createEarthingAccessory = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const accessory = new Electrical({ ...req.body, photos: photoUrls, type: 'Fans' });
    await accessory.save();
    res.status(201).json(accessory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Earthing Accessories
exports.getAllEarthingAccessories = async (req, res) => {
  try {
    const accessories = await Electrical.find({ type: 'Fans' });
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Earthing Accessory by ID
exports.getEarthingAccessoryById = async (req, res) => {
  try {
    const accessory = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!accessory) return res.status(404).json({ message: 'Not found' });
    res.json(accessory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Earthing Accessory
exports.updateEarthingAccessory = async (req, res) => {
  try {
    const accessory = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!accessory) return res.status(404).json({ message: 'Not found' });
    res.json(accessory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Earthing Accessory
exports.deleteEarthingAccessory = async (req, res) => {
  try {
    const accessory = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!accessory) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 