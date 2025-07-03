const Electrical = require('../../models/ElectricalModels');

// Create RotarySwitch
exports.createRotarySwitch = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'RotarySwitch' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All RotarySwitches
exports.getAllRotarySwitches = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'RotarySwitch' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get RotarySwitch by ID
exports.getRotarySwitchById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'RotarySwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update RotarySwitch
exports.updateRotarySwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'RotarySwitch' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete RotarySwitch
exports.deleteRotarySwitch = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'RotarySwitch' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 