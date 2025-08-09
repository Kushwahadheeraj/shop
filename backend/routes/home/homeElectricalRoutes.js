const express = require('express');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
const homeElectricalController = require('../../controllers/home/homeElectricalController');

// HomeElectrical routes
router.post('/create', upload.single('image'), homeElectricalController.createHomeElectrical);
router.get('/get', homeElectricalController.getAllHomeElectrical);
router.get('/selected-categories', homeElectricalController.getSelectedCategories);
router.post('/select-categories', homeElectricalController.selectCategories);
// Convenience: categories from main ElectricalModels and first product per category via same endpoint
// Example: GET /api/home/electrical/get?firstPerCategory=true
router.get('/getByCategory/:category', homeElectricalController.getHomeElectricalByCategory);
router.get('/getByBrand/:brand', homeElectricalController.getHomeElectricalByBrand);
router.get('/getOne/:id', homeElectricalController.getOneHomeElectrical);
router.put('/update/:id', upload.single('image'), homeElectricalController.updateHomeElectrical);
router.delete('/delete/:id', homeElectricalController.deleteHomeElectrical);

module.exports = router; 