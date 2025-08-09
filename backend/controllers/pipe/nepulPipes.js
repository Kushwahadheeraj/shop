const Pipe = require('../../models/PipeModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// CREATE
exports.createNepulPipes = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const item = new Pipe({
      ...req.body,
      photos: photoUrls,
      category: 'NepulPipes'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAllNepulPipes = async (req, res) => {
  try {
    const items = await Pipe.find({ category: 'NepulPipes' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ONE
exports.getOneNepulPipes = async (req, res) => {
  try {
    const item = await Pipe.findOne({ _id: req.params.id, category: 'NepulPipes' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateNepulPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndUpdate(
      { _id: req.params.id, category: 'NepulPipes' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteNepulPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndDelete({ _id: req.params.id, category: 'NepulPipes' });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
