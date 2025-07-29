const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const popularProductsController = require('../../controllers/home/popularProductsController');

// PopularProducts routes
router.post('/create', upload.single('image'), popularProductsController.createPopularProduct);
router.get('/get', popularProductsController.getAllPopularProducts);
router.get('/getByCategory/:category', popularProductsController.getPopularProductsByCategory);
router.get('/getTopRated', popularProductsController.getTopRatedProducts);
router.get('/getOne/:id', popularProductsController.getOnePopularProduct);
router.put('/update/:id', upload.single('image'), popularProductsController.updatePopularProduct);
router.delete('/delete/:id', popularProductsController.deletePopularProduct);

module.exports = router; 