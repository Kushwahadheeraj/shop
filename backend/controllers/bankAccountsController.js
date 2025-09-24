const BankAccount = require('../models/BankAccount');

const list = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const accounts = await BankAccount.find({ sellerId }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, data: accounts });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to list accounts' });
  }
};

const create = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const payload = { ...req.body, sellerId };
    if (payload.isDefault) {
      await BankAccount.updateMany({ sellerId }, { $set: { isDefault: false } });
    }
    const acc = await BankAccount.create(payload);
    res.status(201).json({ success: true, data: acc });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to create account' });
  }
};

const update = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    const payload = { ...req.body };
    if (payload.isDefault) {
      await BankAccount.updateMany({ sellerId }, { $set: { isDefault: false } });
    }
    const acc = await BankAccount.findOneAndUpdate({ _id: id, sellerId }, payload, { new: true });
    res.json({ success: true, data: acc });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to update account' });
  }
};

const remove = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    await BankAccount.deleteOne({ _id: id, sellerId });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Failed to delete account' });
  }
};

module.exports = { list, create, update, remove };


