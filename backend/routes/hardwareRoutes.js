// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const hardwareController = require('../controllers/hardwareController.js');

router.post('/create', upload.array('photos', 5), hardwareController.createHardware);
router.get('/get', hardwareController.getAllHardware);
router.get('/getOne/:id', hardwareController.getOneHardware);
router.put('/Update/:id', upload.array('photos', 5), hardwareController.updateHardware);
router.delete('/delete/:id', hardwareController.deleteHardware);

// General route to get all hardware products
router.get('/', async (req, res) => {
  try {
    const HardwareModels = require('../models/HardwareModels');
    const products = await HardwareModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching hardware products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
