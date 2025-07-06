const Pipe = require('../../models/PipeModels');

// CREATE
exports.createAstralPipes = async (req, res) => {
  try {
    const item = new Pipe({
      ...req.body,
      category: 'AstralPipes'
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAllAstralPipes = async (req, res) => {
  try {
    const items = await Pipe.find({ category: 'AstralPipes' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ONE
exports.getOneAstralPipes = async (req, res) => {
  try {
    const item = await Pipe.findOne({ _id: req.params.id, category: 'AstralPipes' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateAstralPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndUpdate(
      { _id: req.params.id, category: 'AstralPipes' },
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
exports.deleteAstralPipes = async (req, res) => {
  try {
    const item = await Pipe.findOneAndDelete({ _id: req.params.id, category: 'AstralPipes' });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
