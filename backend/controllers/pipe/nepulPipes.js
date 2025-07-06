const Pipe = require('../../models/PipeModels');

// CREATE
exports.createNepulPipes = async (req, res) => {
  try {
    const item = new Pipe({
      ...req.body,
      category: 'NepulPipes'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAllNepulPipes = async (req, res) => {
  try {
    const items = await Pipe.find({ category: 'NepulPipes' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
exports.getOneNepulPipes = async (req, res) => {
  try {
    const item = await Pipe.findOne({ _id: req.params.id, category: 'NepulPipes' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateNepulPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndUpdate(
      { _id: req.params.id, category: 'NepulPipes' },
      req.body,
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteNepulPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndDelete({ _id: req.params.id, category: 'NepulPipes' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
