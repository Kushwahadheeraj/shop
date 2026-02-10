const mongoose = require('mongoose');
const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');
const ShopManagementShop = require('../models/ShopManagementShop');

const getSellerId = (req) => req.sellerId;

// Create shop
const createShop = async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { name, phone = '', address = '' } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Shop name is required' });

    const shop = await ShopManagementShop.create({ sellerId, name, phone, address });
    res.status(201).json({ success: true, data: shop });
  } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating shop', error: err.message });
  }
};

// List shops
const listShops = async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const shops = await ShopManagementShop.find({ sellerId }).sort({ createdAt: -1 });
    res.json({ success: true, data: shops });
  } catch (err) {
        res.status(500).json({ success: false, message: 'Error listing shops', error: err.message });
  }
};

// Update shop
const updateShop = async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const { name, phone, address } = req.body;
    const updated = await ShopManagementShop.findOneAndUpdate(
      { _id: id, sellerId },
      { ...(name !== undefined ? { name } : {}), ...(phone !== undefined ? { phone } : {}), ...(address !== undefined ? { address } : {}) },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating shop', error: err.message });
  }
};

// Delete shop
const deleteShop = async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const deleted = await ShopManagementShop.findOneAndDelete({ _id: id, sellerId });
    if (!deleted) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, message: 'Shop deleted' });
  } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting shop', error: err.message });
  }
};

// Add files to shop
const addFiles = async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id } = req.params;
    const shop = await ShopManagementShop.findOne({ _id: id, sellerId });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    const files = req.files || [];
    const uploaded = [];
    for (const file of files) {
      const stream = bucket.openUploadStream(file.originalname, { contentType: file.mimetype });
      await new Promise((resolve, reject) => {
        Readable.from(file.buffer).pipe(stream).on('finish', resolve).on('error', reject);
      });
      uploaded.push({
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/files/${stream.id.toString()}`,
      });
    }
    shop.files = [...shop.files, ...uploaded];
    await shop.save();
    res.json({ success: true, data: shop });
  } catch (err) {
        res.status(500).json({ success: false, message: 'Error adding files', error: err.message });
  }
};

// Delete a single file from a shop
const deleteFile = async (req, res) => {
  try {
    const sellerId = getSellerId(req);
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const { id, fileId } = req.params;

    const shop = await ShopManagementShop.findOne({ _id: id, sellerId });
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });

    const fileDoc = shop.files.id(fileId);
    if (!fileDoc) return res.status(404).json({ success: false, message: 'File not found' });

    if (fileDoc.url && fileDoc.url.startsWith('/files/')) {
      const idStr = fileDoc.url.split('/files/')[1];
      try {
        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
        await bucket.delete(new mongoose.Types.ObjectId(idStr));
      } catch (e) {}
    } else if (fileDoc.url) {
      const filename = path.basename(fileDoc.url);
      const filePath = path.join(__dirname, '..', 'uploads', 'shop-management', filename);
      fs.unlink(filePath, () => {});
    }

    fileDoc.deleteOne();
    await shop.save();

    res.json({ success: true, data: shop });
  } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting file', error: err.message });
  }
};

module.exports = {
  createShop,
  listShops,
  updateShop,
  deleteShop,
  addFiles,
  deleteFile,
};

