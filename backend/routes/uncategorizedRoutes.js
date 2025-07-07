// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const uncategorizedController = require('../controllers/uncategorizedController.js');

router.post('/', upload.array('photos', 5), uncategorizedController.createUncategorized);
router.get('/', uncategorizedController.getAllUncategorized);
router.get('/:id', uncategorizedController.getOneUncategorized);
router.put('/:id', upload.array('photos', 5), uncategorizedController.updateUncategorized);
router.delete('/:id', uncategorizedController.deleteUncategorized);

module.exports = router;
