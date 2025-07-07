// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homeController = require('../controllers/homeController.js');

router.post('/', upload.array('photos', 5), homeController.createHome);
router.get('/', homeController.getAllHome);
router.get('/:id', homeController.getOneHome);
router.put('/:id', upload.array('photos', 5), homeController.updateHome);
router.delete('/:id', homeController.deleteHome);

module.exports = router;
