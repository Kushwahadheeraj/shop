const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const galleryController = require('../controllers/galleryController');

// Card routes
router.post('/create', upload.single('image'), galleryController.createGallery);
router.get('/get', galleryController.getAllGallerys);
router.get('/getByCategory/:category', galleryController.getGallerysByCategory);
router.get('/getOne/:id', galleryController.getOneGallery);
router.put('/update/:id', upload.single('image'), galleryController.updateGallery);
router.delete('/delete/:id', galleryController.deleteGallery);

module.exports = router; 