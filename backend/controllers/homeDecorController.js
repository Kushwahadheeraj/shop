const HomeDecor = require('../models/HomeDecorModels');

// Create HomeDecor
exports.createHomeDecor = async (req, res) => {
  try {
    const homeDecor = new HomeDecor(req.body);
    await homeDecor.save();
    res.status(201).json(homeDecor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All HomeDecors
exports.getAllHomeDecors = async (req, res) => {
  try {
    const homeDecors = await HomeDecor.find();
    res.json(homeDecors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get HomeDecor by ID
exports.getHomeDecorById = async (req, res) => {
  try {
    const homeDecor = await HomeDecor.findById(req.params.id);
    if (!homeDecor) return res.status(404).json({ message: 'Not found' });
    res.json(homeDecor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update HomeDecor
exports.updateHomeDecor = async (req, res) => {
  try {
    const homeDecor = await HomeDecor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!homeDecor) return res.status(404).json({ message: 'Not found' });
    res.json(homeDecor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete HomeDecor
exports.deleteHomeDecor = async (req, res) => {
  try {
    const homeDecor = await HomeDecor.findByIdAndDelete(req.params.id);
    if (!homeDecor) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
