// AUTO-REFRACTORED FOR WATERPROOFING CONTROLLERS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const BathroomsController = require('../controllers/waterProofing/bathroomsController.js');
const CreacksJointsController = require('../controllers/waterProofing/creacksJointsController.js');
const InteriorsController = require('../controllers/waterProofing/interiorsController.js');

router.post('/api/waterProofing/Bathrooms', upload.array('photos', 5), BathroomsController.createBathrooms);
router.get('/api/waterProofing/Bathrooms', BathroomsController.getAllBathrooms);
router.get('/api/waterProofing/Bathrooms/:id', BathroomsController.getOneBathrooms);
router.put('/api/waterProofing/Bathrooms/:id', upload.array('photos', 5), BathroomsController.updateBathrooms);
router.delete('/api/waterProofing/Bathrooms/:id', BathroomsController.deleteBathrooms);
router.post('/api/waterProofing/CreacksJoints', upload.array('photos', 5), CreacksJointsController.createCreacksJoints);
router.get('/api/waterProofing/CreacksJoints', CreacksJointsController.getAllCreacksJoints);
router.get('/api/waterProofing/CreacksJoints/:id', CreacksJointsController.getOneCreacksJoints);
router.put('/api/waterProofing/CreacksJoints/:id', upload.array('photos', 5), CreacksJointsController.updateCreacksJoints);
router.delete('/api/waterProofing/CreacksJoints/:id', CreacksJointsController.deleteCreacksJoints);
router.post('/api/waterProofing/Interiors', upload.array('photos', 5), InteriorsController.createInteriors);
router.get('/api/waterProofing/Interiors', InteriorsController.getAllInteriors);
router.get('/api/waterProofing/Interiors/:id', InteriorsController.getOneInteriors);
router.put('/api/waterProofing/Interiors/:id', upload.array('photos', 5), InteriorsController.updateInteriors);
router.delete('/api/waterProofing/Interiors/:id', InteriorsController.deleteInteriors);

module.exports = router;
