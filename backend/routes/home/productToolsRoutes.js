const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const productToolsController = require('../../controllers/home/productToolsController');

// ProductTools routes
router.post('/create', upload.array('images', 8), productToolsController.createProductTool);
router.get('/get', productToolsController.getAllProductTools);
router.get('/getByCategory/:category', productToolsController.getProductToolsByCategory);
router.get('/getByBrand/:brand', productToolsController.getProductToolsByBrand);
router.get('/getOne/:id', productToolsController.getOneProductTool);
router.put('/update/:id', upload.array('images', 8), productToolsController.updateProductTool);
router.delete('/delete/:id', productToolsController.deleteProductTool);

module.exports = router; 