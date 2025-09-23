const GSTShop = require('../models/GSTShop');

exports.createGSTShop = async (req, res) => {
  try {
    if (!req.sellerId) return res.status(401).json({ success: false, message: 'Authentication required' });
    const payload = { ...req.body, sellerId: req.sellerId };
    if (!payload.name) return res.status(400).json({ success: false, message: 'Business name is required' });
    if (payload.isDefault) {
      await GSTShop.updateMany({ sellerId: req.sellerId, isDefault: true }, { $set: { isDefault: false } });
    }
    const doc = await GSTShop.create(payload);
    res.status(201).json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error creating GST shop', error: e.message });
  }
};

exports.getGSTShops = async (req, res) => {
  try {
    if (!req.sellerId) return res.status(401).json({ success: false, message: 'Authentication required' });
    const docs = await GSTShop.find({ sellerId: req.sellerId }).sort({ name: 1 });
    res.json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching GST shops', error: e.message });
  }
};

exports.getGSTShop = async (req, res) => {
  try {
    if (!req.sellerId) return res.status(401).json({ success: false, message: 'Authentication required' });
    const doc = await GSTShop.findOne({ _id: req.params.id, sellerId: req.sellerId });
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error fetching GST shop', error: e.message });
  }
};

exports.updateGSTShop = async (req, res) => {
  try {
    if (!req.sellerId) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (req.body && req.body.isDefault) {
      await GSTShop.updateMany({ sellerId: req.sellerId, isDefault: true }, { $set: { isDefault: false } });
    }
    const doc = await GSTShop.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.sellerId },
      req.body,
      { new: true }
    );
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error updating GST shop', error: e.message });
  }
};

exports.deleteGSTShop = async (req, res) => {
  try {
    if (!req.sellerId) return res.status(401).json({ success: false, message: 'Authentication required' });
    const doc = await GSTShop.findOneAndDelete({ _id: req.params.id, sellerId: req.sellerId });
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Error deleting GST shop', error: e.message });
  }
};


