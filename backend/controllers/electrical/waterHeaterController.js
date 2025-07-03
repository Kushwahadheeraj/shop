const Electrical = require('../../models/ElectricalModels');

// Create WaterHeater
exports.createWaterHeater = async (req, res) => {
  try {
    const item = new Electrical({ ...req.body, type: 'WaterHeater' });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All WaterHeaters
exports.getAllWaterHeaters = async (req, res) => {
  try {
    const items = await Electrical.find({ type: 'WaterHeater' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get WaterHeater by ID
exports.getWaterHeaterById = async (req, res) => {
  try {
    const item = await Electrical.findOne({ _id: req.params.id, type: 'WaterHeater' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update WaterHeater
exports.updateWaterHeater = async (req, res) => {
  try {
    const item = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'WaterHeater' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete WaterHeater
exports.deleteWaterHeater = async (req, res) => {
  try {
    const item = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'WaterHeater' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 