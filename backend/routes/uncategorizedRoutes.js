const express = require('express');
const router = express.Router();
const uncategorizedController = require('../controllers/uncategorizedController');

// Create
router.post('/', uncategorizedController.createUncategorized);
// Get all
router.get('/', uncategorizedController.getAllUncategorizeds);
// Get by id
router.get('/:id', uncategorizedController.getUncategorizedById);
// Update
router.put('/:id', uncategorizedController.updateUncategorized);
// Delete
router.delete('/:id', uncategorizedController.deleteUncategorized);

module.exports = router;
