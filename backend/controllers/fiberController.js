const Fiber = require('../models/FiberModels');

// Create Fiber
exports.createFiber = async (req, res) => {
  try {
    const fiber = new Fiber(req.body);
    await fiber.save();
    res.status(201).json(fiber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Fibers
exports.getAllFibers = async (req, res) => {
  try {
    const fibers = await Fiber.find();
    res.json(fibers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Fiber by ID
exports.getFiberById = async (req, res) => {
  try {
    const fiber = await Fiber.findById(req.params.id);
    if (!fiber) return res.status(404).json({ message: 'Not found' });
    res.json(fiber);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Fiber
exports.updateFiber = async (req, res) => {
  try {
    const fiber = await Fiber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fiber) return res.status(404).json({ message: 'Not found' });
    res.json(fiber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Fiber
exports.deleteFiber = async (req, res) => {
  try {
    const fiber = await Fiber.findByIdAndDelete(req.params.id);
    if (!fiber) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
