const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homePaintsController = require('../../controllers/home/homePaintsController');

// HomePaints routes
router.post('/create', upload.array('images', 8), homePaintsController.createHomePaint);
router.get('/get', homePaintsController.getAllHomePaints);
router.get('/getByCategory/:category', homePaintsController.getHomePaintsByCategory);
router.get('/getByBrand/:brand', homePaintsController.getHomePaintsByBrand);
router.get('/getByColor/:color', homePaintsController.getHomePaintsByColor);
router.get('/getByFinish/:finish', homePaintsController.getHomePaintsByFinish);
router.get('/getOne/:id', homePaintsController.getOneHomePaint);
router.put('/update/:id', upload.array('images', 8), homePaintsController.updateHomePaint);
router.delete('/delete/:id', homePaintsController.deleteHomePaint);

module.exports = router; 