const Electrical = require('../../models/ElectricalModels');

// Create Isolator
exports.createIsolator = async (req, res) => {
  try {
    const isolator = new Electrical({ ...req.body, type: 'Fans' });
    await isolator.save();
    res.status(201).json(isolator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Isolators
exports.getAllIsolators = async (req, res) => {
  try {
    const isolators = await Electrical.find({ type: 'Fans' });
    res.json(isolators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Isolator by ID
exports.getIsolatorById = async (req, res) => {
  try {
    const isolator = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!isolator) return res.status(404).json({ message: 'Not found' });
    res.json(isolator);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Isolator
exports.updateIsolator = async (req, res) => {
  try {
    const isolator = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!isolator) return res.status(404).json({ message: 'Not found' });
    res.json(isolator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Isolator
exports.deleteIsolator = async (req, res) => {
  try {
    const isolator = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!isolator) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 