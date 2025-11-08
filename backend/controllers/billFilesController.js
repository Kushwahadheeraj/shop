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
    console.error('Error creating bill files:', error);
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
    const { shopId, billType } = req.query;

    if (!sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const query = { sellerId };
    if (shopId) query.shopId = shopId;
    if (billType) query.billType = billType;

    const files = await BillFile.find(query)
      .populate('shopId', 'name address')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error fetching bill files:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching files',
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
    console.error('Error deleting bill file:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

