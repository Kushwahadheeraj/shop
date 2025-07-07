// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const brushController = require('../controllers/brushController.js');

router.post('/', upload.array('photos', 5), brushController.createBrush);
router.get('/', brushController.getAllBrush);
router.get('/:id', brushController.getOneBrush);
router.put('/:id', upload.array('photos', 5), brushController.updateBrush);
router.delete('/:id', brushController.deleteBrush);

module.exports = router;
