// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const doorController = require('../controllers/pvcMats/doorController.js');
const floorController = require('../controllers/pvcMats/floorController.js');

router.post('/door/create', upload.array('photos', 5), doorController.createDoor);
router.get('/door/get', doorController.getAllDoor);
router.get('/door/getOne/:id', doorController.getOneDoor);
router.put('/door/Update/:id', upload.array('photos', 5), doorController.updateDoor);
router.delete('/door/delete/:id', doorController.deleteDoor);
router.post('/floor/create', upload.array('photos', 5), floorController.createFloor);
router.get('/floor/get', floorController.getAllFloor);
router.get('/floor/getOne/:id', floorController.getOneFloor);
router.put('/floor/Update/:id', upload.array('photos', 5), floorController.updateFloor);
router.delete('/floor/delete/:id', floorController.deleteFloor);

// General route to get all pvc mats products
router.get('/get', async (req, res) => {
  try {
    const PvcMatsModels = require('../models/PvcMatsModels');
    const products = await PvcMatsModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching pvc mats products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const PvcMatsModels = require('../models/PvcMatsModels');
    const products = await PvcMatsModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching pvc mats products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
