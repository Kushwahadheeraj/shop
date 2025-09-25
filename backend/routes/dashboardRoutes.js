const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, getDeliveryAnalytics } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

// Get dashboard analytics
router.get('/analytics', getDashboardAnalytics);

// Get delivery analytics
router.get('/delivery-analytics', getDeliveryAnalytics);

// Debug endpoint to check database
router.get('/debug', async (req, res) => {
  try {
    const GstBill = require('../models/GSTBill');
    const Bill = require('../models/Bill');
    
    const allGstBills = await GstBill.find({});
    const allRegularBills = await Bill.find({});
    
    const gstSellerIds = [...new Set(allGstBills.map(bill => bill.sellerId))];
    const regularSellerIds = [...new Set(allRegularBills.map(bill => bill.sellerId))];
    
    res.json({
      success: true,
      data: {
        gstBills: allGstBills.length,
        regularBills: allRegularBills.length,
        gstSellerIds,
        regularSellerIds,
        sampleGstBill: allGstBills[0] || null,
        sampleRegularBill: allRegularBills[0] || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
