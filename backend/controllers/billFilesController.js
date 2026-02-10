const BillFile = require('../models/BillFile');

// Create bill files
exports.createBillFiles = async (req, res) => {
  try {
    const { sellerId } = req;
    const { files } = req.body;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Files array is required'
      });
    }

    // Validate each file
    for (const file of files) {
      if (!file.shopId) {
        return res.status(400).json({
          success: false,
          message: 'shopId is required for all files'
        });
      }
      if (!file.billType || !['gst', 'bill'].includes(file.billType)) {
        return res.status(400).json({
          success: false,
          message: 'billType must be either "gst" or "bill"'
        });
      }
      if (!file.fileName || !file.fileUrl) {
        return res.status(400).json({
          success: false,
          message: 'fileName and fileUrl are required for all files'
        });
      }
    }

    const billFiles = files.map(file => ({
      sellerId,
      shopId: file.shopId,
      billType: file.billType,
      fileName: file.fileName,
      fileUrl: file.fileUrl,
      fileType: file.fileType || 'application/pdf',
      uploadedAt: file.uploadedAt || new Date()
    }));

    const savedFiles = await BillFile.insertMany(billFiles);

    res.status(201).json({
      success: true,
      message: 'Files saved successfully',
      data: savedFiles
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error saving files',
      error: error.message
    });
  }
};

// Get bill files
exports.getBillFiles = async (req, res) => {
  try {
    const { sellerId } = req;
    const { shopId, billType, startDate, endDate } = req.query;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const query = { sellerId };
    if (shopId) query.shopId = shopId;
    if (billType) query.billType = billType;
    
    // Date filtering
    if (startDate || endDate) {
      query.uploadedAt = {};
      if (startDate) {
        query.uploadedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.uploadedAt.$lte = end;
      }
    }

    const files = await BillFile.find(query)
      .populate('shopId', 'name address')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching files',
      error: error.message
    });
  }
};

// Get bill files summary/statistics
exports.getBillFilesSummary = async (req, res) => {
  try {
    const { sellerId } = req;
    const { shopId, startDate, endDate } = req.query;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const query = { sellerId };
    if (shopId) query.shopId = shopId;
    
    // Date filtering
    if (startDate || endDate) {
      query.uploadedAt = {};
      if (startDate) {
        query.uploadedAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.uploadedAt.$lte = end;
      }
    }

    // Get all files
    const files = await BillFile.find(query)
      .populate('shopId', 'name address')
      .sort({ uploadedAt: -1 });

    // Group by shop
    const groupedByShop = {};
    files.forEach(file => {
      const shopId = file.shopId._id.toString();
      if (!groupedByShop[shopId]) {
        groupedByShop[shopId] = {
          shop: file.shopId,
          gst: [],
          bill: [],
          total: 0
        };
      }
      groupedByShop[shopId][file.billType].push(file);
      groupedByShop[shopId].total++;
    });

    // Calculate statistics
    const stats = {
      total: files.length,
      gstCount: files.filter(f => f.billType === 'gst').length,
      billCount: files.filter(f => f.billType === 'bill').length,
      groupedByShop: Object.values(groupedByShop)
    };

    res.json({
      success: true,
      data: files,
      summary: stats
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error fetching files summary',
      error: error.message
    });
  }
};

// Delete bill file
exports.deleteBillFile = async (req, res) => {
  try {
    const { sellerId } = req;
    const { id } = req.params;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const file = await BillFile.findOne({ _id: id, sellerId });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    await BillFile.deleteOne({ _id: id });
    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
        res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

