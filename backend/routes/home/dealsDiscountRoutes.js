const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const dealsDiscountController = require('../../controllers/home/dealsDiscountController');

router.post('/create', upload.single('image'), dealsDiscountController.createItem);
router.get('/get', dealsDiscountController.getAllItems);
router.get('/getOne/:id', dealsDiscountController.getOneItem);
router.put('/update/:id', upload.single('image'), dealsDiscountController.updateItem);
router.delete('/delete/:id', dealsDiscountController.deleteItem);

module.exports = router;

