const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const cardSliderController = require('../../controllers/home/cardSliderController');

// CardSlider routes
router.post('/create', upload.single('image'), cardSliderController.createCardSlider);
router.get('/get', cardSliderController.getAllCardSliders);
router.get('/getOne/:id', cardSliderController.getOneCardSlider);
router.put('/update/:id', upload.single('image'), cardSliderController.updateCardSlider);
router.delete('/delete/:id', cardSliderController.deleteCardSlider);

module.exports = router; 