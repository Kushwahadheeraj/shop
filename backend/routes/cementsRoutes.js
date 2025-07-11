// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const cementsController = require('../controllers/cementsController.js');

router.post('/create', upload.array('photos', 5), cementsController.createCements);
router.get('/get', cementsController.getAllCements);
router.get('/getOne:id', cementsController.getOneCements);
router.put('/Update:id', upload.array('photos', 5), cementsController.updateCements);
router.delete('/delete:id', cementsController.deleteCements);

module.exports = router;
