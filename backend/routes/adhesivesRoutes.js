// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const adhesivesController = require('../controllers/adhesivesController.js');

router.post('/create', upload.array('photos', 5), adhesivesController.createAdhesives);
router.get('/get', adhesivesController.getAllAdhesives);
router.get('/getOne/:id', adhesivesController.getOneAdhesives);
router.put('/Update/:id', upload.array('photos', 5), adhesivesController.updateAdhesives);
router.delete('/delete/:id', adhesivesController.deleteAdhesives);

module.exports = router;
