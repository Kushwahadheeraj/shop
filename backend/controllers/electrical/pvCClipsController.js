const Electrical = require('../../models/ElectricalModels');

// Create PVCClip
exports.createPVCClip = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'PVCClips' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All PVCClips
exports.getAllPVCClips = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'PVCClips' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get PVCClip by ID
exports.getPVCClipById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'PVCClips' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update PVCClip
exports.updatePVCClip = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'PVCClips' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete PVCClip
exports.deletePVCClip = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'PVCClips' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 