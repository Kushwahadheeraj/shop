const BACKEND = process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://shop-backend-qf50.onrender.com/api';

// Simple in-memory cache with TTL (5 minutes)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(auth, period) {
  return `bill_analytics_${auth.slice(-10)}_${period}`;
}

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Helper to extract seller ID from token
function getSellerIdFromToken(token) {
  try {
    if (!token) {
            return null;
    }
    const tokenStr = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    if (!tokenStr || !tokenStr.includes('.')) {
            return null;
    }
    const parts = tokenStr.split('.');
    if (parts.length < 2) {
            return null;
    }
    // Use Buffer.from() for Node.js (not atob which is browser-only)
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const sellerId = payload.id || payload._id || payload.userId;
        return sellerId || null;
  } catch (error) {
        return null;
  }
}

// Helper to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Default to 'all' to match Bill Management page behavior (shows all bills)
    const period = searchParams.get('period') || 'all';
    const auth = request.headers.get('authorization');
    
    if (!auth) {
      return Response.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check cache
    const cacheKey = getCacheKey(auth, period);
    const cached = getCached(cacheKey);
    if (cached) {
      return Response.json(cached);
    }

    const sellerId = getSellerIdFromToken(auth);
    const params = sellerId ? `?sellerId=${sellerId}` : '';

    
    // Calculate date range - if period is 'all', don't filter by date (match Bill Management page)
    const now = new Date();
    const isAllPeriod = period === 'all' || period === 'All';
    const startDate = isAllPeriod ? new Date(0) : new Date(now.getTime() - (parseInt(period) * 24 * 60 * 60 * 1000));
    const prevStartDate = isAllPeriod ? new Date(0) : new Date(startDate.getTime() - (parseInt(period) * 24 * 60 * 60 * 1000));

    
    // Fetch data from all 6 sources in parallel
    const [
      billsResponse,
      gstBillsResponse,
      simpleBillsResponse,
      invoicesResponse,
      shopsResponse,
      billItemsResponse
    ] = await Promise.allSettled([
      // 1. Bill Management (Regular Bills)
      fetch(`${BACKEND}/bills${params}`, {
        headers: { 'Authorization': auth }
      }),
      // 2. GST Bill Management
      fetch(`${BACKEND}/gst-bills${params}`, {
        headers: { 'Authorization': auth }
      }),
      // 3. Simple Bill Management
      fetch(`${BACKEND}/simple-bills${params}`, {
        headers: { 'Authorization': auth }
      }),
      // 4. Quick Invoice Creator
      fetch(`${BACKEND}/invoices${params}`, {
        headers: { 'Authorization': auth }
      }),
      // 5. Seller List (for seller stats) - Fetch from /seller/list endpoint
      fetch(`${BACKEND}/seller/list`, {
        headers: { 'Authorization': auth }
      }),
      // 6. Bill Items Inventory (from bills and simple-bills) - fetch separately
      Promise.all([
        fetch(`${BACKEND}/bills${params}`, { headers: { 'Authorization': auth } }).then(r => r.ok ? r.json() : []),
        fetch(`${BACKEND}/simple-bills${params}`, { headers: { 'Authorization': auth } }).then(r => r.ok ? r.json() : [])
      ])
    ]);

    // Process responses
    let bills = [];
    let gstBills = [];
    let simpleBills = [];
    let invoices = [];
    let sellers = []; // Changed from shops to sellers
    let allBillItems = [];

    // 1. Process Bill Management (Regular Bills)
    if (billsResponse.status === 'fulfilled' && billsResponse.value.ok) {
      try {
        const billsData = await billsResponse.value.json();
                // Backend returns: { success: true, data: { bills: [...] } }
        bills = Array.isArray(billsData) ? billsData : 
                Array.isArray(billsData?.data?.bills) ? billsData.data.bills :
                Array.isArray(billsData?.data) ? billsData.data : 
                Array.isArray(billsData?.bills) ? billsData.bills : [];
                if (bills.length > 0) {
                  }
      } catch (e) {
              }
    } else if (billsResponse.status === 'fulfilled') {
            try {
        const errorData = await billsResponse.value.text();
              } catch (e) {
              }
    } else {
          }

    // 2. Process GST Bill Management
    if (gstBillsResponse.status === 'fulfilled' && gstBillsResponse.value.ok) {
      try {
        const gstData = await gstBillsResponse.value.json();
                // Backend returns: { success: true, data: { gstBills: [...] } }
        gstBills = Array.isArray(gstData) ? gstData : 
                   Array.isArray(gstData?.data?.gstBills) ? gstData.data.gstBills :
                   Array.isArray(gstData?.data) ? gstData.data : 
                   Array.isArray(gstData?.bills) ? gstData.bills : [];
                if (gstBills.length > 0) {
                  }
      } catch (e) {
              }
    } else if (gstBillsResponse.status === 'fulfilled') {
            try {
        const errorData = await gstBillsResponse.value.text();
              } catch (e) {
              }
    } else {
          }

    // 3. Process Simple Bill Management
    if (simpleBillsResponse.status === 'fulfilled' && simpleBillsResponse.value.ok) {
      try {
        const simpleData = await simpleBillsResponse.value.json();
        // Backend returns: { success: true, data: [...] } or array directly
        simpleBills = Array.isArray(simpleData) ? simpleData : 
                      Array.isArray(simpleData?.data) ? simpleData.data : 
                      Array.isArray(simpleData?.bills) ? simpleData.bills : [];
                if (simpleBills.length > 0) {
                  }
      } catch (e) {
              }
    } else if (simpleBillsResponse.status === 'fulfilled') {
          }

    // 4. Process Quick Invoice Creator
    if (invoicesResponse.status === 'fulfilled' && invoicesResponse.value.ok) {
      try {
        const invoicesData = await invoicesResponse.value.json();
        invoices = Array.isArray(invoicesData) ? invoicesData : 
                   Array.isArray(invoicesData?.data) ? invoicesData.data : 
                   Array.isArray(invoicesData?.invoices) ? invoicesData.invoices : [];
      } catch (e) {
              }
    }

    // 5. Process Seller List (Sellers from /seller/list endpoint)
    if (shopsResponse.status === 'fulfilled' && shopsResponse.value.ok) {
      try {
        const sellersData = await shopsResponse.value.json();
                // Backend returns: { success: true, sellers: [...] }
        sellers = Array.isArray(sellersData) ? sellersData : 
                  Array.isArray(sellersData?.sellers) ? sellersData.sellers :
                  Array.isArray(sellersData?.data) ? sellersData.data : 
                  Array.isArray(sellersData?.users) ? sellersData.users : [];
        // Filter out admin users (same as User Management page)
        sellers = sellers.filter(seller => seller.role !== 'admin');
                if (sellers.length > 0) {
          const activeSellers = sellers.filter(s => s.status === 'active').length;
                  }
      } catch (e) {
              }
    } else if (shopsResponse.status === 'fulfilled') {
            try {
        const errorData = await shopsResponse.value.text();
              } catch (e) {
              }
    } else {
          }

    // 6. Process Bill Items Inventory
    if (billItemsResponse.status === 'fulfilled') {
      try {
        const [billsData, simpleBillsData] = billItemsResponse.value;
        const billsForItems = Array.isArray(billsData) ? billsData : 
                              Array.isArray(billsData?.data) ? billsData.data : 
                              Array.isArray(billsData?.bills) ? billsData.bills : [];
        const simpleBillsForItems = Array.isArray(simpleBillsData) ? simpleBillsData : 
                                    Array.isArray(simpleBillsData?.data) ? simpleBillsData.data : 
                                    Array.isArray(simpleBillsData?.bills) ? simpleBillsData.bills : [];
        
        // Extract items from all bills
        [...billsForItems, ...simpleBillsForItems].forEach(bill => {
          if (Array.isArray(bill.items)) {
            bill.items.forEach(item => {
              allBillItems.push({
                ...item,
                billId: bill._id || bill.id,
                billNumber: bill.billNumber || bill.billNo,
                billDate: bill.billDate || bill.createdAt || bill.date,
                billType: bill.gstNumber ? 'gst' : 'simple'
              });
            });
          }
        });
      } catch (e) {
              }
    }

    // Filter bills by date range - if period is 'all', don't filter
    const filterByDate = (bill) => {
      if (isAllPeriod) return true; // Include all bills if period is 'all'
      const billDate = new Date(bill.billDate || bill.createdAt || bill.date || bill.invoiceDate || 0);
      return billDate >= startDate && billDate <= now;
    };

    const filteredBills = bills.filter(filterByDate);
    const filteredGstBills = gstBills.filter(filterByDate);
    const filteredSimpleBills = simpleBills.filter(filterByDate);
    const filteredInvoices = invoices.filter(filterByDate);
    const filteredBillItems = allBillItems.filter(item => {
      if (isAllPeriod) return true; // Include all items if period is 'all'
      const itemDate = new Date(item.billDate || 0);
      return itemDate >= startDate && itemDate <= now;
    });

    // Previous period for comparison - skip if period is 'all'
    const prevFilterByDate = (bill) => {
      if (isAllPeriod) return false; // Don't calculate previous period if showing all data
      const billDate = new Date(bill.billDate || bill.createdAt || bill.date || bill.invoiceDate || 0);
      return billDate >= prevStartDate && billDate < startDate;
    };

    const prevFilteredBills = isAllPeriod ? [] : bills.filter(prevFilterByDate);
    const prevFilteredGstBills = isAllPeriod ? [] : gstBills.filter(prevFilterByDate);
    const prevFilteredSimpleBills = isAllPeriod ? [] : simpleBills.filter(prevFilterByDate);
    const prevFilteredInvoices = isAllPeriod ? [] : invoices.filter(prevFilterByDate);

    // Calculate totals - Use same logic as Bill Management page
    // Bill Management checks: bill.totalAmount ?? bill.pricing?.totalAmount
    const num = (v) => Number(v ?? 0);
    
    const calculateTotal = (billsList, field = 'totalAmount') => {
      return billsList.reduce((sum, bill) => {
        // Match Bill Management page logic: bill.totalAmount ?? bill.pricing?.totalAmount
        let amount = 0;
        if (field === 'totalAmount') {
          amount = bill.totalAmount ?? bill.pricing?.totalAmount ?? bill.grandTotal ?? bill.total ?? bill.amount ?? 0;
        } else if (field === 'grandTotal') {
          amount = bill.grandTotal ?? bill.totalAmount ?? bill.pricing?.totalAmount ?? bill.total ?? bill.amount ?? 0;
        } else {
          amount = bill[field] ?? bill.pricing?.totalAmount ?? bill.grandTotal ?? bill.total ?? bill.amount ?? 0;
        }
        // Fallback: calculate from items if no amount found
        if (!amount && bill.items && Array.isArray(bill.items)) {
          amount = bill.items.reduce((itemSum, item) => 
            itemSum + (item.totalPrice || item.total || (item.quantity || 0) * (item.unitPrice || item.price || 0) || 0), 0);
        }
        return sum + num(amount);
      }, 0);
    };

    // Calculate paid and remaining amounts - Use same logic as Bill Management page
    // Bill Management checks: bill.paidAmount ?? bill.payment?.paidAmount
    const calculatePaidAmount = (billsList) => {
      return billsList.reduce((sum, bill) => {
        // Match Bill Management page logic: bill.paidAmount ?? bill.payment?.paidAmount
        const paid = bill.paidAmount ?? bill.payment?.paidAmount ?? 0;
        // Fallback: sum payment history if available
        if (!paid && bill.paymentHistory && Array.isArray(bill.paymentHistory)) {
          const historySum = bill.paymentHistory.reduce((pSum, p) => pSum + num(p.amount), 0);
          return sum + historySum;
        }
        return sum + num(paid);
      }, 0);
    };

    const calculateRemainingAmount = (billsList) => {
      return billsList.reduce((sum, bill) => {
        // Match Bill Management page logic: bill.totalAmount ?? bill.pricing?.totalAmount
        const total = num(bill.totalAmount ?? bill.pricing?.totalAmount ?? 0);
        // Match Bill Management page logic: bill.paidAmount ?? bill.payment?.paidAmount
        const paid = num(bill.paidAmount ?? bill.payment?.paidAmount ?? 0);
        const remaining = Math.max(0, total - paid);
        return sum + remaining;
      }, 0);
    };

    // Current period totals - Summary should only include Bill Management + Simple Bill Management
    // (Not GST Bills and Invoices, as they don't have paid/remaining tracking)
    // Use EXACT same calculation as Bill Management page
    // Note: 'num' is already declared above, reusing it
    
    // Bill Management calculation (EXACT match with Bill Management page)
    const billManagementTotal = filteredBills.reduce((sum, bill) => {
      return sum + num(bill.totalAmount ?? bill.pricing?.totalAmount);
    }, 0);
    const billManagementPaid = filteredBills.reduce((sum, bill) => {
      return sum + num(bill.paidAmount ?? bill.payment?.paidAmount);
    }, 0);
    const billManagementRemaining = Math.max(0, billManagementTotal - billManagementPaid);
    
    // Simple Bill Management calculation (EXACT match with Simple Bill Management page)
    const simpleBillManagementTotal = filteredSimpleBills.reduce((sum, bill) => {
      return sum + num(bill.totalAmount ?? bill.pricing?.totalAmount);
    }, 0);
    const simpleBillManagementPaid = filteredSimpleBills.reduce((sum, bill) => {
      return sum + num(bill.paidAmount ?? bill.payment?.paidAmount);
    }, 0);
    const simpleBillManagementRemaining = Math.max(0, simpleBillManagementTotal - simpleBillManagementPaid);
    
    const totalBills = filteredBills.length + filteredSimpleBills.length; // Only Bill Management + Simple Bill Management
    const totalAmount = billManagementTotal + simpleBillManagementTotal; // Only Bill Management + Simple Bill Management
    const paidAmount = billManagementPaid + simpleBillManagementPaid;
    const remainingAmount = billManagementRemaining + simpleBillManagementRemaining;
    
    // Debug logging
    const gstBillManagementTotal = calculateTotal(filteredGstBills, 'grandTotal');
    
    // Previous period totals - Only Bill Management + Simple Bill Management for comparison
    const prevTotalBills = prevFilteredBills.length + prevFilteredSimpleBills.length;
    const prevTotalAmount = calculateTotal(prevFilteredBills, 'totalAmount') + 
                           calculateTotal(prevFilteredSimpleBills, 'totalAmount');

    // Calculate growth percentages
    const billsGrowth = prevTotalBills > 0 ? ((totalBills - prevTotalBills) / prevTotalBills * 100).toFixed(1) : 0;
    const amountGrowth = prevTotalAmount > 0 ? ((totalAmount - prevTotalAmount) / prevTotalAmount * 100).toFixed(1) : 0;

    // Calculate by bill type
    const gstBillsCount = filteredGstBills.length;
    const gstBillsAmount = calculateTotal(filteredGstBills, 'grandTotal');
    const simpleBillsCount = filteredSimpleBills.length;
    const simpleBillsAmount = calculateTotal(filteredSimpleBills, 'totalAmount');
    const regularBillsCount = filteredBills.length;
    const regularBillsAmount = calculateTotal(filteredBills, 'totalAmount');
    const invoicesCount = filteredInvoices.length;
    const invoicesAmount = calculateTotal(filteredInvoices, 'totalAmount');

    // Calculate monthly data for charts
    const monthlyData = {};
    [...filteredBills, ...filteredSimpleBills].forEach(bill => {
      const billDate = new Date(bill.billDate || bill.createdAt || bill.date || bill.invoiceDate || Date.now());
      const monthKey = billDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const amount = bill.pricing?.totalAmount || bill.totalAmount || bill.grandTotal || bill.total || bill.amount || 0;
      const paid = bill.payment?.paidAmount || bill.paidAmount || 0;
      const remaining = Math.max(0, (typeof amount === 'number' ? amount : parseFloat(amount) || 0) - (typeof paid === 'number' ? paid : parseFloat(paid) || 0));
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { bills: 0, amount: 0, paidAmount: 0, remainingAmount: 0 };
      }
      monthlyData[monthKey].bills += 1;
      monthlyData[monthKey].amount += (typeof amount === 'number' ? amount : parseFloat(amount) || 0);
      monthlyData[monthKey].paidAmount += (typeof paid === 'number' ? paid : parseFloat(paid) || 0);
      monthlyData[monthKey].remainingAmount += remaining;
    });

    // Add other bills (GST, Invoices) to monthly data
    [...filteredGstBills, ...filteredInvoices].forEach(bill => {
      const billDate = new Date(bill.billDate || bill.createdAt || bill.date || bill.invoiceDate || Date.now());
      const monthKey = billDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const amount = bill.grandTotal || bill.totalAmount || bill.total || bill.amount || 0;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { bills: 0, amount: 0, paidAmount: 0, remainingAmount: 0 };
      }
      monthlyData[monthKey].bills += 1;
      monthlyData[monthKey].amount += (typeof amount === 'number' ? amount : parseFloat(amount) || 0);
    });

    // Convert to array format for charts
    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, data]) => ({ 
        month, 
        bills: data.bills, 
        amount: data.amount,
        paidAmount: data.paidAmount,
        remainingAmount: data.remainingAmount
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Calculate bill type distribution for pie chart
    const billTypeDistribution = [
      { name: 'GST Bills', value: gstBillsCount, amount: gstBillsAmount },
      { name: 'Simple Bills', value: simpleBillsCount, amount: simpleBillsAmount },
      { name: 'Regular Bills', value: regularBillsCount, amount: regularBillsAmount },
      { name: 'Invoices', value: invoicesCount, amount: invoicesAmount }
    ].filter(item => item.value > 0);

    // Calculate top items from bill items inventory
    const itemCounts = {};
    filteredBillItems.forEach(item => {
      const itemName = item.name || item.itemName || item.productName || 'Unknown';
      if (!itemCounts[itemName]) {
        itemCounts[itemName] = { name: itemName, quantity: 0, totalValue: 0, category: item.category || 'Uncategorized' };
      }
      itemCounts[itemName].quantity += (item.quantity || item.qty || 0);
      itemCounts[itemName].totalValue += (item.totalPrice || item.total || (item.quantity || 0) * (item.unitPrice || item.price || 0) || 0);
    });

    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Calculate category distribution
    const categoryCounts = {};
    filteredBillItems.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryCounts[category]) {
        categoryCounts[category] = { name: category, count: 0, value: 0 };
      }
      categoryCounts[category].count += 1;
      categoryCounts[category].value += (item.totalPrice || item.total || 0);
    });

    const categoryDistribution = Object.values(categoryCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // Calculate daily data for area chart
    const dailyData = {};
    [...filteredBills, ...filteredGstBills, ...filteredSimpleBills, ...filteredInvoices].forEach(bill => {
      const billDate = new Date(bill.billDate || bill.createdAt || bill.date || bill.invoiceDate || Date.now());
      const dayKey = billDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const amount = bill.totalAmount || bill.grandTotal || bill.total || bill.amount || 0;
      
      if (!dailyData[dayKey]) {
        dailyData[dayKey] = { bills: 0, amount: 0 };
      }
      dailyData[dayKey].bills += 1;
      dailyData[dayKey].amount += (typeof amount === 'number' ? amount : parseFloat(amount) || 0);
    });

    const dailyChartData = Object.entries(dailyData)
      .map(([day, data]) => ({ day, bills: data.bills, amount: data.amount }))
      .sort((a, b) => new Date(a.day) - new Date(b.day));

    // Prepare response
    const analyticsData = {
      success: true,
      period: parseInt(period),
      summary: {
        totalBills,
        totalAmount,
        paidAmount,
        remainingAmount,
        billsGrowth: parseFloat(billsGrowth),
        amountGrowth: parseFloat(amountGrowth),
        averageBillValue: totalBills > 0 ? totalAmount / totalBills : 0
      },
      byType: {
        gstBills: { count: gstBillsCount, amount: gstBillsAmount },
        simpleBills: { count: simpleBillsCount, amount: simpleBillsAmount },
        regularBills: { count: regularBillsCount, amount: regularBillsAmount },
        invoices: { count: invoicesCount, amount: invoicesAmount }
      },
      charts: {
        monthly: monthlyChartData,
        daily: dailyChartData,
        billTypeDistribution,
        topItems,
        categoryDistribution
      },
      sources: {
        billManagement: { 
          count: filteredBills.length, 
          amount: billManagementTotal,
          paidAmount: billManagementPaid,
          remainingAmount: billManagementRemaining
        },
        gstBillManagement: { count: filteredGstBills.length, amount: calculateTotal(filteredGstBills, 'grandTotal') },
        simpleBillManagement: { 
          count: filteredSimpleBills.length, 
          amount: simpleBillManagementTotal,
          paidAmount: simpleBillManagementPaid,
          remainingAmount: simpleBillManagementRemaining
        },
        quickInvoiceCreator: { count: filteredInvoices.length, amount: calculateTotal(filteredInvoices, 'totalAmount') },
        billItemsInventory: { count: filteredBillItems.length, totalItems: filteredBillItems.reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0) },
        sellerList: { 
          count: sellers.length,
          activeCount: sellers.filter(s => s.status === 'active').length
        }
      }
    };

    // Cache the result
    setCached(cacheKey, analyticsData);

    
    return Response.json(analyticsData);
  } catch (error) {
        return Response.json(
      { 
        success: false, 
        message: 'Error fetching bill analytics', 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

