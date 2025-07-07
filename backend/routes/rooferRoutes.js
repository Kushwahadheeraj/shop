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
router.delete('/api/roofer/metal/:id', metalController.deleteMetal);
router.post('/api/roofer/shingles', upload.array('photos', 5), shinglesController.createShingles);
router.get('/api/roofer/shingles', shinglesController.getAllShingles);
router.get('/api/roofer/shingles/:id', shinglesController.getOneShingles);
router.put('/api/roofer/shingles/:id', upload.array('photos', 5), shinglesController.updateShingles);
router.delete('/api/roofer/shingles/:id', shinglesController.deleteShingles);

module.exports = router;
