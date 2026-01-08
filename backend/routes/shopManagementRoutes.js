const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const {
  createShop,
  listShops,
  updateShop,
  deleteShop,
  addFiles,
  deleteFile,
} = require('../controllers/shopManagementController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(auth);

router.post('/', createShop);
router.get('/', listShops);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);
router.post('/:id/files', upload.array('files', 10), addFiles);
router.delete('/:id/files/:fileId', deleteFile);

module.exports = router;

