const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const toolsImageController = require('../home/toolsImageController');

// ToolsImage routes
router.post('/create', upload.single('uploadedImage'), toolsImageController.createToolsImage);
router.get('/get', toolsImageController.getAllToolsImages);
router.get('/getOne/:id', toolsImageController.getOneToolsImage);
router.put('/update/:id', upload.single('uploadedImage'), toolsImageController.updateToolsImage);
router.delete('/delete/:id', toolsImageController.deleteToolsImage);

module.exports = router; 