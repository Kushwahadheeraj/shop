const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  upload
} = require('../controllers/simpleProductController');

// Get all products
router.get('/', getAllProducts);

// Get single product by ID
router.get('/:id', getProductById);

// Create new product (with file upload)
router.post('/', upload.single('image'), createProduct);

// Update product (with optional file upload)
router.put('/:id', upload.single('image'), updateProduct);

// Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
