// AUTO-RENAMED FUNCTIONS TO MATCH FILE NAME. DO NOT EDIT MANUALLY.
// AUTO-GENERATED. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const metalController = require('../controllers/roofer/metalController.js');
const shinglesController = require('../controllers/roofer/shinglesController.js');
const cementsSheetController = require('../controllers/roofer/cementsSheetController.js');
const colorSheetController = require('../controllers/roofer/colorSheetController.js');
const fiberSheetController = require('../controllers/roofer/fiberSheetController.js');
const aluminiumSheetController = require('../controllers/roofer/aluminiumSheetController.js');
const teenSheetController = require('../controllers/roofer/teenSheetController.js');

// Existing routes
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

// New sheet product routes
router.post('/cements-sheet/create', upload.array('photos', 5), cementsSheetController.createCementsSheet);
router.get('/cements-sheet/get', cementsSheetController.getAllCementsSheet);
router.get('/cements-sheet/getOne/:id', cementsSheetController.getOneCementsSheet);
router.put('/cements-sheet/Update/:id', upload.array('photos', 5), cementsSheetController.updateCementsSheet);
router.delete('/cements-sheet/delete/:id', cementsSheetController.deleteCementsSheet);

router.post('/color-sheet/create', upload.array('photos', 5), colorSheetController.createColorSheet);
router.get('/color-sheet/get', colorSheetController.getAllColorSheet);
router.get('/color-sheet/getOne/:id', colorSheetController.getOneColorSheet);
router.put('/color-sheet/Update/:id', upload.array('photos', 5), colorSheetController.updateColorSheet);
router.delete('/color-sheet/delete/:id', colorSheetController.deleteColorSheet);

router.post('/fiber-sheet/create', upload.array('photos', 5), fiberSheetController.createFiberSheet);
router.get('/fiber-sheet/get', fiberSheetController.getAllFiberSheet);
router.get('/fiber-sheet/getOne/:id', fiberSheetController.getOneFiberSheet);
router.put('/fiber-sheet/Update/:id', upload.array('photos', 5), fiberSheetController.updateFiberSheet);
router.delete('/fiber-sheet/delete/:id', fiberSheetController.deleteFiberSheet);

router.post('/aluminium-sheet/create', upload.array('photos', 5), aluminiumSheetController.createAluminiumSheet);
router.get('/aluminium-sheet/get', aluminiumSheetController.getAllAluminiumSheet);
router.get('/aluminium-sheet/getOne/:id', aluminiumSheetController.getOneAluminiumSheet);
router.put('/aluminium-sheet/Update/:id', upload.array('photos', 5), aluminiumSheetController.updateAluminiumSheet);
router.delete('/aluminium-sheet/delete/:id', aluminiumSheetController.deleteAluminiumSheet);

router.post('/teen-sheet/create', upload.array('photos', 5), teenSheetController.createTeenSheet);
router.get('/teen-sheet/get', teenSheetController.getAllTeenSheet);
router.get('/teen-sheet/getOne/:id', teenSheetController.getOneTeenSheet);
router.put('/teen-sheet/Update/:id', upload.array('photos', 5), teenSheetController.updateTeenSheet);
router.delete('/teen-sheet/delete/:id', teenSheetController.deleteTeenSheet);

// General route to get all roofer products
router.get('/', async (req, res) => {
  try {
    const RooferModels = require('../models/RooferModels');
    const products = await RooferModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching roofer products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
