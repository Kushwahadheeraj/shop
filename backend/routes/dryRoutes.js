// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const dryController = require('../controllers/dryController.js');

router.post('/create', upload.array('photos', 5), dryController.createDry);
router.get('/get', dryController.getAllDry);
router.get('/getOne/:id', dryController.getOneDry);
router.put('/Update/:id', upload.array('photos', 5), dryController.updateDry);
router.delete('/delete/:id', dryController.deleteDry);

// General route to get all dry products
router.get('/', async (req, res) => {
  try {
    const DryModels = require('../models/DryModels');
    const products = await DryModels.find({});
    res.json(products);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
