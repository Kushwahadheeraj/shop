const express = require('express');
const router = express.Router();
const {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  uploadAttachment,
  getBillStats,
  addPayment,
  upload
} = require('../controllers/billController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Bill routes
router.post('/', createBill);
router.get('/', getBills);
router.get('/stats', getBillStats);
router.get('/:id', getBillById);
router.put('/:id', updateBill);
router.delete('/:id', deleteBill);
router.post('/:id/upload', upload.single('attachment'), uploadAttachment);
router.post('/:id/payment', addPayment);

module.exports = router;
