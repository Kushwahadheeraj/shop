const GSTBill = require('../models/GSTBill');
const Shop = require('../models/Shop');
const GSTShop = require('../models/GSTShop');

// Get all GST bills
const getGSTBills = async (req, res) => {
  try {
    const { shopId, search, startDate, endDate } = req.query;
    const sellerId = req.sellerId;
    
    if (!sellerId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required - sellerId not found' 
      });
    }

    // Build query
    const query = { sellerId };
    
    if (shopId) {
      query.shopId = shopId;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const gstBills = await GSTBill.find(query)
      .populate('shopId', 'name address')
      .sort({ invoiceDate: -1 });

    // Calculate stats
    const stats = {
      totalBills: gstBills.length,
      totalAmount: gstBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0),
      totalGST: gstBills.reduce((sum, bill) => sum + (bill.gstAmount || 0), 0),
      netAmount: gstBills.reduce((sum, bill) => sum + (bill.netAmount || 0), 0)
    };

    res.json({
      success: true,
      data: {
        gstBills,
        stats
      }
    });

  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching GST bills'
    });
  }
};

// Get single GST bill
const getGSTBill = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.sellerId;

    const gstBill = await GSTBill.findOne({ 
      _id: id, 
      sellerId 
    }).populate('shopId', 'name address email phone gstin pan stateName stateCode city pincode country street');

    if (!gstBill) {
      return res.status(404).json({
        success: false,
        message: 'GST bill not found'
      });
    }

    // Fallback: if bill doesn't have shop phone/email, copy from populated shopId
    const billObj = gstBill.toObject();
    if ((!billObj.shopPhone || !billObj.shopEmail || !billObj.shopGST || !billObj.shopPAN) && billObj.shopId) {
      billObj.shopPhone = billObj.shopPhone || billObj.shopId.phone || '';
      billObj.shopEmail = billObj.shopEmail || billObj.shopId.email || '';
      billObj.shopGST = billObj.shopGST || billObj.shopId.gstin || '';
      billObj.shopPAN = billObj.shopPAN || billObj.shopId.pan || '';
    }

    res.json({
      success: true,
      data: { gstBill: billObj }
    });

  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching GST bill'
    });
  }
};

// Create GST bill
const createGSTBill = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const billData = { ...req.body, sellerId };

    // Generate invoice number if not provided
    if (!billData.invoiceNumber) {
      const count = await GSTBill.countDocuments({ sellerId });
      billData.invoiceNumber = `GST-${String(count + 1).padStart(6, '0')}`;
    }

    // Get shop details (support both legacy Shop and GSTShop)
    let shop = null;
    try { shop = await Shop.findById(billData.shopId); } catch {}
    if (!shop) {
      try { shop = await GSTShop.findById(billData.shopId); } catch {}
    }
    if (shop) {
      billData.shopName = shop.name || shop.businessName || billData.shopName || '';
      billData.shopAddress = shop.address || `${shop.street || ''}${shop.street ? ', ' : ''}${shop.city || ''}${shop.city ? ', ' : ''}${shop.stateName || ''}${shop.stateName ? ', ' : ''}${shop.country || ''}${shop.pincode ? `, ${shop.pincode}` : ''}`;
      billData.shopGST = shop.gstin || '';
      billData.shopPAN = shop.pan || '';
      billData.shopPhone = shop.phone || '';
      billData.shopEmail = shop.email || '';
      billData.shopStateName = shop.stateName || shop.state || '';
      billData.shopStateCode = shop.stateCode || '';
    }

    const gstBill = new GSTBill(billData);
    await gstBill.save();

    res.status(201).json({
      success: true,
      data: { gstBill },
      message: 'GST bill created successfully'
    });

  } catch (error) {
        // Duplicate invoice number
    if (error && (error.code === 11000 || String(error.message || '').includes('duplicate key'))) {
      return res.status(409).json({ success: false, message: 'Invoice number already exists. Please change the last number.' });
    }
    // Mongoose validation errors
    if (error && error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ success: false, message: 'Error creating GST bill' });
  }
};

// Update GST bill
const updateGSTBill = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.sellerId;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData._id;
    delete updateData.sellerId;
    delete updateData.createdAt;

    const gstBill = await GSTBill.findOneAndUpdate(
      { _id: id, sellerId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).populate('shopId', 'name address');

    if (!gstBill) {
      return res.status(404).json({
        success: false,
        message: 'GST bill not found'
      });
    }

    res.json({
      success: true,
      data: { gstBill },
      message: 'GST bill updated successfully'
    });

  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error updating GST bill'
    });
  }
};

// Delete GST bill
const deleteGSTBill = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.sellerId;

    const gstBill = await GSTBill.findOneAndDelete({ 
      _id: id, 
      sellerId 
    });

    if (!gstBill) {
      return res.status(404).json({
        success: false,
        message: 'GST bill not found'
      });
    }

    res.json({
      success: true,
      message: 'GST bill deleted successfully'
    });

  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error deleting GST bill'
    });
  }
};

// Get GST bills statistics
const getGSTBillsStats = async (req, res) => {
  try {
    const { shopId, startDate, endDate } = req.query;
    const sellerId = req.sellerId;
    
    if (!sellerId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required - sellerId not found' 
      });
    }

    // Build query
    const query = { sellerId };
    
    if (shopId) {
      query.shopId = shopId;
    }

    if (startDate && endDate) {
      query.invoiceDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Aggregate statistics
    const stats = await GSTBill.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalAmount: { $sum: '$grandTotal' },
          totalGST: { $sum: '$gstAmount' },
          netAmount: { $sum: '$netAmount' },
          averageAmount: { $avg: '$grandTotal' },
          averageGST: { $avg: '$gstAmount' }
        }
      }
    ]);

    // Get monthly breakdown
    const monthlyStats = await GSTBill.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$invoiceDate' },
            month: { $month: '$invoiceDate' }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$grandTotal' },
          totalGST: { $sum: '$gstAmount' },
          netAmount: { $sum: '$netAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // Get shop-wise breakdown
    const shopStats = await GSTBill.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$shopId',
          shopName: { $first: '$shopName' },
          count: { $sum: 1 },
          totalAmount: { $sum: '$grandTotal' },
          totalGST: { $sum: '$gstAmount' },
          netAmount: { $sum: '$netAmount' }
        }
      },
      { $sort: { totalAmount: -1 } }
    ]);

    // Get recent bills
    const recentBills = await GSTBill.find(query)
      .sort({ invoiceDate: -1 })
      .limit(5)
      .select('invoiceNumber customerName grandTotal invoiceDate')
      .populate('shopId', 'name');

    const result = stats[0] || {
      totalBills: 0,
      totalAmount: 0,
      totalGST: 0,
      netAmount: 0,
      averageAmount: 0,
      averageGST: 0
    };

    res.json({
      success: true,
      data: {
        overview: {
          totalBills: result.totalBills,
          totalAmount: Math.round((result.totalAmount + Number.EPSILON) * 100) / 100,
          totalGST: Math.round((result.totalGST + Number.EPSILON) * 100) / 100,
          netAmount: Math.round((result.netAmount + Number.EPSILON) * 100) / 100,
          averageAmount: Math.round((result.averageAmount + Number.EPSILON) * 100) / 100,
          averageGST: Math.round((result.averageGST + Number.EPSILON) * 100) / 100
        },
        monthlyBreakdown: monthlyStats,
        shopBreakdown: shopStats,
        recentBills
      }
    });

  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching GST bills statistics'
    });
  }
};

module.exports = {
  getGSTBills,
  getGSTBill,
  createGSTBill,
  updateGSTBill,
  deleteGSTBill,
  getGSTBillsStats
};
