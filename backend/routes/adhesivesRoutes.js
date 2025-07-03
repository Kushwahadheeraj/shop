const express = require('express');
const router = express.Router();
const adhesivesController = require('../controllers/adhesivesController');

// Create
router.post('/', adhesivesController.createAdhesive);
// Get all
router.get('/', adhesivesController.getAllAdhesives);
// Get by id
router.get('/:id', adhesivesController.getAdhesiveById);
// Update
router.put('/:id', adhesivesController.updateAdhesive);
// Delete
router.delete('/:id', adhesivesController.deleteAdhesive);

module.exports = router;
