const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const sanitaryImageController = require('../../controllers/home/sanitaryImageController');

// SanitaryImage routes
router.post('/create', upload.single('uploadedImage'), sanitaryImageController.createSanitaryImage);
router.get('/get', sanitaryImageController.getAllSanitaryImages);
router.get('/getOne/:id', sanitaryImageController.getOneSanitaryImage);
router.put('/update/:id', upload.single('uploadedImage'), sanitaryImageController.updateSanitaryImage);
router.delete('/delete/:id', sanitaryImageController.deleteSanitaryImage);

module.exports = router; 