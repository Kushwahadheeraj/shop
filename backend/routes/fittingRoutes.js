const express = require('express');
const router = express.Router();
const fittingController = require('../controllers/fittingController');

// Create
router.post('/', fittingController.createFitting);
// Get all
router.get('/', fittingController.getAllFittings);
// Get by id
router.get('/:id', fittingController.getFittingById);
// Update
router.put('/:id', fittingController.updateFitting);
// Delete
router.delete('/:id', fittingController.deleteFitting);

module.exports = router;
