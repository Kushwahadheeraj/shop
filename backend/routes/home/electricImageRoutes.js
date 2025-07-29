const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const electricImageController = require('../../controllers/home/electricImageController');

// ElectricImage routes
router.post('/create', upload.single('uploadedImage'), electricImageController.createElectricImage);
router.get('/get', electricImageController.getAllElectricImages);
router.get('/getOne/:id', electricImageController.getOneElectricImage);
router.put('/update/:id', upload.single('uploadedImage'), electricImageController.updateElectricImage);
router.delete('/delete/:id', electricImageController.deleteElectricImage);

module.exports = router; 