const express = require('express');
const router = express.Router();
const promoBannerController = require('../../controllers/home/promoBannerController');

router.get('/get', promoBannerController.getPromoBanner);
router.put('/update', promoBannerController.updatePromoBanner);

module.exports = router;
