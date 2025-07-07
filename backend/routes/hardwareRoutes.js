// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const hardwareController = require('../controllers/hardwareController.js');

router.post('/', upload.array('photos', 5), hardwareController.createHardware);
router.get('/', hardwareController.getAllHardware);
router.get('/:id', hardwareController.getOneHardware);
router.put('/:id', upload.array('photos', 5), hardwareController.updateHardware);
router.delete('/:id', hardwareController.deleteHardware);

module.exports = router;
