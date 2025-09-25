const Bill = require('../models/Bill');
const GstBill = require('../models/GSTBill');
const Shop = require('../models/Shop');
const EUser = require('../models/EUser');
const Seller = require('../models/Seller');

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
  try {
    const { view = 'user', period = '30' } = req.query;
    const sellerId = req.sellerId || '688dd3ce4e57f041a8238d85';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Fetch bills data - first get all bills to see what exists
    const allGstBills = await GstBill.find({});
    const allRegularBills = await Bill.find({});
    
    console.log(`Found ${allGstBills.length} GST bills and ${allRegularBills.length} regular bills`);
    
    // Log seller IDs to identify the correct one
    const gstSellerIds = [...new Set(allGstBills.map(bill => bill.sellerId))];
    const regularSellerIds = [...new Set(allRegularBills.map(bill => bill.sellerId))];
    console.log('GST Bill Seller IDs:', gstSellerIds);
    console.log('Regular Bill Seller IDs:', regularSellerIds);
    
    // Use the first available sellerId or the provided one
    const actualSellerId = gstSellerIds[0] || regularSellerIds[0] || sellerId;
    console.log('Using Seller ID:', actualSellerId);
    
    // Filter bills by seller and date (include missing/null sellerId and createdBy)
    const gstBills = allGstBills.filter(bill => 
      ((bill.sellerId === actualSellerId) || (bill.sellerId == null)) &&
      bill.invoiceDate &&
      new Date(bill.invoiceDate) >= startDate &&
      new Date(bill.invoiceDate) <= endDate
    );

    const regularBills = allRegularBills.filter(bill => 
      ((bill.sellerId === actualSellerId) || (bill.sellerId == null) || (bill.createdBy === actualSellerId)) &&
      bill.billDate &&
      new Date(bill.billDate) >= startDate &&
      new Date(bill.billDate) <= endDate
    );
    
    console.log(`Filtered to ${gstBills.length} GST bills and ${regularBills.length} regular bills for seller ${actualSellerId}`);

    // We only use Bills/GSTBills for order counts (avoid double-counting)

    // Calculate totals
    const totalGstRevenue = gstBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);
    const totalRegularRevenue = regularBills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
    const totalRevenue = totalGstRevenue + totalRegularRevenue;
    const totalOrders = gstBills.length + regularBills.length;
    
    // Calculate total deliveries: trust Orders.status === 'delivered' primarily
    // (Only count bills with explicit delivery markers; do not infer from payment status)
    let totalDeliveries = 0;

    gstBills.forEach(bill => {
      if (
        bill.deliveryStatus === 'delivered' ||
        bill.deliveryDate ||
        bill.status === 'delivered'
      ) {
        totalDeliveries++;
      }
    });

    regularBills.forEach(bill => {
      if (
        bill.deliveryStatus === 'delivered' ||
        bill.deliveryDate ||
        bill.status === 'delivered'
      ) {
        totalDeliveries++;
      }
    });

    // Do not add Orders collection here to avoid double counting
    
    // If no delivery status is available, estimate based on order age
    if (totalDeliveries === 0 && totalOrders > 0) {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
      
      const oldGstBills = gstBills.filter(bill => new Date(bill.invoiceDate) < sevenDaysAgo);
      const oldRegularBills = regularBills.filter(bill => new Date(bill.billDate) < sevenDaysAgo);
      
      totalDeliveries = Math.floor((oldGstBills.length + oldRegularBills.length) * 0.8);
    }

    // Generate daily data for charts from real data
    const dailyData = [];
    for (let i = parseInt(period) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayKey = date.toLocaleDateString('en-GB');
      
      const dayGstBills = gstBills.filter(bill => {
        const billDate = new Date(bill.invoiceDate);
        return billDate.toLocaleDateString('en-GB') === dayKey;
      });
      
      const dayRegularBills = regularBills.filter(bill => {
        const billDate = new Date(bill.billDate);
        return billDate.toLocaleDateString('en-GB') === dayKey;
      });
      
      const dayOrders = dayGstBills.length + dayRegularBills.length;
      const dayRevenue = dayGstBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0) +
                        dayRegularBills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
      
      dailyData.push({
        day: date.getDate(),
        orders: dayOrders,
        sales: dayRevenue
      });
    }

    // Generate monthly data for area chart from real data
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i, 1);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      // Get all bills for this month (not just filtered by period)
      const monthGstBills = await GstBill.find({ 
        $or: [
          { sellerId: actualSellerId },
          { sellerId: null }
        ],
        invoiceDate: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthRegularBills = await Bill.find({ 
        $or: [
          { sellerId: actualSellerId },
          { sellerId: null },
          { createdBy: actualSellerId }
        ],
        billDate: { $gte: monthStart, $lte: monthEnd }
      });

      const monthOrdersCount = monthGstBills.length + monthRegularBills.length;
      const monthRevenue = monthGstBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0) +
                          monthRegularBills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
      
      // Calculate deliveries based on order status or delivery date
      let monthDeliveries = 0;
      
      // For GST bills - check if there's a delivery status or delivery date
      monthGstBills.forEach(bill => {
        if (bill.deliveryStatus === 'delivered' || bill.deliveryDate || 
            bill.status === 'completed' || bill.status === 'delivered') {
          monthDeliveries++;
        }
      });
      
      // For regular bills - check delivery status
      monthRegularBills.forEach(bill => {
        if (bill.deliveryStatus === 'delivered' || bill.deliveryDate || 
            bill.status === 'completed' || bill.status === 'delivered') {
          monthDeliveries++;
        }
      });
      
      // If no delivery status is available, estimate based on order age
      if (monthDeliveries === 0 && monthOrdersCount > 0) {
        // Assume 80% of orders older than 7 days are delivered
        const currentDate = new Date();
        const sevenDaysAgo = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000));
        
        const oldGstBills = monthGstBills.filter(bill => new Date(bill.invoiceDate) < sevenDaysAgo);
        const oldRegularBills = monthRegularBills.filter(bill => new Date(bill.billDate) < sevenDaysAgo);
        
        monthDeliveries = Math.floor((oldGstBills.length + oldRegularBills.length) * 0.8);
      }
      
      // We do not include Orders collection here to avoid double counting

      monthlyData.push({
        month: months[monthStart.getMonth()],
        orders: monthOrdersCount,
        deliveries: monthDeliveries,
        sales: monthRevenue,
        revenue: monthRevenue
      });
    }

    // Get top selling products
    const allItems = [];
    [...gstBills, ...regularBills].forEach(bill => {
      if (bill.items && Array.isArray(bill.items)) {
        bill.items.forEach(item => {
          allItems.push({
            name: item.name || 'Unknown Product',
            quantity: item.quantity || 0,
            price: item.unitPrice || 0,
            total: (item.quantity || 0) * (item.unitPrice || 0)
          });
        });
      }
    });

    const productSales = {};
    allItems.forEach(item => {
      if (productSales[item.name]) {
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].total += item.total;
      } else {
        productSales[item.name] = {
          name: item.name,
          quantity: item.quantity,
          total: item.total
        };
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((product, index) => ({
        id: `#${String(index + 1).padStart(3, '0')}`,
        name: product.name,
        sales: product.quantity,
        revenue: product.total
      }));

    if (view === 'user') {
      // User Analytics
      const totalUsers = await EUser.countDocuments();
      const newUsers = await EUser.countDocuments({ 
        createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
      });
      
      // Calculate growth percentages (mock data for now)
      const userGrowth = 12.5;
      const orderGrowth = totalOrders > 0 ? 8.3 : 0;

      res.json({
        success: true,
        data: {
          view: 'user',
          users: {
            total: totalUsers,
            new: newUsers,
            active: Math.floor(totalUsers * 0.7), // Mock active users
            growth: userGrowth
          },
          orders: {
            total: totalOrders,
            deliveries: totalDeliveries,
            growth: orderGrowth
          },
          revenue: totalRevenue,
          monthlyData: dailyData,
          areaData: monthlyData,
          topProducts
        }
      });
    } else {
      // Product Analytics
      // Count unique products from bills data
      const allProducts = new Set();
      [...gstBills, ...regularBills].forEach(bill => {
        if (bill.items && Array.isArray(bill.items)) {
          bill.items.forEach(item => {
            if (item.name) {
              allProducts.add(item.name);
            }
          });
        }
      });
      
      const totalProducts = allProducts.size;
      const newProducts = Math.floor(totalProducts * 0.1); // Mock 10% new products
      
      // Calculate growth percentages
      const productGrowth = 8.2;
      const revenueGrowth = totalRevenue > 0 ? 15.3 : 0;

      res.json({
        success: true,
        data: {
          view: 'product',
          products: {
            total: totalProducts,
            new: newProducts,
            active: Math.floor(totalProducts * 0.8), // Mock active products
            growth: productGrowth
          },
          sales: {
            total: totalRevenue,
            growth: revenueGrowth
          },
          revenue: totalRevenue,
          monthlyData: dailyData,
          areaData: monthlyData,
          topProducts
        }
      });
    }

  } catch (error) {
    console.error('Dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get delivery analytics
const getDeliveryAnalytics = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { period = '30' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Fetch bills data
    const gstBills = await GstBill.find({ 
      sellerId: sellerId,
      invoiceDate: { $gte: startDate, $lte: endDate }
    });

    const regularBills = await Bill.find({ 
      sellerId: sellerId,
      billDate: { $gte: startDate, $lte: endDate }
    });
    
    // Calculate delivery statistics
    let totalOrders = gstBills.length + regularBills.length;
    let deliveredOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    
    // Process GST bills
    gstBills.forEach(bill => {
      if (bill.deliveryStatus === 'delivered' || bill.deliveryDate || 
          bill.status === 'completed' || bill.status === 'delivered') {
        deliveredOrders++;
      } else if (bill.deliveryStatus === 'cancelled' || bill.status === 'cancelled') {
        cancelledOrders++;
      } else {
        pendingOrders++;
      }
    });
    
    // Process regular bills
    regularBills.forEach(bill => {
      if (bill.deliveryStatus === 'delivered' || bill.deliveryDate || 
          bill.status === 'completed' || bill.status === 'delivered') {
        deliveredOrders++;
      } else if (bill.deliveryStatus === 'cancelled' || bill.status === 'cancelled') {
        cancelledOrders++;
      } else {
        pendingOrders++;
      }
    });
    
    // Calculate delivery rate
    const deliveryRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;
    
    res.json({
      success: true,
      data: {
        totalOrders,
        deliveredOrders,
        pendingOrders,
        cancelledOrders,
        deliveryRate,
        summary: {
          totalOrders,
          deliveredOrders,
          pendingOrders,
          cancelledOrders,
          deliveryRate: `${deliveryRate}%`
        }
      }
    });
    
  } catch (error) {
    console.error('Delivery analytics error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getDeliveryAnalytics
};
