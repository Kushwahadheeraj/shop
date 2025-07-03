const express = require('express');
const router = express.Router();
const cleaningController = require('../controllers/cleaningController');

// Create
router.post('/', cleaningController.createCleaning);
// Get all
router.get('/', cleaningController.getAllCleanings);
// Get by id
router.get('/:id', cleaningController.getCleaningById);
// Update
router.put('/:id', cleaningController.updateCleaning);
// Delete
router.delete('/:id', cleaningController.deleteCleaning);

module.exports = router;
