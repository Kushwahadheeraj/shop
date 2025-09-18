const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

// Upload single image to Cloudinary
router.post('/cloudinary', upload.single('file'), uploadController.uploadImage);

module.exports = router;
