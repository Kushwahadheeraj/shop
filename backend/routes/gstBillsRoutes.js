const express = require('express');
const router = express.Router();
const {
  getGSTBills,
  getGSTBill,
  createGSTBill,
  updateGSTBill,
  deleteGSTBill,
  getGSTBillsStats
} = require('../controllers/gstBillsController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// GET /api/gst-bills - Get all GST bills
router.get('/', getGSTBills);

// GET /api/gst-bills/stats - Get GST bills statistics
router.get('/stats', getGSTBillsStats);

// GET /api/gst-bills/:id - Get single GST bill
router.get('/:id', getGSTBill);

// POST /api/gst-bills - Create new GST bill
router.post('/', createGSTBill);

// PUT /api/gst-bills/:id - Update GST bill
router.put('/:id', updateGSTBill);

// DELETE /api/gst-bills/:id - Delete GST bill
router.delete('/:id', deleteGSTBill);

module.exports = router;
