// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const dryController = require('../controllers/dryController.js');

router.post('/', upload.array('photos', 5), dryController.createDry);
router.get('/', dryController.getAllDry);
router.get('/:id', dryController.getOneDry);
router.put('/:id', upload.array('photos', 5), dryController.updateDry);
router.delete('/:id', dryController.deleteDry);

module.exports = router;
