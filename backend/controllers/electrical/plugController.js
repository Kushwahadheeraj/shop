const Electrical = require('../../models/ElectricalModels');

// Create Plug
exports.createPlug = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'Plug' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Plugs
exports.getAllPlugs = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'Plug' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Plug by ID
exports.getPlugById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'Plug' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Plug
exports.updatePlug = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Plug' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Plug
exports.deletePlug = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Plug' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 