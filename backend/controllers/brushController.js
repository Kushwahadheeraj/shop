const Brush = require('../models/BrushModels');

// Create Brush
exports.createBrush = async (req, res) => {
  try {
    const brush = new Brush(req.body);
    await brush.save();
    res.status(201).json(brush);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Brushes
exports.getAllBrushes = async (req, res) => {
  try {
    const brushes = await Brush.find();
    res.json(brushes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Brush by ID
exports.getBrushById = async (req, res) => {
  try {
    const brush = await Brush.findById(req.params.id);
    if (!brush) return res.status(404).json({ message: 'Not found' });
    res.json(brush);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Brush
exports.updateBrush = async (req, res) => {
  try {
    const brush = await Brush.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!brush) return res.status(404).json({ message: 'Not found' });
    res.json(brush);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Brush
exports.deleteBrush = async (req, res) => {
  try {
    const brush = await Brush.findByIdAndDelete(req.params.id);
    if (!brush) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
