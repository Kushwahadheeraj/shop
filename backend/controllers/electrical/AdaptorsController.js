const ElectricalProduct = require('../../models/ElectricalProduct');

// Create
exports.create = async (req, res) => {
  try {
    const product = new ElectricalProduct({
      ...req.body,
      type: 'Adaptors',
      photos: req.files ? req.files.map(f => f.path) : [],
      tags: req.body.tags ? Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags] : [],
      productNo: req.body.productNo,
      productQualityName: req.body.productQualityName
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update
exports.update = async (req, res) => {
  try {
    const product = await ElectricalProduct.findOneAndUpdate(
      { _id: req.params.id, type: 'Adaptors' },
      { ...req.body, productNo: req.body.productNo, productQualityName: req.body.productQualityName },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.delete = async (req, res) => {
  try {
    await ElectricalProduct.deleteOne({ _id: req.params.id, type: 'Adaptors' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
exports.getAll = async (req, res) => {
  try {
    const products = await ElectricalProduct.find({ type: 'Adaptors' });
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get One
exports.getOne = async (req, res) => {
  try {
    const product = await ElectricalProduct.findOne({ _id: req.params.id, type: 'Adaptors' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}; 