const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const itemsController = require('../../controllers/home/itemsController');

// Items routes
router.post('/create', upload.single('image'), itemsController.createItem);
router.get('/get', itemsController.getAllItems);
router.get('/getOne/:id', itemsController.getOneItem);
router.put('/update/:id', upload.single('image'), itemsController.updateItem);
router.delete('/delete/:id', itemsController.deleteItem);

module.exports = router; 