// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const fiberController = require('../controllers/fiberController.js');

router.post('/create', upload.array('photos', 5), fiberController.createFiber);
router.get('/get', fiberController.getAllFiber);
router.get('/getOne/:id', fiberController.getOneFiber);
router.put('/Update/:id', upload.array('photos', 5), fiberController.updateFiber);
router.delete('/delete/:id', fiberController.deleteFiber);

module.exports = router;
