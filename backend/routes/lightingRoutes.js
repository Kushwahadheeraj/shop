// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const lightingController = require('../controllers/lightingController.js');

router.post('/', upload.array('photos', 5), lightingController.createLighting);
router.get('/', lightingController.getAllLighting);
router.get('/:id', lightingController.getOneLighting);
router.put('/:id', upload.array('photos', 5), lightingController.updateLighting);
router.delete('/:id', lightingController.deleteLighting);

module.exports = router;
