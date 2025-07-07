// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.
// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const metalController = require('../controllers/roofer/metalController.js');
const shinglesController = require('../controllers/roofer/shinglesController.js');

router.post('/api/roofer/metal', upload.array('photos', 5), metalController.createMetal);
router.get('/api/roofer/metal', metalController.getAllMetal);
router.get('/api/roofer/metal/:id', metalController.getOneMetal);
router.put('/api/roofer/metal/:id', upload.array('photos', 5), metalController.updateMetal);
router.deleteMetal('/api/roofer/metal/:id', metalController.deleteMetal);
router.post('/api/roofer/shingles', upload.array('photos', 5), shinglesController.createMetal);
router.get('/api/roofer/shingles', shinglesController.getAllMetal);
router.get('/api/roofer/shingles/:id', shinglesController.getOneMetal);
router.put('/api/roofer/shingles/:id', upload.array('photos', 5), shinglesController.updateMetal);
router.deleteMetal('/api/roofer/shingles/:id', shinglesController.deleteMetal);

module.exports = router;
