// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const doorController = require('../controllers/pvcMats/doorController.js');
const floorController = require('../controllers/pvcMats/floorController.js');

router.post('/api/pvcMats/door', upload.array('photos', 5), doorController.createDoor);
router.get('/api/pvcMats/door', doorController.getAllDoor);
router.get('/api/pvcMats/door/:id', doorController.getOneDoor);
router.put('/api/pvcMats/door/:id', upload.array('photos', 5), doorController.updateDoor);
router.delete('/api/pvcMats/door/:id', doorController.deleteDoor);
router.post('/api/pvcMats/floor', upload.array('photos', 5), floorController.createFloor);
router.get('/api/pvcMats/floor', floorController.getAllFloor);
router.get('/api/pvcMats/floor/:id', floorController.getOneFloor);
router.put('/api/pvcMats/floor/:id', upload.array('photos', 5), floorController.updateFloor);
router.delete('/api/pvcMats/floor/:id', floorController.deleteFloor);

module.exports = router;
