const Electrical = require('../../models/ElectricalModels');
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'distributionBoards' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Create Distribution Board
exports.createDistributionBoard = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    }
    const distributionBoard = new Electrical({ ...req.body, photos: photoUrls, type: 'DistributionBoard' });
    await distributionBoard.save();
    res.status(201).json(distributionBoard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Distribution Boards
exports.getAllDistributionBoards = async (req, res) => {
  try {
    const boards = await Electrical.find({ type: 'Fans' });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Distribution Board by ID
exports.getDistributionBoardById = async (req, res) => {
  try {
    const board = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!board) return res.status(404).json({ message: 'Not found' });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Distribution Board
exports.updateDistributionBoard = async (req, res) => {
  try {
    const board = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!board) return res.status(404).json({ message: 'Not found' });
    res.json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Distribution Board
exports.deleteDistributionBoard = async (req, res) => {
  try {
    const board = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!board) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 