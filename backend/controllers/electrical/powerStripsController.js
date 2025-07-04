const Electrical = require('../../models/ElectricalModels');

// Create Fan
exports.createPowerStrip = async (req, res) => {
  try {
    const fan = new Electrical({ ...req.body, type: 'Fans' });
    await fan.save();
    res.status(201).json(fan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Fans
exports.getAllPowerStrips = async (req, res) => {
  try {
    const fans = await Electrical.find({ type: 'Fans' });
    res.json(fans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Fan by ID
exports.getPowerStripById = async (req, res) => {
  try {
    const fan = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!fan) return res.status(404).json({ message: 'Not found' });
    res.json(fan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Fan
exports.updatePowerStrip = async (req, res) => {
  try {
    const fan = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!fan) return res.status(404).json({ message: 'Not found' });
    res.json(fan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Fan
exports.deletePowerStrip = async (req, res) => {
  try {
    const fan = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!fan) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 