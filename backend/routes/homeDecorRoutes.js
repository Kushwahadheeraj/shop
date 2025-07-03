const express = require('express');
const router = express.Router();
const homeDecorController = require('../controllers/homeDecorController');

// Create
router.post('/', homeDecorController.createHomeDecor);
// Get all
router.get('/', homeDecorController.getAllHomeDecors);
// Get by id
router.get('/:id', homeDecorController.getHomeDecorById);
// Update
router.put('/:id', homeDecorController.updateHomeDecor);
// Delete
router.delete('/:id', homeDecorController.deleteHomeDecor);

module.exports = router;
