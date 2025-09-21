const Bill = require('../models/Bill');
const Shop = require('../models/Shop');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/bills';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'bill-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents are allowed'));
    }
  }
});

// Create a new bill
const createBill = async (req, res) => {
  try {
    console.log('🔍 Creating bill with sellerId:', req.sellerId);
    console.log('🔍 Bill data received:', req.body);
    
    const {
      shopId,
      items,
      pricing,
      payment,
      billDate,
      dueDate,
      description,
      notes,
      recurring
    } = req.body;

    // Validate required fields
    if (!shopId || !items || !pricing) {
      console.log('❌ Missing required fields:', { shopId, items, pricing });
      return res.status(400).json({
        success: false,
        message: 'Shop ID, items, and pricing are required'
      });
    }

    if (!req.sellerId) {
      console.log('❌ No sellerId found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Get shop details
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Generate unique bill number
    const billCount = await Bill.countDocuments();
    const billNumber = `BILL-${String(billCount + 1).padStart(6, '0')}`;
    console.log('🔍 Generated bill number:', billNumber);

    // Calculate totals if not provided
    const calculatedPricing = {
      subtotal: pricing.subtotal || items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      gstRate: pricing.gstRate || 18,
      gstAmount: 0,
      totalAmount: 0,
      discount: pricing.discount || 0
    };

    calculatedPricing.gstAmount = (calculatedPricing.subtotal * calculatedPricing.gstRate) / 100;
    calculatedPricing.totalAmount = calculatedPricing.subtotal + calculatedPricing.gstAmount - calculatedPricing.discount;

    // Calculate item totals
    const itemsWithTotals = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));

    const billData = {
      billNumber,
      shopId,
      shopName: shop.name,
      shopAddress: shop.address,
      items: itemsWithTotals,
      pricing: calculatedPricing,
      payment: {
        method: payment?.method || 'cash',
        status: payment?.status || 'pending',
        paidAmount: payment?.paidAmount || 0,
        remainingAmount: calculatedPricing.totalAmount - (payment?.paidAmount || 0)
      },
      billDate: billDate ? new Date(billDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      description,
      notes,
      recurring: recurring || { isRecurring: false },
      createdBy: req.sellerId
    };

    const bill = new Bill(billData);
    await bill.save();

    // Update shop's last transaction date
    await Shop.findByIdAndUpdate(shopId, { lastTransactionDate: new Date() });

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      data: bill
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bill',
      error: error.message
    });
  }
};

// Get all bills with filtering and pagination
const getBills = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      shopId,
      status,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const filter = { createdBy: req.sellerId };

    if (shopId) filter.shopId = shopId;
    if (status) filter.status = status;
    if (paymentStatus) filter['payment.status'] = paymentStatus;
    if (startDate || endDate) {
      filter.billDate = {};
      if (startDate) filter.billDate.$gte = new Date(startDate);
      if (endDate) filter.billDate.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { billNumber: { $regex: search, $options: 'i' } },
        { shopName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const bills = await Bill.find(filter)
      .populate('shopId', 'name address contact')
      .sort({ billDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bill.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bills,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bills',
      error: error.message
    });
  }
};

// Get bill by ID
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('shopId', 'name address contact business')
      .populate('createdBy', 'username email');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill',
      error: error.message
    });
  }
};

// Update bill
const updateBill = async (req, res) => {
  try {
    const {
      items,
      pricing,
      payment,
      billDate,
      dueDate,
      description,
      notes,
      status,
      recurring
    } = req.body;

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Recalculate totals if items or pricing changed
    if (items || pricing) {
      const calculatedPricing = {
        subtotal: pricing?.subtotal || items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || bill.pricing.subtotal,
        gstRate: pricing?.gstRate || bill.pricing.gstRate,
        gstAmount: 0,
        totalAmount: 0,
        discount: pricing?.discount || bill.pricing.discount
      };

      calculatedPricing.gstAmount = (calculatedPricing.subtotal * calculatedPricing.gstRate) / 100;
      calculatedPricing.totalAmount = calculatedPricing.subtotal + calculatedPricing.gstAmount - calculatedPricing.discount;

      if (items) {
        const itemsWithTotals = items.map(item => ({
          ...item,
          totalPrice: item.quantity * item.unitPrice
        }));
        bill.items = itemsWithTotals;
      }

      bill.pricing = calculatedPricing;
    }

    // Update other fields
    if (payment) bill.payment = { ...bill.payment, ...payment };
    if (billDate) bill.billDate = new Date(billDate);
    if (dueDate) bill.dueDate = new Date(dueDate);
    if (description !== undefined) bill.description = description;
    if (notes !== undefined) bill.notes = notes;
    if (status) bill.status = status;
    if (recurring) bill.recurring = { ...bill.recurring, ...recurring };

    // Recalculate remaining amount
    bill.payment.remainingAmount = bill.pricing.totalAmount - bill.payment.paidAmount;

    await bill.save();

    res.json({
      success: true,
      message: 'Bill updated successfully',
      data: bill
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bill',
      error: error.message
    });
  }
};

// Delete bill
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Delete associated files
    if (bill.attachments && bill.attachments.length > 0) {
      bill.attachments.forEach(attachment => {
        const filePath = path.join(__dirname, '..', '..', attachment.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    await Bill.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bill',
      error: error.message
    });
  }
};

// Upload bill attachment
const uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    const attachment = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `uploads/bills/${req.file.filename}`
    };

    bill.attachments.push(attachment);
    await bill.save();

    res.json({
      success: true,
      message: 'Attachment uploaded successfully',
      data: attachment
    });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading attachment',
      error: error.message
    });
  }
};

// Get bill statistics
const getBillStats = async (req, res) => {
  try {
    const { shopId, startDate, endDate } = req.query;
    
    console.log('🔍 Stats request - shopId:', shopId, 'startDate:', startDate, 'endDate:', endDate);
    console.log('🔍 Stats request - sellerId:', req.sellerId);
    
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const filter = { createdBy: req.sellerId };
    if (shopId) {
      filter.shopId = shopId;
      console.log('🔍 Filtering by shopId:', shopId);
    } else {
      console.log('🔍 No shopId provided - showing all shops');
    }
    if (startDate || endDate) {
      filter.billDate = {};
      if (startDate) filter.billDate.$gte = new Date(startDate);
      if (endDate) filter.billDate.$lte = new Date(endDate);
    }
    
    console.log('🔍 Final filter:', JSON.stringify(filter, null, 2));

    const stats = await Bill.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalAmount: { $sum: '$pricing.totalAmount' },
          paidAmount: { $sum: '$payment.paidAmount' },
          remainingAmount: { $sum: '$payment.remainingAmount' },
          averageBillAmount: { $avg: '$pricing.totalAmount' }
        }
      }
    ]);

    const statusStats = await Bill.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const paymentStats = await Bill.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$payment.status',
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      success: true,
      data: {
        overview: stats[0] || {
          totalBills: 0,
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          averageBillAmount: 0
        },
        statusBreakdown: statusStats,
        paymentBreakdown: paymentStats
      }
    };

    console.log('🔍 Stats result:', JSON.stringify(result, null, 2));
    res.json(result);
  } catch (error) {
    console.error('Error fetching bill stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill statistics',
      error: error.message
    });
  }
};

// Add payment to bill
const addPayment = async (req, res) => {
  try {
    const { amount, method, paymentDate, notes } = req.body;
    const billId = req.params.id;

    console.log('🔍 Adding payment to bill:', billId);
    console.log('🔍 Payment data:', { amount, method, paymentDate, notes });

    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }

    if (!method) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Find the bill
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    // Check if user owns this bill
    if (bill.createdBy.toString() !== req.sellerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate new paid amount
    const currentPaidAmount = bill.payment.paidAmount || 0;
    const newPaidAmount = currentPaidAmount + amount;
    const totalAmount = bill.pricing.totalAmount;

    // Check if payment exceeds total amount
    if (newPaidAmount > totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount cannot exceed remaining balance of ₹${totalAmount - currentPaidAmount}`
      });
    }

    // Update payment information
    bill.payment.paidAmount = newPaidAmount;
    bill.payment.remainingAmount = totalAmount - newPaidAmount;
    
    // Update payment status based on amount
    if (newPaidAmount >= totalAmount) {
      bill.payment.status = 'paid';
      bill.status = 'paid';
    } else if (newPaidAmount > 0) {
      bill.payment.status = 'partial';
    }

    // Add payment history
    if (!bill.paymentHistory) {
      bill.paymentHistory = [];
    }

    bill.paymentHistory.push({
      amount,
      method,
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      notes: notes || '',
      addedAt: new Date()
    });

    await bill.save();

    console.log('✅ Payment added successfully');

    res.json({
      success: true,
      message: 'Payment added successfully',
      data: {
        billId: bill._id,
        newPaidAmount,
        remainingAmount: bill.payment.remainingAmount,
        paymentStatus: bill.payment.status,
        billStatus: bill.status
      }
    });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding payment',
      error: error.message
    });
  }
};

module.exports = {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill,
  uploadAttachment,
  getBillStats,
  addPayment,
  upload
};
