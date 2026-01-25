const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const bestQualityController = require('../../controllers/home/bestQualityController');

// Best Quality routes
router.post('/create', upload.single('image'), bestQualityController.createItem);
router.get('/get', bestQualityController.getAllItems);
router.get('/getOne/:id', bestQualityController.getOneItem);
router.put('/update/:id', upload.single('image'), bestQualityController.updateItem);
router.delete('/delete/:id', bestQualityController.deleteItem);

module.exports = router;
