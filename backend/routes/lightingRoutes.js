const express = require('express');
const router = express.Router();
const lightingController = require('../controllers/lightingController');

// Create
router.post('/', lightingController.createLighting);
// Get all
router.get('/', lightingController.getAllLightings);
// Get by id
router.get('/:id', lightingController.getLightingById);
// Update
router.put('/:id', lightingController.updateLighting);
// Delete
router.delete('/:id', lightingController.deleteLighting);

module.exports = router;
