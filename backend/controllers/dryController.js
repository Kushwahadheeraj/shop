const Dry = require('../models/DryModels');

// Create Dry
exports.createDry = async (req, res) => {
  try {
    const dry = new Dry(req.body);
    await dry.save();
    res.status(201).json(dry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Drys
exports.getAllDrys = async (req, res) => {
  try {
    const drys = await Dry.find();
    res.json(drys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Dry by ID
exports.getDryById = async (req, res) => {
  try {
    const dry = await Dry.findById(req.params.id);
    if (!dry) return res.status(404).json({ message: 'Not found' });
    res.json(dry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Dry
exports.updateDry = async (req, res) => {
  try {
    const dry = await Dry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dry) return res.status(404).json({ message: 'Not found' });
    res.json(dry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Dry
exports.deleteDry = async (req, res) => {
  try {
    const dry = await Dry.findByIdAndDelete(req.params.id);
    if (!dry) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
