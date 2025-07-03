const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Create
router.post('/', homeController.createHome);
// Get all
router.get('/', homeController.getAllHomes);
// Get by id
router.get('/:id', homeController.getHomeById);
// Update
router.put('/:id', homeController.updateHome);
// Delete
router.delete('/:id', homeController.deleteHome);

module.exports = router;
