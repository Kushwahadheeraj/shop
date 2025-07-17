// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homeDecorController = require('../controllers/homeDecorController.js');

router.post('/create', upload.array('photos', 5), homeDecorController.createHomeDecor);
router.get('/get', homeDecorController.getAllHomeDecor);
router.get('/getOne/:id', homeDecorController.getOneHomeDecor);
router.put('/Update/:id', upload.array('photos', 5), homeDecorController.updateHomeDecor);
router.delete('/delete/:id', homeDecorController.deleteHomeDecor);

module.exports = router;
