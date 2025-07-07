// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const fittingController = require('../controllers/fittingController.js');

router.post('/', upload.array('photos', 5), fittingController.createFitting);
router.get('/', fittingController.getAllFitting);
router.get('/:id', fittingController.getOneFitting);
router.put('/:id', upload.array('photos', 5), fittingController.updateFitting);
router.delete('/:id', fittingController.deleteFitting);

module.exports = router;
