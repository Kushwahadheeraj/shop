const express = require('express');
const router = express.Router();
const brushController = require('../controllers/brushController');

// Create
router.post('/', brushController.createBrush);
// Get all
router.get('/', brushController.getAllBrushes);
// Get by id
router.get('/:id', brushController.getBrushById);
// Update
router.put('/:id', brushController.updateBrush);
// Delete
router.delete('/:id', brushController.deleteBrush);

module.exports = router;
