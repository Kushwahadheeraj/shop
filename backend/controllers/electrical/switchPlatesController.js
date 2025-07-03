const Electrical = require('../../models/ElectricalModels');

// Create SwitchPlate
exports.createSwitchPlate = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'SwitchPlates' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All SwitchPlates
exports.getAllSwitchPlates = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'SwitchPlates' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get SwitchPlate by ID
exports.getSwitchPlateById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'SwitchPlates' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update SwitchPlate
exports.updateSwitchPlate = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'SwitchPlates' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete SwitchPlate
exports.deleteSwitchPlate = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'SwitchPlates' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 