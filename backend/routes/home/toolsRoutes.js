const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const toolsController = require('../../controllers/home/toolsController');

// Tools routes
router.post('/create', upload.single('image'), toolsController.createTool);
router.get('/get', toolsController.getAllTools);
router.get('/getByCategory/:category', toolsController.getToolsByCategory);
router.get('/getOne/:id', toolsController.getOneTool);
router.put('/update/:id', upload.single('image'), toolsController.updateTool);
router.delete('/delete/:id', toolsController.deleteTool);

module.exports = router; 