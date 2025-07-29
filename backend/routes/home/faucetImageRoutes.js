const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const faucetImageController = require('../../controllers/home/faucetImageController');

// FaucetImage routes
router.post('/create', upload.single('uploadedImage'), faucetImageController.createFaucetImage);
router.get('/get', faucetImageController.getAllFaucetImages);
router.get('/getOne/:id', faucetImageController.getOneFaucetImage);
router.put('/update/:id', upload.single('uploadedImage'), faucetImageController.updateFaucetImage);
router.delete('/delete/:id', faucetImageController.deleteFaucetImage);

module.exports = router; 