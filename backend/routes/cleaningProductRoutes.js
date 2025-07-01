const express = require('express');
const router = express.Router();
const multer = require('multer');
const CleaningProduct = require('../models/CleaningProduct');

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
    const product = new CleaningProduct({
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

module.exports = router; 