const Electrical = require('../../models/ElectricalModels');

// Create Motor
exports.createMotor = async (req, res) => {
  try {
    const motor = new Electrical({ ...req.body, type: 'Fans' });
    await motor.save();
    res.status(201).json(motor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Motors
exports.getAllMotors = async (req, res) => {
  try {
    const motors = await Electrical.find({ type: 'Fans' });
    res.json(motors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Motor by ID
exports.getMotorById = async (req, res) => {
  try {
    const motor = await Electrical.findOne({ _id: req.params.id, type: 'Fans' });
    if (!motor) return res.status(404).json({ message: 'Not found' });
    res.json(motor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Motor
exports.updateMotor = async (req, res) => {
  try {
    const motor = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Fans' },
      req.body,
      { new: true }
    );
    if (!motor) return res.status(404).json({ message: 'Not found' });
    res.json(motor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Motor
exports.deleteMotor = async (req, res) => {
  try {
    const motor = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Fans' });
    if (!motor) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 