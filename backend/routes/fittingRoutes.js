// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const fittingController = require('../controllers/fittingController.js');

router.post('/create', upload.array('photos', 5), fittingController.createFitting);
router.get('/get', fittingController.getAllFitting);
router.get('/getOne:id', fittingController.getOneFitting);
router.put('/Update:id', upload.array('photos', 5), fittingController.updateFitting);
router.delete('/delete:id', fittingController.deleteFitting);

module.exports = router;
