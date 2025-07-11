// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homeController = require('../controllers/homeController.js');

router.post('/create', upload.array('photos', 5), homeController.createHome);
router.get('/get', homeController.getAllHome);
router.get('/getOne:id', homeController.getOneHome);
router.put('/Update:id', upload.array('photos', 5), homeController.updateHome);
router.delete('/delete:id', homeController.deleteHome);

module.exports = router;
