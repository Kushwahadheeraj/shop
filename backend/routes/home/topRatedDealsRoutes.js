const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const topRatedDealsController = require('../../controllers/home/topRatedDealsController');

router.post('/create', upload.single('image'), topRatedDealsController.createItem);
router.get('/get', topRatedDealsController.getAllItems);
router.get('/getOne/:id', topRatedDealsController.getOneItem);
router.put('/update/:id', upload.single('image'), topRatedDealsController.updateItem);
router.delete('/delete/:id', topRatedDealsController.deleteItem);

module.exports = router;

