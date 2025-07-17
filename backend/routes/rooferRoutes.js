// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.
// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const metalController = require('../controllers/roofer/metalController.js');
const shinglesController = require('../controllers/roofer/shinglesController.js');

router.post('/metal/create', upload.array('photos', 5), metalController.createMetal);
router.get('/metal/get', metalController.getAllMetal);
router.get('/metal/getOne/:id', metalController.getOneMetal);
router.put('/metal/Update/:id', upload.array('photos', 5), metalController.updateMetal);
router.delete('/metal/delete/:id', metalController.deleteMetal);
router.post('/shingles/create', upload.array('photos', 5), shinglesController.createShingles);
router.get('/shingles/get', shinglesController.getAllShingles);
router.get('/shingles/getOne/:id', shinglesController.getOneShingles);
router.put('/shingles/Update/:id', upload.array('photos', 5), shinglesController.updateShingles);
router.delete('/shingles/delete/:id', shinglesController.deleteShingles);

module.exports = router;
