// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homeDecorController = require('../controllers/homeDecorController.js');

router.post('/create', upload.array('photos', 5), homeDecorController.createHomeDecor);
router.get('/get', homeDecorController.getAllHomeDecor);
router.get('/getOne/:id', homeDecorController.getOneHomeDecor);
router.put('/Update/:id', upload.array('photos', 5), homeDecorController.updateHomeDecor);
router.delete('/delete/:id', homeDecorController.deleteHomeDecor);

// General route to get all home decor products
router.get('/', async (req, res) => {
  try {
    const HomeDecorModels = require('../models/HomeDecorModels');
    const products = await HomeDecorModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching home decor products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
