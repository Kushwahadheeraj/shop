const BACKEND = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30'; // days
    
    // Fetch GST bills data
    const gstBillsRes = await fetch(`${BACKEND}/api/gst-bills`, { 
      headers: { 'Authorization': auth } 
    });
    const gstBillsData = await gstBillsRes.json();
    
    // Fetch regular bills data
    const billsRes = await fetch(`${BACKEND}/api/bills`, { 
      headers: { 'Authorization': auth } 
    });
    const billsData = await billsRes.json();
    
    const gstBills = gstBillsData.success ? gstBillsData.data : [];
    const bills = billsData.success ? billsData.data : [];
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Filter data by period
    const filteredGstBills = gstBills.filter(bill => {
      const billDate = new Date(bill.invoiceDate);
      return billDate >= startDate && billDate <= endDate;
    });
    
    const filteredBills = bills.filter(bill => {
      const billDate = new Date(bill.billDate);
      return billDate >= startDate && billDate <= endDate;
    });
    
    // Calculate total sales (GST + Regular bills)
    const totalGstSales = filteredGstBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);
    const totalRegularSales = filteredBills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
    const totalSales = totalGstSales + totalRegularSales;
    
    // Calculate total orders
    const totalOrders = filteredGstBills.length + filteredBills.length;
    
    // Calculate total revenue (net amount)
    const totalGstRevenue = filteredGstBills.reduce((sum, bill) => sum + (bill.netAmount || 0), 0);
    const totalRegularRevenue = filteredBills.reduce((sum, bill) => sum + (bill.pricing?.totalAmount || 0), 0);
    const totalRevenue = totalGstRevenue + totalRegularRevenue;
    
    // Calculate growth percentages (mock data for now)
    const salesGrowth = 10.6; // This would be calculated from previous period
    const ordersGrowth = -3.5;
    const revenueGrowth = 12.0;
    
    // Get top selling products from all bills
    const allItems = [];
    
    // From GST bills
    filteredGstBills.forEach(bill => {
      if (bill.items && Array.isArray(bill.items)) {
        bill.items.forEach(item => {
          allItems.push({
            name: item.name || 'Unknown Product',
            quantity: item.quantity || 0,
            price: item.unitPrice || 0,
            total: (item.quantity || 0) * (item.unitPrice || 0),
            category: item.category || 'General'
          });
        });
      }
    });
    
    // From regular bills
    filteredBills.forEach(bill => {
      if (bill.items && Array.isArray(bill.items)) {
        bill.items.forEach(item => {
          allItems.push({
            name: item.name || 'Unknown Product',
            quantity: item.quantity || 0,
            price: item.unitPrice || 0,
            total: (item.quantity || 0) * (item.unitPrice || 0),
            category: item.category || 'General'
          });
        });
      }
    });
    
    // Calculate product sales
    const productSales = {};
    allItems.forEach(item => {
      if (productSales[item.name]) {
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].total += item.total;
      } else {
        productSales[item.name] = {
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          category: item.category
        };
      }
    });
    
    // Sort by total sales and get top 5
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((product, index) => ({
        id: `#${String(index + 1).padStart(4, '0')}`,
        name: product.name,
        sales: product.quantity,
        price: product.price,
        earning: product.total
      }));
    
    // Calculate category distribution
    const categorySales = {};
    allItems.forEach(item => {
      if (categorySales[item.category]) {
        categorySales[item.category] += item.total;
      } else {
        categorySales[item.category] = item.total;
      }
    });
    
    const topCategories = Object.entries(categorySales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
    
    // Generate orders trend data (mock data for now)
    const ordersTrend = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      ordersTrend.push({
        date: date.toISOString().split('T')[0],
        online: Math.floor(Math.random() * 100) + 50,
        offline: Math.floor(Math.random() * 50) + 25
      });
    }
    
    // Generate hourly orders data (mock data for now)
    const hourlyOrders = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
    
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 7; hour++) {
        hourlyOrders.push({
          day: days[day],
          hour: hours[hour],
          orders: Math.floor(Math.random() * 50) + 10
        });
      }
    }
    
    const stats = {
      totalSales: totalSales,
      totalOrders: totalOrders,
      totalRevenue: totalRevenue,
      salesGrowth: salesGrowth,
      ordersGrowth: ordersGrowth,
      revenueGrowth: revenueGrowth,
      topProducts: topProducts,
      topCategories: topCategories,
      ordersTrend: ordersTrend,
      hourlyOrders: hourlyOrders
    };
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: stats 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
    
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
