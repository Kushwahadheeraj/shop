const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const categoriesController = require('../../controllers/home/categoriesController');

// Categories routes
router.post('/create', upload.single('image'), categoriesController.createCategory);
router.get('/get', categoriesController.getAllCategories);
router.get('/getOne/:id', categoriesController.getOneCategory);
router.put('/update/:id', upload.single('image'), categoriesController.updateCategory);
router.delete('/delete/:id', categoriesController.deleteCategory);

module.exports = router; 