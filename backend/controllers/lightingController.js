const Lighting = require('../models/LightingModels');

// Create Lighting
exports.createLighting = async (req, res) => {
  try {
    const lighting = new Lighting(req.body);
    await lighting.save();
    res.status(201).json(lighting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Lightings
exports.getAllLightings = async (req, res) => {
  try {
    const lightings = await Lighting.find();
    res.json(lightings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Lighting by ID
exports.getLightingById = async (req, res) => {
  try {
    const lighting = await Lighting.findById(req.params.id);
    if (!lighting) return res.status(404).json({ message: 'Not found' });
    res.json(lighting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Lighting
exports.updateLighting = async (req, res) => {
  try {
    const lighting = await Lighting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lighting) return res.status(404).json({ message: 'Not found' });
    res.json(lighting);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Lighting
exports.deleteLighting = async (req, res) => {
  try {
    const lighting = await Lighting.findByIdAndDelete(req.params.id);
    if (!lighting) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
