const Hardware = require('../models/HardwareModels');

// Create Hardware
exports.createHardware = async (req, res) => {
  try {
    const hardware = new Hardware(req.body);
    await hardware.save();
    res.status(201).json(hardware);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Hardwares
exports.getAllHardwares = async (req, res) => {
  try {
    const hardwares = await Hardware.find();
    res.json(hardwares);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Hardware by ID
exports.getHardwareById = async (req, res) => {
  try {
    const hardware = await Hardware.findById(req.params.id);
    if (!hardware) return res.status(404).json({ message: 'Not found' });
    res.json(hardware);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Hardware
exports.updateHardware = async (req, res) => {
  try {
    const hardware = await Hardware.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hardware) return res.status(404).json({ message: 'Not found' });
    res.json(hardware);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Hardware
exports.deleteHardware = async (req, res) => {
  try {
    const hardware = await Hardware.findByIdAndDelete(req.params.id);
    if (!hardware) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
