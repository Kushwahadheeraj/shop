const Fitting = require('../models/FittingModels');

// Create Fitting
exports.createFitting = async (req, res) => {
  try {
    const fitting = new Fitting(req.body);
    await fitting.save();
    res.status(201).json(fitting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Fittings
exports.getAllFittings = async (req, res) => {
  try {
    const fittings = await Fitting.find();
    res.json(fittings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Fitting by ID
exports.getFittingById = async (req, res) => {
  try {
    const fitting = await Fitting.findById(req.params.id);
    if (!fitting) return res.status(404).json({ message: 'Not found' });
    res.json(fitting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Fitting
exports.updateFitting = async (req, res) => {
  try {
    const fitting = await Fitting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fitting) return res.status(404).json({ message: 'Not found' });
    res.json(fitting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Fitting
exports.deleteFitting = async (req, res) => {
  try {
    const fitting = await Fitting.findByIdAndDelete(req.params.id);
    if (!fitting) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
