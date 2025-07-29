const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const brandsController = require('../home/brandsController');

// Brands routes
router.post('/create', upload.single('logo'), brandsController.createBrand);
router.get('/get', brandsController.getAllBrands);
router.get('/getOne/:id', brandsController.getOneBrand);
router.put('/update/:id', upload.single('logo'), brandsController.updateBrand);
router.delete('/delete/:id', brandsController.deleteBrand);

module.exports = router; 