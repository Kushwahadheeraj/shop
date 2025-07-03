const Electrical = require('../../models/ElectricalModels');

// Create Light
exports.createLight = async (req, res) => {
  try {
    const light = new Electrical({ ...req.body, type: 'Lights' });
    await light.save();
    res.status(201).json(light);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Lights
exports.getAllLights = async (req, res) => {
  try {
    const lights = await Electrical.find({ type: 'Lights' });
    res.json(lights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Light by ID
exports.getLightById = async (req, res) => {
  try {
    const light = await Electrical.findOne({ _id: req.params.id, type: 'Lights' });
    if (!light) return res.status(404).json({ message: 'Not found' });
    res.json(light);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Light
exports.updateLight = async (req, res) => {
  try {
    const light = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Lights' },
      req.body,
      { new: true }
    );
    if (!light) return res.status(404).json({ message: 'Not found' });
    res.json(light);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Light
exports.deleteLight = async (req, res) => {
  try {
    const light = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Lights' });
    if (!light) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 