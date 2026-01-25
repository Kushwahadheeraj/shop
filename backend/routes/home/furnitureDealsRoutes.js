const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const furnitureDealsController = require('../../controllers/home/furnitureDealsController');

router.post('/create', upload.single('image'), furnitureDealsController.createItem);
router.get('/get', furnitureDealsController.getAllItems);
router.get('/getOne/:id', furnitureDealsController.getOneItem);
router.put('/update/:id', upload.single('image'), furnitureDealsController.updateItem);
router.delete('/delete/:id', furnitureDealsController.deleteItem);

module.exports = router;

