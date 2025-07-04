const Electrical = require('../../models/ElectricalModels');

// Create DPswitch
exports.createDPswitch = async (req, res) => {
  try {
    const dPswitch = new Electrical({ ...req.body, type: 'Fans' });
    await dPswitch.save();
    res.status(201).json(dPswitch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All DPswitches
exports.getAllDPswitchs = async (req, res) => {
  try {
    const dPswitches = await Electrical.find({ type: 'Fans' });
    res.json(dPswitches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get DPswitch by ID
exports.getDPswitchById = async (req, res) => {
  try {
    const dPswitch = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!dPswitch) return res.status(404).json({ message: 'Not found' });
    res.json(dPswitch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update DPswitch
exports.updateDPswitch = async (req, res) => {
  try {
    const dPswitch = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!dPswitch) return res.status(404).json({ message: 'Not found' });
    res.json(dPswitch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete DPswitch
exports.deleteDPswitch = async (req, res) => {
  try {
    const dPswitch = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!dPswitch) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 