const SimpleBill = require('../models/SimpleBill');
const Shop = require('../models/Shop');

// Create a new simple bill
const createSimpleBill = async (req, res) => {
  try {
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
      return res.status(400).json({
        success: false,
        message: 'Shop ID, items, and pricing are required'
      });
    }

    if (!req.sellerId) {
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
    const billCount = await SimpleBill.countDocuments();
    const billNumber = `SIMPLE-${String(billCount + 1).padStart(6, '0')}`;

    // Calculate totals if not provided
    const calculatedPricing = {
      subtotal: pricing.subtotal || items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      discount: pricing.discount || 0,
      extraCharge: pricing.extraCharge || 0,
      totalAmount: 0
    };

    // Total = subtotal - discount (NO GST)
    calculatedPricing.totalAmount = calculatedPricing.subtotal - calculatedPricing.discount;

    // Calculate item totals
    const itemsWithTotals = items.map(item => ({
      ...item,
      totalPrice: item.quantity * item.unitPrice
    }));

    const validPaymentMethods = ['cash', 'card', 'upi', 'bank_transfer', 'cheque'];
    const validPaymentStatuses = ['pending', 'paid', 'partial', 'overdue'];

    const numericPaidAmount =
      typeof payment?.paidAmount === 'number'
        ? payment.paidAmount
        : parseFloat(payment?.paidAmount) || 0;

    const sanitizedPaidAmount = Math.max(0, numericPaidAmount);
    const paymentMethod = validPaymentMethods.includes(payment?.method)
      ? payment.method
      : 'cash';
    const paymentStatus = validPaymentStatuses.includes(payment?.status)
      ? payment.status
      : sanitizedPaidAmount >= calculatedPricing.totalAmount
      ? 'paid'
      : sanitizedPaidAmount > 0
      ? 'partial'
      : 'pending';

    const billData = {
      billNumber,
      shopId,
      shopName: shop.name,
      shopAddress: shop.address,
      items: itemsWithTotals,
      pricing: calculatedPricing,
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        paidAmount: sanitizedPaidAmount,
        remainingAmount: Math.max(calculatedPricing.totalAmount - sanitizedPaidAmount, 0)
      },
      billDate: billDate ? new Date(billDate) : new Date(),
      dueDate: dueDate ? new Date(dueDate) : null,
      description,
      notes,
      recurring: recurring || { isRecurring: false },
      createdBy: req.sellerId
    };

    const bill = new SimpleBill(billData);
    await bill.save();

    // Update shop's last transaction date
    await Shop.findByIdAndUpdate(shopId, { lastTransactionDate: new Date() });

    res.status(201).json({
      success: true,
      message: 'Simple bill created successfully',
      data: bill
    });
  } catch (error) {
    console.error('Error creating simple bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating simple bill',
      error: error.message
    });
  }
};

// Get all simple bills with filtering and pagination
const getSimpleBills = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
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

    const bills = await SimpleBill.find(filter)
      .populate('shopId', 'name address contact')
      .sort({ billDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SimpleBill.countDocuments(filter);

    res.json({
      success: true,
      data: bills,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching simple bills:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching simple bills',
      error: error.message
    });
  }
};

// Get simple bill by ID
const getSimpleBillById = async (req, res) => {
  try {
    const bill = await SimpleBill.findById(req.params.id)
      .populate('shopId', 'name address contact business')
      .populate('createdBy', 'username email');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Simple bill not found'
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Error fetching simple bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching simple bill',
      error: error.message
    });
  }
};

// Update simple bill
const updateSimpleBill = async (req, res) => {
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

    const bill = await SimpleBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Simple bill not found'
      });
    }

    // Recalculate totals if items or pricing changed
    if (items || pricing) {
      const calculatedPricing = {
        subtotal: pricing?.subtotal || items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || bill.pricing.subtotal,
        discount: pricing?.discount || bill.pricing.discount,
        totalAmount: 0
      };

      // Total = subtotal - discount (NO GST)
      calculatedPricing.totalAmount = calculatedPricing.subtotal - calculatedPricing.discount;

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
    if (payment) {
      bill.payment = { ...bill.payment, ...payment };

      // Sanitize payment method and status if provided
      const validPaymentMethods = ['cash', 'card', 'upi', 'bank_transfer', 'cheque'];
      const validPaymentStatuses = ['pending', 'paid', 'partial', 'overdue'];

      if (!validPaymentMethods.includes(bill.payment.method)) {
        bill.payment.method = 'cash';
      }

      if (!validPaymentStatuses.includes(bill.payment.status)) {
        bill.payment.status = 'pending';
      }
    }
    if (billDate) bill.billDate = new Date(billDate);
    if (dueDate) bill.dueDate = new Date(dueDate);
    if (description !== undefined) bill.description = description;
    if (notes !== undefined) bill.notes = notes;
    if (status) bill.status = status;
    if (recurring) bill.recurring = { ...bill.recurring, ...recurring };

    // Recalculate remaining amount
    const numericPaidAmount =
      typeof bill.payment.paidAmount === 'number'
        ? bill.payment.paidAmount
        : parseFloat(bill.payment.paidAmount) || 0;
    bill.payment.paidAmount = Math.max(0, numericPaidAmount);
    bill.payment.remainingAmount = Math.max(bill.pricing.totalAmount - bill.payment.paidAmount, 0);

    if (bill.payment.paidAmount >= bill.pricing.totalAmount) {
      bill.payment.status = 'paid';
    } else if (bill.payment.paidAmount > 0 && bill.payment.status === 'pending') {
      bill.payment.status = 'partial';
    } else if (bill.payment.paidAmount === 0) {
      bill.payment.status = 'pending';
    }

    await bill.save();

    res.json({
      success: true,
      message: 'Simple bill updated successfully',
      data: bill
    });
  } catch (error) {
    console.error('Error updating simple bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating simple bill',
      error: error.message
    });
  }
};

// Delete simple bill
const deleteSimpleBill = async (req, res) => {
  try {
    const bill = await SimpleBill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Simple bill not found'
      });
    }

    await SimpleBill.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Simple bill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting simple bill:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting simple bill',
      error: error.message
    });
  }
};

// Get simple bill statistics
const getSimpleBillStats = async (req, res) => {
  try {
    const { shopId, startDate, endDate } = req.query;
    
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const filter = { createdBy: req.sellerId };
    if (shopId) filter.shopId = shopId;
    if (startDate || endDate) {
      filter.billDate = {};
      if (startDate) filter.billDate.$gte = new Date(startDate);
      if (endDate) filter.billDate.$lte = new Date(endDate);
    }

    const stats = await SimpleBill.aggregate([
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

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalBills: 0,
          totalAmount: 0,
          paidAmount: 0,
          remainingAmount: 0,
          averageBillAmount: 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching simple bill stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching simple bill statistics',
      error: error.message
    });
  }
};

// Add payment to simple bill
const addPayment = async (req, res) => {
  try {
    const { amount, method, paymentDate, notes, customerName, billId, transactionId } = req.body;
    const simpleBillId = req.params.id;

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
    const bill = await SimpleBill.findById(simpleBillId);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Simple bill not found'
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
      customerName: customerName || '',
      billId: billId || '',
      transactionId: transactionId || '',
      addedAt: new Date()
    });

    await bill.save();

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
  createSimpleBill,
  getSimpleBills,
  getSimpleBillById,
  updateSimpleBill,
  deleteSimpleBill,
  getSimpleBillStats,
  addPayment
};
