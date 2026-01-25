const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const shopByCategoryController = require('../../controllers/home/shopByCategoryController');

router.post('/create', upload.single('image'), shopByCategoryController.createItem);
router.get('/get', shopByCategoryController.getAllItems);
router.get('/getOne/:id', shopByCategoryController.getOneItem);
router.put('/update/:id', upload.single('image'), shopByCategoryController.updateItem);
router.delete('/delete/:id', shopByCategoryController.deleteItem);

module.exports = router;
