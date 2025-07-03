const Home = require('../models/HomeModels');

// Create Home
exports.createHome = async (req, res) => {
  try {
    const home = new Home(req.body);
    await home.save();
    res.status(201).json(home);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Homes
exports.getAllHomes = async (req, res) => {
  try {
    const homes = await Home.find();
    res.json(homes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Home by ID
exports.getHomeById = async (req, res) => {
  try {
    const home = await Home.findById(req.params.id);
    if (!home) return res.status(404).json({ message: 'Not found' });
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Home
exports.updateHome = async (req, res) => {
  try {
    const home = await Home.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!home) return res.status(404).json({ message: 'Not found' });
    res.json(home);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Home
exports.deleteHome = async (req, res) => {
  try {
    const home = await Home.findByIdAndDelete(req.params.id);
    if (!home) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
