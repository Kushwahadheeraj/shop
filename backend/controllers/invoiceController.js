const Invoice = require('../models/Invoice');

const sanitizeItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item?.name)
    .map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        name: item.name,
        quantity,
        unit: item.unit || 'pc',
        unitPrice,
        amount: item.amount ? Number(item.amount) : quantity * unitPrice,
      };
    });

const calculateTotals = (items, pricing = {}) => {
  const subtotal =
    pricing.subtotal !== undefined
      ? Number(pricing.subtotal)
      : items.reduce((sum, item) => sum + item.amount, 0);

  const discount = pricing.discount !== undefined ? Number(pricing.discount) : 0;
  const totalAmount =
    pricing.totalAmount !== undefined ? Number(pricing.totalAmount) : subtotal - discount;

  return {
    subtotal: Math.max(0, subtotal),
    discount: Math.max(0, discount),
    totalAmount: Math.max(0, totalAmount),
  };
};

const normalizePayment = (payment = {}, totalAmount = 0) => {
  const paidAmount = payment.paidAmount !== undefined ? Number(payment.paidAmount) : 0;
  const remainingAmount =
    payment.remainingAmount !== undefined
      ? Number(payment.remainingAmount)
      : Math.max(totalAmount - paidAmount, 0);

  const status =
    payment.status ||
    (paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'pending');

  return {
    paidAmount: Math.max(0, paidAmount),
    remainingAmount: Math.max(0, remainingAmount),
    status,
  };
};

// Create invoice
const createInvoice = async (req, res) => {
  try {
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const items = sanitizeItems(req.body.items);
    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required',
      });
    }

    if (!req.body.shopName || !req.body.shopAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shop name and address are required',
      });
    }

    if (!req.body.customerName) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required',
      });
    }

    const totals = calculateTotals(items, req.body.pricing);
    const payment = normalizePayment(req.body.payment, totals.totalAmount);

    const invoice = new Invoice({
      invoiceNumber: req.body.invoiceNumber,
      templateId: req.body.templateId || 'default',
      shopName: req.body.shopName,
      shopAddress: req.body.shopAddress,
      shopPhone: req.body.shopPhone || '',
      shopEmail: req.body.shopEmail || '',
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress || '',
      customerPhone: req.body.customerPhone || '',
      customerEmail: req.body.customerEmail || '',
      invoiceDate: req.body.billDate || req.body.invoiceDate || new Date(),
      dueDate: req.body.dueDate || null,
      notes: req.body.notes || '',
      items,
      pricing: totals,
      payment,
      createdBy: req.sellerId,
    });

    await invoice.save();

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice,
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message,
    });
  }
};

// Get invoices (history)
const getInvoices = async (req, res) => {
  try {
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const limit = Math.min(Number(req.query.limit) || 25, 100);

    const invoices = await Invoice.find({ createdBy: req.sellerId })
      .sort({ createdAt: req.query.sort === 'asc' ? 1 : -1 })
      .limit(limit);

    res.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message,
    });
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.sellerId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message,
    });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.sellerId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    const items = sanitizeItems(req.body.items);
    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required',
      });
    }

    const totals = calculateTotals(items, req.body.pricing);
    const payment = normalizePayment(req.body.payment, totals.totalAmount);

    invoice.templateId = req.body.templateId || invoice.templateId;
    if (req.body.businessProfileId) {
      invoice.businessProfileId = req.body.businessProfileId;
    }
    invoice.shopName = req.body.shopName || invoice.shopName;
    invoice.shopAddress = req.body.shopAddress || invoice.shopAddress;
    invoice.shopPhone = req.body.shopPhone || invoice.shopPhone;
    invoice.shopEmail = req.body.shopEmail || invoice.shopEmail;
    invoice.customerName = req.body.customerName || invoice.customerName;
    invoice.customerAddress = req.body.customerAddress || invoice.customerAddress;
    invoice.customerPhone = req.body.customerPhone || invoice.customerPhone;
    invoice.customerEmail = req.body.customerEmail || invoice.customerEmail;
    invoice.invoiceDate = req.body.billDate || req.body.invoiceDate || invoice.invoiceDate;
    invoice.dueDate = req.body.dueDate || invoice.dueDate;
    invoice.notes = req.body.notes !== undefined ? req.body.notes : invoice.notes;
    invoice.items = items;
    invoice.pricing = totals;
    invoice.payment = payment;

    await invoice.save();

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice,
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error updating invoice',
      error: error.message,
    });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  try {
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.sellerId,
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found',
      });
    }

    await Invoice.deleteOne({ _id: invoice._id });

    res.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error deleting invoice',
      error: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
};


