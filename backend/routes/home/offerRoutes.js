const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const offerController = require('../../controllers/home/offerController');

// Offer routes
router.post('/create', upload.single('image'), offerController.createOffer);
router.get('/get', offerController.getAllOffers);
router.get('/getByType/:offerType', offerController.getOffersByType);
router.get('/getOne/:id', offerController.getOneOffer);
router.put('/update/:id', upload.single('image'), offerController.updateOffer);
router.delete('/delete/:id', offerController.deleteOffer);

module.exports = router; 