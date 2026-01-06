const express = require('express');
const router = express.Router();
const {
  getProfiles,
  createProfile,
  updateProfile,
  deleteProfile
} = require('../controllers/invoiceBusinessController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

router.route('/')
  .get(getProfiles)
  .post(createProfile);

router.route('/:id')
  .put(updateProfile)
  .delete(deleteProfile);

module.exports = router;
