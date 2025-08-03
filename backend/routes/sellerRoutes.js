// AUTO-GENERATED ROUTES AND SERVER IMPORTS. DO NOT EDIT MANUALLY.

const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController.js');
const auth = require('../middleware/auth.js');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.post('/register', sellerController.createSeller);
router.post('/login', sellerController.loginSeller);

// Protected routes (require authentication)
router.get('/profile/me', auth, sellerController.getCurrentSellerProfile);
router.put('/profile/me', auth, upload.single('avatar'), sellerController.updateCurrentSellerProfile);
router.put('/profile/password', auth, sellerController.changePassword);

// Seller management routes (protected, admin only) - MUST come before /:id routes
router.get('/list', auth, sellerController.getAllSellers);
router.put('/access-control', auth, sellerController.controlSellerAccess);
router.put('/update-access', auth, sellerController.updateSellerAccess);

// User management routes (admin only)
router.get('/users', auth, sellerController.getAllUsers);
router.put('/update-role', auth, sellerController.updateSellerRole);
router.delete('/delete-user', auth, sellerController.deleteUser);

// Parameterized routes (must come after specific routes)
router.get('/:id', sellerController.getOneSeller);
router.put('/:id', sellerController.updateSeller);

module.exports = router;
