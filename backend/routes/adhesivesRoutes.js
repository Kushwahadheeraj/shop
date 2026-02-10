// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const adhesivesController = require('../controllers/adhesivesController.js');

router.post('/create', upload.array('photos', 5), adhesivesController.createAdhesives);
router.get('/get', adhesivesController.getAllAdhesives);
router.get('/getOne/:id', adhesivesController.getOneAdhesives);
router.put('/update/:id', upload.array('photos', 5), adhesivesController.updateAdhesives);
router.delete('/delete/:id', adhesivesController.deleteAdhesives);

// General route to get all adhesives products
router.get('/', async (req, res) => {
  try {
    const AdhesivesModels = require('../models/AdhesivesModels');
    const products = await AdhesivesModels.find({});
    res.json(products);
  } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
