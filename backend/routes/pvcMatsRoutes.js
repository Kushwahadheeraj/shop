// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const doorController = require('../controllers/pvcMats/doorController.js');
const floorController = require('../controllers/pvcMats/floorController.js');

router.post('/api/pvcMats/door/create', upload.array('photos', 5), doorController.createDoor);
router.get('/api/pvcMats/door/get', doorController.getAllDoor);
router.get('/api/pvcMats/door/getOne:id', doorController.getOneDoor);
router.put('/api/pvcMats/door/Update:id', upload.array('photos', 5), doorController.updateDoor);
router.delete('/api/pvcMats/door/delete:id', doorController.deleteDoor);
router.post('/api/pvcMats/floor/create', upload.array('photos', 5), floorController.createFloor);
router.get('/api/pvcMats/floor/get', floorController.getAllFloor);
router.get('/api/pvcMats/floor/getOne:id', floorController.getOneFloor);
router.put('/api/pvcMats/floor/Update:id', upload.array('photos', 5), floorController.updateFloor);
router.delete('/api/pvcMats/floor/delete:id', floorController.deleteFloor);

module.exports = router;
