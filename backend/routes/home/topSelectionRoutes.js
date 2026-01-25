const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const topSelectionController = require('../../controllers/home/topSelectionController');

// Top Selection routes
router.post('/create', upload.single('image'), topSelectionController.createItem);
router.get('/get', topSelectionController.getAllItems);
router.get('/getOne/:id', topSelectionController.getOneItem);
router.put('/update/:id', upload.single('image'), topSelectionController.updateItem);
router.delete('/delete/:id', topSelectionController.deleteItem);

module.exports = router;
