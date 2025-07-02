const express = require('express');
const router = express.Router();
const multer = require('multer');
const CleaningModels = require('../models/CleaningModels');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/cleaning/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage, limits: { files: 5 } });

router.post('/', upload.array('photos', 5), async (req, res) => {
  try {
    const photoPaths = req.files.map(file => file.path);
    const product = new CleaningModels({
      ...req.body,
      photos: photoPaths,
      tags: req.body.tags ? Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags] : [],
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all cleaning products
router.get('/', async (req, res) => {
  try {
    const products = await CleaningModels.find();
    res.json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get one cleaning product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await CleaningModels.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update cleaning product by ID
router.put('/:id', upload.array('photos', 5), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map(file => file.path);
    }
    if (updateData.tags) {
      updateData.tags = Array.isArray(updateData.tags) ? updateData.tags : [updateData.tags];
    }
    const product = await CleaningModels.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete cleaning product by ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await CleaningModels.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 