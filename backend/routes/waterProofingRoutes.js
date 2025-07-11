// AUTO-REFRACTORED FOR WATERPROOFING CONTROLLERS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const BathroomsController = require('../controllers/waterProofing/bathroomsController.js');
const CreacksJointsController = require('../controllers/waterProofing/creacksJointsController.js');
const InteriorsController = require('../controllers/waterProofing/interiorsController.js');

router.post('/api/waterProofing/Bathrooms/create', upload.array('photos', 5), BathroomsController.createBathrooms);
router.get('/api/waterProofing/Bathrooms/get', BathroomsController.getAllBathrooms);
router.get('/api/waterProofing/Bathrooms/getOne:id', BathroomsController.getOneBathrooms);
router.put('/api/waterProofing/Bathrooms/Update:id', upload.array('photos', 5), BathroomsController.updateBathrooms);
router.delete('/api/waterProofing/Bathrooms/delete:id', BathroomsController.deleteBathrooms);
router.post('/api/waterProofing/CreacksJoints/create', upload.array('photos', 5), CreacksJointsController.createCreacksJoints);
router.get('/api/waterProofing/CreacksJoints/get', CreacksJointsController.getAllCreacksJoints);
router.get('/api/waterProofing/CreacksJoints/getOne:id', CreacksJointsController.getOneCreacksJoints);
router.put('/api/waterProofing/CreacksJoints/Update:id', upload.array('photos', 5), CreacksJointsController.updateCreacksJoints);
router.delete('/api/waterProofing/CreacksJoints/delete:id', CreacksJointsController.deleteCreacksJoints);
router.post('/api/waterProofing/Interiors/create', upload.array('photos', 5), InteriorsController.createInteriors);
router.get('/api/waterProofing/Interiors/get', InteriorsController.getAllInteriors);
router.get('/api/waterProofing/Interiors/getOne:id', InteriorsController.getOneInteriors);
router.put('/api/waterProofing/Interiors/Update:id', upload.array('photos', 5), InteriorsController.updateInteriors);
router.delete('/api/waterProofing/Interiors/delete:id', InteriorsController.deleteInteriors);

module.exports = router;
