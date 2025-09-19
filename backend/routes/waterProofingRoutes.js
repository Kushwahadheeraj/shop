// AUTO-REFRACTORED FOR WATERPROOFING CONTROLLERS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const BathroomsController = require('../controllers/waterProofing/bathroomsController.js');
const CreacksJointsController = require('../controllers/waterProofing/creacksJointsController.js');
const InteriorsController = require('../controllers/waterProofing/interiorsController.js');

router.post('/bathrooms/create', upload.array('photos', 5), BathroomsController.createBathrooms);
router.get('/bathrooms/get', BathroomsController.getAllBathrooms);
router.get('/bathrooms/getOne/:id', BathroomsController.getOneBathrooms);
router.put('/bathrooms/Update/:id', upload.array('photos', 5), BathroomsController.updateBathrooms);
router.delete('/bathrooms/delete/:id', BathroomsController.deleteBathrooms);
router.post('/creacks-joints/create', upload.array('photos', 5), CreacksJointsController.createCreacksJoints);
router.get('/creacks-joints/get', CreacksJointsController.getAllCreacksJoints);
router.get('/creacks-joints/getOne/:id', CreacksJointsController.getOneCreacksJoints);
router.put('/creacks-joints/Update/:id', upload.array('photos', 5), CreacksJointsController.updateCreacksJoints);
router.delete('/creacks-joints/delete/:id', CreacksJointsController.deleteCreacksJoints);
router.post('/interiors/create', upload.array('photos', 5), InteriorsController.createInteriors);
router.get('/interiors/get', InteriorsController.getAllInteriors);
router.get('/interiors/getOne/:id', InteriorsController.getOneInteriors);
router.put('/interiors/Update/:id', upload.array('photos', 5), InteriorsController.updateInteriors);
router.delete('/interiors/delete/:id', InteriorsController.deleteInteriors);

// General route to get all water proofing products
router.get('/', async (req, res) => {
  try {
    const WaterProofingModels = require('../models/WaterProofingModels');
    const products = await WaterProofingModels.find({});
    res.json(products);
  } catch (error) {
    console.error('Error fetching water proofing products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
