const Electrical = require('../../models/ElectricalModels');

// Create SwitchAndSocket
exports.createSwitchAndSocket = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'SwitchAndSocket' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All SwitchAndSockets
exports.getAllSwitchAndSockets = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'SwitchAndSocket' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get SwitchAndSocket by ID
exports.getSwitchAndSocketById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'SwitchAndSocket' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update SwitchAndSocket
exports.updateSwitchAndSocket = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'SwitchAndSocket' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete SwitchAndSocket
exports.deleteSwitchAndSocket = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'SwitchAndSocket' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 