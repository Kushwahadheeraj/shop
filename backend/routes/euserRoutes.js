const express = require('express');
const router = express.Router();
const euser = require('../controllers/euserController');
const euserAuth = require('../middleware/euserAuth');

router.post('/register', euser.register);
router.post('/login', euser.login);
router.get('/me', euserAuth, euser.me);

module.exports = router;
