const express = require('express');
const router = express.Router();
const {
  createSimpleBill,
  getSimpleBills,
  getSimpleBillById,
  updateSimpleBill,
  deleteSimpleBill,
  getSimpleBillStats,
  addPayment
} = require('../controllers/simpleBillController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Simple bill routes
router.post('/', createSimpleBill);
router.get('/', getSimpleBills);
router.get('/stats', getSimpleBillStats);
router.get('/:id', getSimpleBillById);
router.put('/:id', updateSimpleBill);
router.delete('/:id', deleteSimpleBill);
router.post('/:id/payment', addPayment);

module.exports = router;


