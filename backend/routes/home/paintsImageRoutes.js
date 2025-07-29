const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const paintsImageController = require('../../controllers/home/paintsImageController');

// PaintsImage routes
router.post('/create', upload.single('uploadedImage'), paintsImageController.createPaintsImage);
router.get('/get', paintsImageController.getAllPaintsImages);
router.get('/getOne/:id', paintsImageController.getOnePaintsImage);
router.put('/update/:id', upload.single('uploadedImage'), paintsImageController.updatePaintsImage);
router.delete('/delete/:id', paintsImageController.deletePaintsImage);

module.exports = router; 