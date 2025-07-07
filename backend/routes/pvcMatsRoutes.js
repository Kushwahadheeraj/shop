// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const doorController = require('../controllers/pvcMats/doorController.js');
const floorController = require('../controllers/pvcMats/floorController.js');

router.post('/api/pvcMats/door', upload.array('photos', 5), doorController.create);
router.get('/api/pvcMats/door', doorController.getAll);
router.get('/api/pvcMats/door/:id', doorController.getOne);
router.put('/api/pvcMats/door/:id', upload.array('photos', 5), doorController.update);
router.delete('/api/pvcMats/door/:id', doorController.delete);
router.post('/api/pvcMats/floor', upload.array('photos', 5), floorController.create);
router.get('/api/pvcMats/floor', floorController.getAll);
router.get('/api/pvcMats/floor/:id', floorController.getOne);
router.put('/api/pvcMats/floor/:id', upload.array('photos', 5), floorController.update);
router.delete('/api/pvcMats/floor/:id', floorController.delete);

module.exports = router;
