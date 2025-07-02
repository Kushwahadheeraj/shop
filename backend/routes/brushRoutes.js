const express = require('express');
const router = express.Router();
const BrushModels = require('../models/BrushModels');

// Create product
router.post('/', async (req, res) => {
  try {
    const product = new BrushModels(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// (You can add GET, PUT, DELETE as needed)

module.exports = router;
