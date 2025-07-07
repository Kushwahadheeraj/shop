// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homeDecorController = require('../controllers/homeDecorController.js');

router.post('/', upload.array('photos', 5), homeDecorController.createHomeDecor);
router.get('/', homeDecorController.getAllHomeDecor);
router.get('/:id', homeDecorController.getOneHomeDecor);
router.put('/:id', upload.array('photos', 5), homeDecorController.updateHomeDecor);
router.delete('/:id', homeDecorController.deleteHomeDecor);

module.exports = router;
