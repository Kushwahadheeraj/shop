const ElectricalProduct = require('../../models/ElectricalProduct');

exports.create = async (req, res) => {
  try {
    const product = new ElectricalProduct({
      ...req.body,
      type: 'WiresAndCables',
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
    const product = await ElectricalProduct.findOneAndUpdate(
      { _id: req.params.id, type: 'WiresAndCables' },
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
    await ElectricalProduct.deleteOne({ _id: req.params.id, type: 'WiresAndCables' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const products = await ElectricalProduct.find({ type: 'WiresAndCables' });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await ElectricalProduct.findOne({ _id: req.params.id, type: 'WiresAndCables' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 