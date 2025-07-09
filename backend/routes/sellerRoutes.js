// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController.js');

router.post('/register', sellerController.createSeller);
router.post('/login', sellerController.loginSeller);
router.get('/:id', sellerController.getOneSeller);
router.put('/:id', sellerController.updateSeller);
router.delete('/:id', sellerController.deleteSeller);
// ... existing code ...
// Remove or comment out the old GET /login route
// router.get('/login', sellerController.getAllSeller);
// ... existing code ...
module.exports = router;
