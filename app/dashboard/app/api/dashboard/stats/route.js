const BACKEND = process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://shop-backend-qf50.onrender.com/api';

// Simple in-memory cache with TTL (5 minutes)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(auth, period) {
  return `dashboard_stats_${auth.slice(-10)}_${period}`;
}

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
  // Clean old cache entries (keep max 50)
  if (cache.size > 50) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization') || '';
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '30';
    
    // Extract sellerId from token for shop-specific filtering
    let sellerId = null;
    try {
      const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;
      if (token) {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        sellerId = payload.id || payload._id || payload.userId;
      }
    } catch (e) {
      // If token parsing fails, continue without sellerId filter
    }
    
    // Check cache first
    const cacheKey = getCacheKey(auth, period);
    const cached = getCached(cacheKey);
    if (cached) {
      return new Response(JSON.stringify({ 
        success: true, 
        data: cached 
      }), { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        } 
      });
    }
    
    // Calculate date range
    const endDate = new Date();
    // Handle 'all' period - use a very old date to include all data
    const periodDays = period === 'all' ? 3650 : parseInt(period) || 30; // 10 years for 'all', default to 30 days
    const startDate = new Date(endDate.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    
    // OPTIMIZED: Parallel API calls for all data sources
    // For products, we'll try multiple approaches to get accurate count
    const [ordersRes, couponsRes, productsRes, productsCountRes, usersRes, gstBillsRes, billsRes] = await Promise.all([
      fetch(`${BACKEND}/orders?limit=1000`, { 
        headers: { 'Authorization': auth },
        next: { revalidate: 60 }
      }).catch(() => ({ ok: false, json: async () => ({ success: false, data: [] }) })),
      fetch(`${BACKEND}/coupons`, { 
        headers: { 'Authorization': auth },
        next: { revalidate: 60 }
      }).catch(() => ({ ok: false, json: async () => ({ success: false, data: [] }) })),
      // Use backend /products endpoint (returns array, but limited to 100 in controller)
      // For total count, we use what we get - backend limits to 100 for performance
      fetch(`${BACKEND}/products`, { 
        headers: { 
          'Authorization': auth,
          'Content-Type': 'application/json'
        },
        cache: 'no-store',
        next: { revalidate: 60 }
      }).catch((err) => {
        console.error('Error fetching products from backend:', err);
        return { ok: false, json: async () => [] };
      }),
      // Try to get products count from category-count endpoint if available
      fetch(`${BACKEND}/category-count`, { 
        headers: { 
          'Authorization': auth,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }).catch(() => ({ ok: false, json: async () => ({}) })),
      fetch(`${BACKEND}/euser/list`, { 
        headers: { 'Authorization': auth },
        next: { revalidate: 60 }
      }).catch(() => ({ ok: false, json: async () => ({ users: [] }) })),
      fetch(`${BACKEND}/gst-bills`, { 
        headers: { 'Authorization': auth },
        next: { revalidate: 60 }
      }).catch(() => ({ ok: false, json: async () => ({ success: false, data: [] }) })),
      fetch(`${BACKEND}/bills`, { 
        headers: { 'Authorization': auth },
        next: { revalidate: 60 }
      }).catch(() => ({ ok: false, json: async () => ({ success: false, data: [] }) }))
    ]);
    
    const [ordersData, couponsData, productsData, categoryCountData, usersData, gstBillsData, billsData] = await Promise.all([
      ordersRes.ok ? ordersRes.json().catch(() => ({ success: false, data: [] })) : { success: false, data: [] },
      couponsRes.ok ? couponsRes.json().catch(() => ({ success: false, data: [] })) : { success: false, data: [] },
      productsRes.ok ? productsRes.json().catch((err) => {
        console.error('Error parsing products JSON:', err);
        return [];
      }) : (() => {
        console.warn('Products API response not OK. Status:', productsRes.status || 'unknown', 'URL:', `${BACKEND}/products`);
        return [];
      })(),
      productsCountRes.ok ? productsCountRes.json().catch(() => ({})) : {},
      usersRes.ok ? usersRes.json().catch(() => ({ users: [] })) : { users: [] },
      gstBillsRes.ok ? gstBillsRes.json().catch(() => ({ success: false, data: [] })) : { success: false, data: [] },
      billsRes.ok ? billsRes.json().catch(() => ({ success: false, data: [] })) : { success: false, data: [] }
    ]);
    
    // Parse data - handle different response formats
    // Orders: { success: true, data: [...] } or { data: [...] }
    let orders = [];
    if (ordersData.success && Array.isArray(ordersData.data)) {
      orders = ordersData.data;
    } else if (Array.isArray(ordersData.data)) {
      orders = ordersData.data;
    } else if (Array.isArray(ordersData)) {
      orders = ordersData;
    }
    
    // Coupons: { success: true, data: [...] } or { data: [...] }
    let coupons = [];
    if (couponsData.success && Array.isArray(couponsData.data)) {
      coupons = couponsData.data;
    } else if (Array.isArray(couponsData.data)) {
      coupons = couponsData.data;
    } else if (Array.isArray(couponsData)) {
      coupons = couponsData;
    }
    
    // Products: Backend returns direct array from /api/products endpoint
    // The getAllProducts controller returns: res.status(200).json(limitedProducts)
    // So it's a direct array, not wrapped in an object
    let products = [];
    
    // Log for debugging
    console.log('=== PRODUCTS API DEBUG ===');
    console.log('Products API Response Status:', productsRes.ok);
    console.log('Products API Status Code:', productsRes.status);
    console.log('Products Data Type:', typeof productsData);
    console.log('Products Data Is Array:', Array.isArray(productsData));
    console.log('Products Data:', productsData ? (Array.isArray(productsData) ? `Array with ${productsData.length} items` : JSON.stringify(productsData).substring(0, 200)) : 'null/undefined');
    
    // Backend returns direct array: res.status(200).json(limitedProducts)
    if (Array.isArray(productsData)) {
      products = productsData;
      console.log('✅ Products parsed from direct array. Count:', products.length);
    } else if (productsData && typeof productsData === 'object') {
      // Try nested formats
      if (Array.isArray(productsData.products)) {
        products = productsData.products;
        console.log('✅ Products parsed from productsData.products. Count:', products.length);
      } else if (Array.isArray(productsData.data)) {
        products = productsData.data;
        console.log('✅ Products parsed from productsData.data. Count:', products.length);
      } else {
        // Try to find any array in the object
        const possibleArrays = Object.values(productsData).filter(v => Array.isArray(v));
        if (possibleArrays.length > 0) {
          products = possibleArrays[0];
          console.log('✅ Products parsed from object values. Count:', products.length);
        } else {
          console.warn('⚠️ No array found in productsData object');
        }
      }
    }
    
    // Ensure we have a valid products array for counting
    if (!Array.isArray(products)) {
      console.error('❌ Products is not an array! Setting to empty array.');
      console.error('productsData:', productsData);
      products = [];
    }
    
    console.log('📊 Final Products Count:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', {
        name: products[0].name || 'No name',
        category: products[0].category || 'No category',
        _id: products[0]._id || 'No ID'
      });
    }
    console.log('========================');
    
    // Users: { users: [...] } or { data: [...] }
    let users = [];
    if (Array.isArray(usersData.users)) {
      users = usersData.users;
    } else if (Array.isArray(usersData.data)) {
      users = usersData.data;
    } else if (Array.isArray(usersData)) {
      users = usersData;
    }
    
    // GST Bills: { success: true, data: [...] }
    let gstBills = [];
    if (gstBillsData.success && Array.isArray(gstBillsData.data)) {
      gstBills = gstBillsData.data;
    } else if (Array.isArray(gstBillsData.data)) {
      gstBills = gstBillsData.data;
    } else if (Array.isArray(gstBillsData)) {
      gstBills = gstBillsData;
    }
    
    // Bills: { success: true, data: [...] }
    let bills = [];
    if (billsData.success && Array.isArray(billsData.data)) {
      bills = billsData.data;
    } else if (Array.isArray(billsData.data)) {
      bills = billsData.data;
    } else if (Array.isArray(billsData)) {
      bills = billsData;
    }
    
    // Filter data by period
    const filteredOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      try {
        const orderTime = new Date(order.createdAt).getTime();
        if (isNaN(orderTime)) return false;
        return orderTime >= startTime && orderTime <= endTime;
      } catch {
        return false;
      }
    });
    
    const filteredProducts = Array.isArray(products) ? products.filter(product => {
      if (!product.createdAt && !product.created_at) return true; // Include if no date
      try {
        const productTime = new Date(product.createdAt || product.created_at).getTime();
        if (isNaN(productTime)) return true;
        return productTime >= startTime && productTime <= endTime;
      } catch {
        return true;
      }
    }) : [];
    
    const filteredUsers = users.filter(user => {
      if (!user.createdAt && !user.created_at) return false;
      try {
        const userTime = new Date(user.createdAt || user.created_at).getTime();
        if (isNaN(userTime)) return false;
        return userTime >= startTime && userTime <= endTime;
      } catch {
        return false;
      }
    });
    
    // 1. Total Users (all users, not filtered by period)
    const totalUsers = users.length;
    
    // 2. New Users (in period)
    const newUsers = filteredUsers.length;
    
    // 3. Total Orders (ALL orders, not just filtered by period - for accurate count)
    const totalOrders = orders.length;
    
    // 4. Total Deliveries (ALL delivered orders, not just filtered by period)
    const totalDeliveries = orders.filter(order => 
      order.status === 'delivered' || 
      (order.tracking && Array.isArray(order.tracking) && order.tracking.some(t => t.status === 'delivered'))
    ).length;
    
    // 5. Active Users (users who have placed orders - check ALL orders, not just filtered)
    const userOrderMap = new Map();
    orders.forEach(order => {
      const userId = order.userId?._id || order.userId?.id || order.userId || order.userId?.toString();
      if (userId) {
        userOrderMap.set(userId.toString(), true);
      }
    });
    const activeUsers = userOrderMap.size;
    
    // 6. Top Selling Products (from ALL orders and bills, not just filtered)
    const productSalesMap = new Map();
    
    // Count from ALL orders
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productName = item.name || item.productName || 'Unknown';
          const quantity = item.quantity || 0;
          if (productSalesMap.has(productName)) {
            productSalesMap.set(productName, productSalesMap.get(productName) + quantity);
          } else {
            productSalesMap.set(productName, quantity);
          }
        });
      }
    });
    
    // Count from ALL bills
    [...gstBills, ...bills].forEach(bill => {
      if (bill.items && Array.isArray(bill.items)) {
        bill.items.forEach(item => {
          const productName = item.name || 'Unknown';
          const quantity = item.quantity || 0;
          if (productSalesMap.has(productName)) {
            productSalesMap.set(productName, productSalesMap.get(productName) + quantity);
          } else {
            productSalesMap.set(productName, quantity);
          }
        });
      }
    });
    
    const topSellingProducts = Array.from(productSalesMap.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    // 7. Latest Products Added (from Product Add)
    // Show all products, sorted by createdAt if available, otherwise show all
    let latestProducts = [];
    if (Array.isArray(products) && products.length > 0) {
      console.log('📦 Processing latest products. Total products:', products.length);
      
      // Map products with proper date handling
      const productsWithDates = products.map((p, index) => {
        // Try multiple date field names
        const dateField = p.createdAt || p.created_at || p.created || p.timestamp;
        let dateValue = null;
        
        if (dateField) {
          try {
            dateValue = new Date(dateField).getTime();
            if (isNaN(dateValue)) {
              dateValue = null;
            }
          } catch (e) {
            dateValue = null;
          }
        }
        
        // Use _id timestamp as fallback (MongoDB ObjectId contains timestamp)
        if (!dateValue && p._id) {
          try {
            // Extract timestamp from MongoDB ObjectId (first 8 characters are timestamp)
            const objectIdStr = p._id.toString();
            if (objectIdStr.length === 24) {
              const timestamp = parseInt(objectIdStr.substring(0, 8), 16) * 1000;
              dateValue = timestamp;
            }
          } catch (e) {
            // If that fails, use reverse index (newer products first)
            dateValue = Date.now() - (products.length - index) * 1000;
          }
        }
        
        // Final fallback: use reverse index
        if (!dateValue) {
          dateValue = Date.now() - (products.length - index) * 1000;
        }
        
        return {
          ...p,
          sortKey: dateValue,
          originalIndex: index
        };
      });
      
      // Sort by date (newest first)
      productsWithDates.sort((a, b) => b.sortKey - a.sortKey);
      
      // Take top 10 and format
      latestProducts = productsWithDates.slice(0, 10).map(p => ({
        name: p.name || p.title || 'Unknown Product',
        createdAt: p.createdAt || p.created_at || p.created || (p._id ? new Date(p.sortKey).toISOString() : new Date().toISOString()),
        category: p.category || 'Uncategorized'
      }));
      
      console.log('✅ Latest products processed:', latestProducts.length);
      if (latestProducts.length > 0) {
        console.log('Sample latest product:', {
          name: latestProducts[0].name,
          category: latestProducts[0].category,
          createdAt: latestProducts[0].createdAt
        });
      }
    } else {
      console.log('⚠️ No products found or products is not an array');
      console.log('Products type:', typeof products, 'Is array:', Array.isArray(products), 'Length:', products?.length);
    }
    
    // 8. Total Products Added and Sold
    // Count ALL products from Product Add (not filtered by period)
    // Use category-count endpoint to get accurate total count from all categories
    let totalProductsAdded = 0;
    
    // Try to get total count from category-count endpoint (sum of all categories)
    // Response format: { ok: true, data: { adhesives: 10, brush: 5, ... } }
    if (categoryCountData && categoryCountData.ok === true && categoryCountData.data) {
      const categoryCounts = categoryCountData.data;
      if (typeof categoryCounts === 'object' && !Array.isArray(categoryCounts)) {
        // Sum all category counts to get total products
        totalProductsAdded = Object.values(categoryCounts).reduce((sum, count) => {
          const numCount = typeof count === 'number' ? count : (typeof count === 'string' ? parseInt(count) || 0 : 0);
          return sum + numCount;
        }, 0);
        console.log('✅ Total products count from category-count:', totalProductsAdded);
        console.log('Category breakdown:', categoryCounts);
      }
    }
    
    // Fallback to products array length if category-count didn't work
    if (totalProductsAdded === 0 && Array.isArray(products) && products.length > 0) {
      totalProductsAdded = products.length;
      console.log('⚠️ Using products array length (may be limited to 100):', totalProductsAdded);
    }
    
    const totalProductsSold = productSalesMap.size; // Unique products sold
    
    // Debug logging
    console.log('=== PRODUCTS COUNT DEBUG ===');
    console.log('Products array length:', products.length);
    console.log('Category count data:', categoryCountData);
    console.log('Total Products Added:', totalProductsAdded);
    if (products.length > 0) {
      console.log('Sample products:', products.slice(0, 3).map(p => ({ 
        name: p.name || p.title || 'No name', 
        category: p.category || 'No category' 
      })));
    }
    console.log('===========================');
    
    // 9. Sales Growth
    const prevStartDate = new Date(startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const prevOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      try {
        const orderTime = new Date(order.createdAt).getTime();
        if (isNaN(orderTime)) return false;
        return orderTime >= prevStartDate.getTime() && orderTime < startTime;
      } catch {
        return false;
      }
    });
    
    const currentSales = filteredOrders.reduce((sum, order) => 
      sum + (order.totals?.grandTotal || 0), 0
    );
    const prevSales = prevOrders.reduce((sum, order) => 
      sum + (order.totals?.grandTotal || 0), 0
    );
    
    const salesGrowth = prevSales > 0 
      ? ((currentSales - prevSales) / prevSales * 100).toFixed(1)
      : currentSales > 0 ? 100 : 0;
    
    // 10. Coupon Stats - 3 Data Points
    // 1. Active Coupons Count (coupons where active === true)
    const activeCoupons = coupons.filter(coupon => coupon.active === true || coupon.active === undefined).length;
    
    // 2. Total Usage Limit (kitna log use kar sakte hain)
    // If usageLimit is 0, it means unlimited, so we count it separately
    const totalUsageLimit = coupons.reduce((sum, coupon) => {
      const limit = coupon.usageLimit || 0;
      if (limit === 0) {
        // Unlimited coupon - count as a very large number or handle separately
        return sum; // Don't add to limit, handle unlimited separately
      }
      return sum + limit;
    }, 0);
    
    // Count unlimited coupons
    const unlimitedCoupons = coupons.filter(coupon => {
      const limit = coupon.usageLimit || 0;
      return limit === 0 && (coupon.active === true || coupon.active === undefined);
    }).length;
    
    // 3. Total Used Count (kitna log use kar chuke hain)
    const totalUsedCount = coupons.reduce((sum, coupon) => sum + (coupon.usageCount || 0), 0);
    
    // For display: Show total limit with unlimited indicator
    const totalCoupons = coupons.length;
    const usedCoupons = totalUsedCount;
    const remainingCoupons = unlimitedCoupons > 0 
      ? 'Unlimited' 
      : Math.max(0, totalUsageLimit - totalUsedCount);
    
    // Generate chart data
    // Daily orders chart
    // For 'all' period, use last 365 days for chart (or generate for all available dates)
    const chartPeriodDays = period === 'all' ? 365 : periodDays;
    const dailyOrdersMap = new Map();
    for (let i = 0; i < chartPeriodDays; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyOrdersMap.set(dayKey, { day: dayLabel, orders: 0, date: dayKey });
    }
    
    filteredOrders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const dayKey = date.toISOString().split('T')[0];
        if (dailyOrdersMap.has(dayKey)) {
          dailyOrdersMap.get(dayKey).orders += 1;
        }
      }
    });
    
    const monthlyData = Array.from(dailyOrdersMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(item => ({ day: item.day, orders: item.orders, date: item.date }));
    
    // Sales vs Deliveries chart - calculate actual deliveries per day
    const dailyDeliveriesMap = new Map();
    for (let i = 0; i < chartPeriodDays; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      dailyDeliveriesMap.set(dayKey, 0);
    }
    
    // Use filteredOrders for consistency with orders chart
    filteredOrders.forEach(order => {
      if (order.createdAt && (order.status === 'delivered' || 
          (order.tracking && Array.isArray(order.tracking) && order.tracking.some(t => t.status === 'delivered')))) {
        const date = new Date(order.createdAt);
        const dayKey = date.toISOString().split('T')[0];
        if (dailyDeliveriesMap.has(dayKey)) {
          dailyDeliveriesMap.set(dayKey, dailyDeliveriesMap.get(dayKey) + 1);
        }
      }
    });
    
    const areaData = monthlyData.map(item => {
      const dayKey = item.date;
      const deliveries = dailyDeliveriesMap.get(dayKey) || 0;
      return {
        month: item.day,
        orders: item.orders,
        deliveries: deliveries
      };
    });
    
    // Products by category pie chart data
    const categoryMap = new Map();
    if (Array.isArray(products)) {
      products.forEach(product => {
        const category = product.category || 'Uncategorized';
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
      });
    }
    
    const categoryData = Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    
    // Prepare response
    const stats = {
      // 1-5: User & Order Stats
      totalUsers,
      newUsers,
      totalOrders,
      totalDeliveries,
      activeUsers,
      
      // 6-8: Product Stats
      topSellingProducts,
      latestProducts,
      totalProductsAdded,
      totalProductsSold,
      
      // 9: Sales Growth
      salesGrowth: parseFloat(salesGrowth),
      currentSales,
      prevSales,
      
      // 10: Coupon Stats (3 Data Points)
      activeCoupons,        // 1. Active coupons count
      totalUsageLimit,      // 2. Total usage limit (kitna log use kar sakte hain)
      totalUsedCount,       // 3. Total used count (kitna log use kar chuke hain)
      unlimitedCoupons,     // Bonus: Count of unlimited coupons
      totalCoupons,         // Total coupons (all)
      remainingCoupons,     // Remaining usage (for display)
      
      // Chart Data
      monthlyData,
      areaData,
      categoryData
    };
    
    // Cache the result
    setCache(cacheKey, stats);
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: stats 
    }), { 
      status: 200, 
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      } 
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
