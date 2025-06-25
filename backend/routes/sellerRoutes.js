const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const auth = require('../middleware/auth');

router.post('/register', sellerController.register);
router.post('/login', sellerController.login);
router.get('/me', auth, sellerController.getMe);
router.post('/change-password', auth, sellerController.changePassword);

module.exports = router; 