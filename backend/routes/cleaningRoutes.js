// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const cleaningController = require('../controllers/cleaningController.js');

router.post('/', upload.array('photos', 5), cleaningController.createCleaning);
router.get('/', cleaningController.getAllCleaning);
router.get('/:id', cleaningController.getOneCleaning);
router.put('/:id', upload.array('photos', 5), cleaningController.updateCleaning);
router.delete('/:id', cleaningController.deleteCleaning);

module.exports = router;
