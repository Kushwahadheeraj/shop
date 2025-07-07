// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const fiberController = require('../controllers/fiberController.js');

router.post('/', upload.array('photos', 5), fiberController.createFiber);
router.get('/', fiberController.getAllFiber);
router.get('/:id', fiberController.getOneFiber);
router.put('/:id', upload.array('photos', 5), fiberController.updateFiber);
router.delete('/:id', fiberController.deleteFiber);

module.exports = router;
