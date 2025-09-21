const Shop = require('../models/Shop');

// Create a new shop
const createShop = async (req, res) => {
  try {
    console.log('🔍 Creating shop with sellerId:', req.sellerId);
    console.log('🔍 Shop data received:', req.body);
    
    const {
      name,
      address,
      contact,
      location,
      business,
      financial,
      notes
    } = req.body;

    // Validate required fields
    if (!name || !address) {
      console.log('❌ Missing required fields:', { name, address });
      return res.status(400).json({
        success: false,
        message: 'Shop name and address are required'
      });
    }

    if (!req.sellerId) {
      console.log('❌ No sellerId found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const shopData = {
      name,
      address,
      contact: contact || {},
      location: location || {},
      business: business || {},
      financial: financial || {},
      notes,
      createdBy: req.sellerId
    };

    const shop = new Shop(shopData);
    await shop.save();

    res.status(201).json({
      success: true,
      message: 'Shop created successfully',
      data: shop
    });
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shop',
      error: error.message
    });
  }
};

// Get all shops with filtering and pagination
const getShops = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      city,
      state
    } = req.query;

    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const filter = { createdBy: req.sellerId };

    if (status) filter.status = status;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (state) filter['location.state'] = { $regex: state, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { 'contact.phone': { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } },
        { 'business.gstNumber': { $regex: search, $options: 'i' } }
      ];
    }

    const shops = await Shop.find(filter)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Shop.countDocuments(filter);

    res.json({
      success: true,
      data: {
        shops,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shops',
      error: error.message
    });
  }
};

// Get shop by ID
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    res.json({
      success: true,
      data: shop
    });
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shop',
      error: error.message
    });
  }
};

// Update shop
const updateShop = async (req, res) => {
  try {
    const {
      name,
      address,
      contact,
      location,
      business,
      financial,
      status,
      notes
    } = req.body;

    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Update fields
    if (name) shop.name = name;
    if (address) shop.address = address;
    if (contact) shop.contact = { ...shop.contact, ...contact };
    if (location) shop.location = { ...shop.location, ...location };
    if (business) shop.business = { ...shop.business, ...business };
    if (financial) shop.financial = { ...shop.financial, ...financial };
    if (status) shop.status = status;
    if (notes !== undefined) shop.notes = notes;

    await shop.save();

    res.json({
      success: true,
      message: 'Shop updated successfully',
      data: shop
    });
  } catch (error) {
    console.error('Error updating shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shop',
      error: error.message
    });
  }
};

// Delete shop
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }

    // Check if shop has any bills
    const Bill = require('../models/Bill');
    const billCount = await Bill.countDocuments({ shopId: req.params.id });
    
    if (billCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete shop with existing bills. Please delete all bills first.'
      });
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Shop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting shop:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting shop',
      error: error.message
    });
  }
};

// Get shop statistics
const getShopStats = async (req, res) => {
  try {
    if (!req.sellerId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const totalShops = await Shop.countDocuments({ createdBy: req.sellerId });
    const activeShops = await Shop.countDocuments({ 
      createdBy: req.sellerId, 
      status: 'active' 
    });
    const inactiveShops = await Shop.countDocuments({ 
      createdBy: req.sellerId, 
      status: 'inactive' 
    });

    // Get shops with recent transactions
    const recentShops = await Shop.find({ 
      createdBy: req.sellerId,
      lastTransactionDate: { $exists: true }
    })
    .sort({ lastTransactionDate: -1 })
    .limit(5)
    .select('name lastTransactionDate');

    res.json({
      success: true,
      data: {
        totalShops,
        activeShops,
        inactiveShops,
        recentShops
      }
    });
  } catch (error) {
    console.error('Error fetching shop stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shop statistics',
      error: error.message
    });
  }
};

module.exports = {
  createShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  getShopStats
};
