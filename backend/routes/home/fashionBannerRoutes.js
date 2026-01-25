const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const fashionBannerController = require('../../controllers/home/fashionBannerController');

// Fashion Banner routes
router.post('/create', upload.single('image'), fashionBannerController.createItem);
router.get('/get', fashionBannerController.getAllItems);
router.get('/getOne/:id', fashionBannerController.getOneItem);
router.put('/update/:id', upload.single('image'), fashionBannerController.updateItem);
router.delete('/delete/:id', fashionBannerController.deleteItem);

module.exports = router;
