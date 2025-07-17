// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const cleaningController = require('../controllers/cleaningController.js');

router.post('/create', upload.array('photos', 5), cleaningController.createCleaning);
router.get('/get', cleaningController.getAllCleaning);
router.get('/getOne/:id', cleaningController.getOneCleaning);
router.put('/Update/:id', upload.array('photos', 5), cleaningController.updateCleaning);
router.delete('/delete/:id', cleaningController.deleteCleaning);

module.exports = router;
