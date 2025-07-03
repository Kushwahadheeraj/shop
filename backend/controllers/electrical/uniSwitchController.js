const Electrical = require('../../models/ElectricalModels');

// Create UniSwitch
exports.createUniSwitch = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'UniSwitch' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All UniSwitches
exports.getAllUniSwitches = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'UniSwitch' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get UniSwitch by ID
exports.getUniSwitchById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'UniSwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update UniSwitch
exports.updateUniSwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'UniSwitch' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete UniSwitch
exports.deleteUniSwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'UniSwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 