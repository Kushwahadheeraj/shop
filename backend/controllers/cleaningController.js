const Cleaning = require('../models/CleaningModels');

// Create Cleaning
exports.createCleaning = async (req, res) => {
  try {
    const cleaning = new Cleaning(req.body);
    await cleaning.save();
    res.status(201).json(cleaning);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Cleanings
exports.getAllCleanings = async (req, res) => {
  try {
    const cleanings = await Cleaning.find();
    res.json(cleanings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Cleaning by ID
exports.getCleaningById = async (req, res) => {
  try {
    const cleaning = await Cleaning.findById(req.params.id);
    if (!cleaning) return res.status(404).json({ message: 'Not found' });
    res.json(cleaning);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Cleaning
exports.updateCleaning = async (req, res) => {
  try {
    const cleaning = await Cleaning.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cleaning) return res.status(404).json({ message: 'Not found' });
    res.json(cleaning);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Cleaning
exports.deleteCleaning = async (req, res) => {
  try {
    const cleaning = await Cleaning.findByIdAndDelete(req.params.id);
    if (!cleaning) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
