const Cements = require('../models/CementsModels');

// Create Cement
exports.createCement = async (req, res) => {
  try {
    const cement = new Cements(req.body);
    await cement.save();
    res.status(201).json(cement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Cements
exports.getAllCements = async (req, res) => {
  try {
    const cements = await Cements.find();
    res.json(cements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Cement by ID
exports.getCementById = async (req, res) => {
  try {
    const cement = await Cements.findById(req.params.id);
    if (!cement) return res.status(404).json({ message: 'Not found' });
    res.json(cement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Cement
exports.updateCement = async (req, res) => {
  try {
    const cement = await Cements.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cement) return res.status(404).json({ message: 'Not found' });
    res.json(cement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Cement
exports.deleteCement = async (req, res) => {
  try {
    const cement = await Cements.findByIdAndDelete(req.params.id);
    if (!cement) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
