const express = require('express');
const router = express.Router();
const fiberController = require('../controllers/fiberController');

// Create
router.post('/', fiberController.createFiber);
// Get all
router.get('/', fiberController.getAllFibers);
// Get by id
router.get('/:id', fiberController.getFiberById);
// Update
router.put('/:id', fiberController.updateFiber);
// Delete
router.delete('/:id', fiberController.deleteFiber);

module.exports = router;
