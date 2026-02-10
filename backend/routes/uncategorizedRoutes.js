const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const uncategorizedController = require('../controllers/uncategorizedController.js');

router.post('/create', upload.array('photos', 5), uncategorizedController.createUncategorized);
router.get('/get', uncategorizedController.getAllUncategorized);
router.get('/getOne/:id', uncategorizedController.getOneUncategorized);
router.put('/Update/:id', upload.array('photos', 5), uncategorizedController.updateUncategorized);
router.delete('/delete/:id', uncategorizedController.deleteUncategorized);

// General route to get all uncategorized products
router.get('/', async (req, res) => {
  try {
    const UncategorizedModels = require('../models/UncategorizedModels');
    const products = await UncategorizedModels.find({});
    res.json(products);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
