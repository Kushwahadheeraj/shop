const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const cardController = require('../../controllers/home/cardController');

// Card routes
router.post('/create', upload.single('image'), cardController.createCard);
router.get('/get', cardController.getAllCards);
router.get('/getByCategory/:category', cardController.getCardsByCategory);
router.get('/getOne/:id', cardController.getOneCard);
router.put('/update/:id', upload.single('image'), cardController.updateCard);
router.delete('/delete/:id', cardController.deleteCard);

module.exports = router; 