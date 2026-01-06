const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductsByCategory,
  searchProducts
} = require('../controllers/productController');

// Get all products
router.get('/', getAllProducts);

// Get products by category
router.get('/category/:category', getProductsByCategory);

// Search products
router.get('/search', searchProducts);

// Get products by IDs
router.post('/details', require('../controllers/productController').getProductsByIds);

module.exports = router;
