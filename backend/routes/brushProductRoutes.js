const express = require('express');
const router = express.Router();
const BrushProduct = require('../models/BrushProduct');

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new BrushProduct(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// (You can add GET, PUT, DELETE as needed)

module.exports = router;
