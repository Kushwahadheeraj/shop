const Uncategorized = require('../models/UncategorizedModels');

// Create Uncategorized
exports.createUncategorized = async (req, res) => {
  try {
    const uncategorized = new Uncategorized(req.body);
    await uncategorized.save();
    res.status(201).json(uncategorized);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Uncategorizeds
exports.getAllUncategorizeds = async (req, res) => {
  try {
    const uncategorizeds = await Uncategorized.find();
    res.json(uncategorizeds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Uncategorized by ID
exports.getUncategorizedById = async (req, res) => {
  try {
    const uncategorized = await Uncategorized.findById(req.params.id);
    if (!uncategorized) return res.status(404).json({ message: 'Not found' });
    res.json(uncategorized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Uncategorized
exports.updateUncategorized = async (req, res) => {
  try {
    const uncategorized = await Uncategorized.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!uncategorized) return res.status(404).json({ message: 'Not found' });
    res.json(uncategorized);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Uncategorized
exports.deleteUncategorized = async (req, res) => {
  try {
    const uncategorized = await Uncategorized.findByIdAndDelete(req.params.id);
    if (!uncategorized) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
