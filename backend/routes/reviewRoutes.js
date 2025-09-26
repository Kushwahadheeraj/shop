const express = require('express');
const router = express.Router();
const { listByProduct, create } = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.get('/', listByProduct);
// Use the same app login middleware
router.post('/', auth, create);

module.exports = router;


