const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createShop,
  listShops,
  updateShop,
  deleteShop,
  addFiles,
  deleteFile,
} = require('../controllers/shopManagementController');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'shop-management');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

router.use(auth);

router.post('/', createShop);
router.get('/', listShops);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);
router.post('/:id/files', upload.array('files', 10), addFiles);
router.delete('/:id/files/:fileId', deleteFile);

module.exports = router;

