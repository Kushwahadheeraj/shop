const ElectricalModels = require('../../models/ElectricalModels');

exports.create = async (req, res) => {
  try {
    const product = new ElectricalModels({
      ...req.body,
      type: 'WaterHeaters',
      photos: req.files ? req.files.map(f => f.path) : [],
      tags: req.body.tags ? Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags] : [],
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await ElectricalModels.findOneAndUpdate(
      { _id: req.params.id, type: 'WaterHeaters' },
      { ...req.body },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await ElectricalModels.deleteOne({ _id: req.params.id, type: 'WaterHeaters' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await ElectricalModels.find({ type: 'WaterHeaters' });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await ElectricalModels.findOne({ _id: req.params.id, type: 'WaterHeaters' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 