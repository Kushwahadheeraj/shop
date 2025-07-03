const express = require('express');
const router = express.Router();
const cementsController = require('../controllers/cementsController');

// Create
router.post('/', cementsController.createCement);
// Get all
router.get('/', cementsController.getAllCements);
// Get by id
router.get('/:id', cementsController.getCementById);
// Update
router.put('/:id', cementsController.updateCement);
// Delete
router.delete('/:id', cementsController.deleteCement);

module.exports = router;
