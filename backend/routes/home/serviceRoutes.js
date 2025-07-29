const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/home/serviceController');

// Service routes
router.post('/create', serviceController.createService);
router.get('/get', serviceController.getAllServices);
router.get('/getOne/:id', serviceController.getOneService);
router.put('/update/:id', serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);

module.exports = router; 