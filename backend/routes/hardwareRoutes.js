const express = require('express');
const router = express.Router();
const hardwareController = require('../controllers/hardwareController');

// Create
router.post('/', hardwareController.createHardware);
// Get all
router.get('/', hardwareController.getAllHardwares);
// Get by id
router.get('/:id', hardwareController.getHardwareById);
// Update
router.put('/:id', hardwareController.updateHardware);
// Delete
router.delete('/:id', hardwareController.deleteHardware);

module.exports = router;
