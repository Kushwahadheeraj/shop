const express = require('express');
const router = express.Router();
const euser = require('../controllers/euserController');
const euserAuth = require('../middleware/euserAuth');

router.post('/register', euser.register);
router.post('/login', euser.login);
router.get('/me', euserAuth, euser.me);
router.put('/profile', euserAuth, euser.updateProfile);
router.put('/change-password', euserAuth, euser.changePassword);

module.exports = router;
