const express = require('express');
const categoryCountController = require('../controllers/categoryCountController');
const router = express.Router();

// Get count for a specific category
router.get('/:categoryKey', categoryCountController.getCategoryCount);

// Get all category counts
router.get('/', categoryCountController.getAllCategoryCounts);

// Get subcategories for a specific category
router.get('/:categoryKey/subcategories', categoryCountController.getCategorySubcategories);

module.exports = router;
