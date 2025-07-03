const Electrical = require('../../models/ElectricalModels');

// Create Socket
exports.createSocket = async (req, res) => {
  try {
    const socket = new Electrical({ ...req.body, type: 'Sockets' });
    await socket.save();
    res.status(201).json(socket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Sockets
exports.getAllSockets = async (req, res) => {
  try {
    const sockets = await Electrical.find({ type: 'Sockets' });
    res.json(sockets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Socket by ID
exports.getSocketById = async (req, res) => {
  try {
    const socket = await Electrical.findOne({ _id: req.params.id, type: 'Sockets' });
    if (!socket) return res.status(404).json({ message: 'Not found' });
    res.json(socket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Socket
exports.updateSocket = async (req, res) => {
  try {
    const socket = await Electrical.findOneAndUpdate(
      { _id: req.params.id, type: 'Sockets' },
      req.body,
      { new: true }
    );
    if (!socket) return res.status(404).json({ message: 'Not found' });
    res.json(socket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Socket
exports.deleteSocket = async (req, res) => {
  try {
    const socket = await Electrical.findOneAndDelete({ _id: req.params.id, type: 'Sockets' });
    if (!socket) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 