const express = require('express');
const router = express.Router();
const AdhesivesProduct = require('../models/AdhesivesProduct');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.array('photos', 10), async (req, res) => {
  try {
    const photos = req.files.map(file => file.path);
    const product = new AdhesivesProduct({ ...req.body, photos });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', upload.array('photos', 10), async (req, res) => {
  try {
    const photos = req.files.map(file => file.path);
    const updateData = { ...req.body };
    if (photos.length) updateData.photos = photos;
    const product = await AdhesivesProduct.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  const products = await AdhesivesProduct.find();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await AdhesivesProduct.findById(req.params.id);
  res.json(product);
});

module.exports = router;
