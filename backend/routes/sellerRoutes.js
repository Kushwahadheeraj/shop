// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const sellerController = require('../controllers/sellerController.js');

router.post('/', upload.array('photos', 5), sellerController.createSeller);
router.get('/', sellerController.getAllSeller);
router.get('/:id', sellerController.getOneSeller);
router.put('/:id', upload.array('photos', 5), sellerController.updateSeller);
router.delete('/:id', sellerController.deleteSeller);

module.exports = router;
