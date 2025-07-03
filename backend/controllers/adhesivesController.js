const Adhesives = require('../models/AdhesivesModels');

// Create Adhesive
exports.createAdhesive = async (req, res) => {
  try {
    const adhesive = new Adhesives(req.body);
    await adhesive.save();
    res.status(201).json(adhesive);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Adhesives
exports.getAllAdhesives = async (req, res) => {
  try {
    const adhesives = await Adhesives.find();
    res.json(adhesives);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Adhesive by ID
exports.getAdhesiveById = async (req, res) => {
  try {
    const adhesive = await Adhesives.findById(req.params.id);
    if (!adhesive) return res.status(404).json({ message: 'Not found' });
    res.json(adhesive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Adhesive
exports.updateAdhesive = async (req, res) => {
  try {
    const adhesive = await Adhesives.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!adhesive) return res.status(404).json({ message: 'Not found' });
    res.json(adhesive);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Adhesive
exports.deleteAdhesive = async (req, res) => {
  try {
    const adhesive = await Adhesives.findByIdAndDelete(req.params.id);
    if (!adhesive) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
