const express = require('express');
const router = express.Router();
const billFilesController = require('../controllers/billFilesController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// POST /api/bill-files - Create bill files
router.post('/', billFilesController.createBillFiles);

// GET /api/bill-files - Get bill files
router.get('/', billFilesController.getBillFiles);

// GET /api/bill-files/summary - Get bill files with summary
router.get('/summary', billFilesController.getBillFilesSummary);

// DELETE /api/bill-files/:id - Delete bill file
router.delete('/:id', billFilesController.deleteBillFile);

module.exports = router;

