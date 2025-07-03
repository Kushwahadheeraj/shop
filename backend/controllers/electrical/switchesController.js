const Electrical = require('../../models/ElectricalModels');

// Create Switch
exports.createSwitch = async (req, res) => {
  try {
    const sw = new Electrical({ ...req.body, type: 'Switches' });
    await sw.save();
    res.status(201).json(sw);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Switches
exports.getAllSwitches = async (req, res) => {
  try {
    const switches = await Electrical.find({ type: 'Switches' });
    res.json(switches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Switch by ID
exports.getSwitchById = async (req, res) => {
  try {
    const sw = await Electrical.findOne({ _id: req.params.id, type: 'Switches' });
    if (!sw) return res.status(404).json({ message: 'Not found' });
    res.json(sw);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Switch
exports.updateSwitch = async (req, res) => {
  try {
    const sw = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Switches' },
      req.body,
      { new: true }
    );
    if (!sw) return res.status(404).json({ message: 'Not found' });
    res.json(sw);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Switch
exports.deleteSwitch = async (req, res) => {
  try {
    const sw = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Switches' });
    if (!sw) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 