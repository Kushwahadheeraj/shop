// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const adhesivesController = require('../controllers/adhesivesController.js');

router.post('/', upload.array('photos', 5), adhesivesController.createAdhesives);
router.get('/', adhesivesController.getAllAdhesives);
router.get('/:id', adhesivesController.getOneAdhesives);
router.put('/:id', upload.array('photos', 5), adhesivesController.updateAdhesives);
router.delete('/:id', adhesivesController.deleteAdhesives);

module.exports = router;
