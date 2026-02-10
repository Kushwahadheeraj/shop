// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const brushController = require('../controllers/brushController.js');

router.post('/create', upload.array('photos', 5), brushController.createBrush);
router.get('/get', brushController.getAllBrush);
router.get('/getOne/:id', brushController.getOneBrush);
router.put('/Update/:id', upload.array('photos', 5), brushController.updateBrush);
router.delete('/delete/:id', brushController.deleteBrush);

// General route to get all brush products
router.get('/', async (req, res) => {
  try {
    const BrushModels = require('../models/BrushModels');
    const products = await BrushModels.find({});
    res.json(products);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
