const express = require('express');
const router = express.Router();
const dryController = require('../controllers/dryController');

// Create
router.post('/', dryController.createDry);
// Get all
router.get('/', dryController.getAllDrys);
// Get by id
router.get('/:id', dryController.getDryById);
// Update
router.put('/:id', dryController.updateDry);
// Delete
router.delete('/:id', dryController.deleteDry);

module.exports = router;
