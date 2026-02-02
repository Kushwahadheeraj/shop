const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const heroProductCardController = require('../../controllers/home/heroProductCardController');

// Routes
router.post('/create', upload.single('image'), heroProductCardController.createItem);
router.get('/get', heroProductCardController.getAllItems);
router.get('/getGrouped', heroProductCardController.getGroupedItems);
router.get('/getOne/:id', heroProductCardController.getOneItem);
router.put('/update/:id', upload.single('image'), heroProductCardController.updateItem);
router.delete('/delete/:id', heroProductCardController.deleteItem);

module.exports = router;
