"use client";
import React, { useEffect, useMemo, useState, lazy, Suspense, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  DollarSign,
  Activity,
  Truck,
  Gift,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Receipt,
  CreditCard,
  History
} from 'lucide-react';

// Lazy load chart components
const MonthlyChart = lazy(() => import('./components/MonthlyChart'));
const AreaChart = lazy(() => import('./components/AreaChart'));
const PieChart = lazy(() => import('./components/PieChart'));

const DashboardPage = React.memo(function DashboardPage() {
  const { isAuthenticated, isSeller, loading, user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(false); // Start as false to show page
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // Default to 'all' to match Bill Management page (shows all bills)
  const [greeting, setGreeting] = useState('');
  const [activeSection, setActiveSection] = useState('user'); // 'user' or 'bill'
  const [billData, setBillData] = useState(null);
  const [loadingBillData, setLoadingBillData] = useState(false);
  const fetchInProgressRef = useRef(false); // Track if fetch is in progress
  const billFetchInProgressRef = useRef(false); // Track if bill fetch is in progress

  // Get greeting based on time - updates every minute to reflect time changes
  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        return 'Morning';
      } else if (hour < 17) {
        return 'Afternoon';
      } else {
        return 'Evening';
      }
    };
    
    // Set initial greeting
    setGreeting(getGreeting());
    
    // Update greeting every minute to reflect time changes
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Fetch dashboard data - FIXED: Prevent infinite refresh, ensure page always shows
  useEffect(() => {
    // Don't fetch if still loading auth
    if (loading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.replace('/login/seller');
      return;
    }
    
    // Check if user is valid seller
    if (!user) {
      console.log('No user found, waiting for user to load...');
      return;
    }
    
    if (user.role !== 'seller' && user.role !== 'admin') {
      console.log('User is not a seller, redirecting...');
      router.replace('/login/seller');
      return;
    }

    // Prevent duplicate fetches
    if (fetchInProgressRef.current) {
      console.log('Fetch already in progress, skipping...');
      return;
    }

    const fetchDashboardData = async () => {
      // Mark as in progress
      fetchInProgressRef.current = true;
      console.log('Starting dashboard data fetch...', { selectedPeriod, userId: user.id });
      
      try {
        setLoadingData(true);
        
        const cacheKey = `dashboard_${selectedPeriod}_${user.id || 'unknown'}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
        
        // Use cached data if less than 30 seconds old
        if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < 30000) {
          console.log('Using cached data');
          setDashboardData(JSON.parse(cachedData));
          setLoadingData(false);
          fetchInProgressRef.current = false;
          return;
        }
        
        console.log('Fetching fresh data from API...');
        const response = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response Status:', response.status, response.ok);
        
        if (response.ok) {
          const result = await response.json();
          console.log('Dashboard API Response:', result);
          if (result.success && result.data) {
            console.log('Setting dashboard data:', {
              totalUsers: result.data.totalUsers,
              totalOrders: result.data.totalOrders,
              latestProducts: result.data.latestProducts?.length || 0
            });
            setDashboardData(result.data);
            sessionStorage.setItem(cacheKey, JSON.stringify(result.data));
            sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          } else {
            console.error('API returned success=false or no data:', result);
            // Set empty data structure if API fails
            setDashboardData(null);
          }
        } else {
          const errorText = await response.text();
          console.error('API Error Response:', response.status, errorText);
          setDashboardData(null);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData(null);
      } finally {
        setLoadingData(false);
        fetchInProgressRef.current = false;
      }
    };

    fetchDashboardData();
    // Depend on selectedPeriod and user (when user is available)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, user]);

  // Fetch Bill Analytics data when bill section is active
  useEffect(() => {
    if (activeSection !== 'bill') return;
    if (loading) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) return;
    
    if (billFetchInProgressRef.current) return;

    const fetchBillAnalytics = async () => {
      billFetchInProgressRef.current = true;
      setLoadingBillData(true);
      
      try {
        const cacheKey = `bill_analytics_${selectedPeriod}_${user.id || 'unknown'}`;
        const cachedData = sessionStorage.getItem(cacheKey);
        const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
        
        // Use cached data if less than 30 seconds old
        if (cachedData && cacheTime && Date.now() - parseInt(cacheTime) < 30000) {
          console.log('Using cached bill analytics data');
          setBillData(JSON.parse(cachedData));
          setLoadingBillData(false);
          billFetchInProgressRef.current = false;
          return;
        }
        
        console.log('Fetching bill analytics from API...');
        const response = await fetch(`/api/dashboard/bill-analytics?period=${selectedPeriod}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Bill Analytics API Response:', result);
          if (result.success) {
            setBillData(result);
            sessionStorage.setItem(cacheKey, JSON.stringify(result));
            sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          } else {
            console.error('Bill Analytics API returned success=false:', result);
            setBillData(null);
          }
        } else {
          const errorText = await response.text();
          console.error('Bill Analytics API Error:', response.status, errorText);
          setBillData(null);
        }
      } catch (error) {
        console.error('Error fetching bill analytics:', error);
        setBillData(null);
      } finally {
        setLoadingBillData(false);
        billFetchInProgressRef.current = false;
      }
    };

    fetchBillAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, selectedPeriod, user, loading]);

  const formatNumber = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-IN');
    return (num) => formatter.format(num || 0);
  }, []);

  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (amount) => formatter.format(amount);
  }, []);

  const data = dashboardData || {
    totalUsers: 0,
    newUsers: 0,
    totalOrders: 0,
    totalDeliveries: 0,
    activeUsers: 0,
    topSellingProducts: [],
    latestProducts: [],
      totalProductsAdded: 0,
      totalProductsSold: 0,
      salesGrowth: 0,
      activeCoupons: 0,
      totalUsageLimit: 0,
      totalUsedCount: 0,
      unlimitedCoupons: 0,
    monthlyData: [],
    areaData: [],
    categoryData: []
  };

  // Only show loading skeleton for auth loading, not data loading
  // This ensures page always renders even while fetching data
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header with Shop Name and Greeting - 3D Effect */}
      <div className="mb-4 sm:mb-6">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 25%, #d97706 50%, #f59e0b 75%, #fbbf24 100%)',
            boxShadow: '0 20px 60px -15px rgba(245, 158, 11, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
          }}
        >
          {/* 3D Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between z-10 gap-4 sm:gap-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-lg"
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(0, 0, 0, 0.2)'
                }}
              >
                {user?.shopName ? user.shopName : 'Welcome to your Dashboard'}
              </h1>
              <p className="text-sm sm:text-base text-yellow-50 font-medium drop-shadow-md"
                style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
                }}
              >
                {greeting && `Good ${greeting}!`}
              </p>
            </div>
            
            {/* Analytics Buttons - Right Side with 3D Effect */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => setActiveSection('user')}
                className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 text-sm sm:text-base ${
                  activeSection === 'user'
                    ? 'bg-white text-yellow-600 shadow-2xl hover:shadow-3xl'
                    : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50'
                }`}
                style={activeSection === 'user' ? {
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.6) inset'
                } : {
                  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                }}
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">User Analytics</span>
                <span className="xs:hidden">User</span>
              </button>
              <button
                onClick={() => setActiveSection('bill')}
                className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 text-sm sm:text-base ${
                  activeSection === 'bill'
                    ? 'bg-white text-yellow-600 shadow-2xl hover:shadow-3xl'
                    : 'bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 hover:border-white/50'
                }`}
                style={activeSection === 'bill' ? {
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset, 0 1px 0 rgba(255, 255, 255, 0.6) inset'
                } : {
                  boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                }}
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Bill Analytics</span>
                <span className="xs:hidden">Bill</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Selector */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              {activeSection === 'user' ? 'User Analytics' : 'Bill Analytics'}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              {activeSection === 'user' 
                ? 'Complete shop analytics and insights'
                : 'Complete bill management and insights'}
            </p>
          </div>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* User Analytics Section */}
      {activeSection === 'user' && (
        <>

      {/* Main Stats Cards - 11 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Users */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.totalUsers)}</div>
                <p className="text-xs text-gray-500 mt-1">Registered users</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. New Users */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">New Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.newUsers)}</div>
                <p className="text-xs text-gray-500 mt-1">This period</p>
          </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
        </div>
      </div>
          </CardContent>
        </Card>

        {/* 3. Total Orders */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.totalOrders)}</div>
                <p className="text-xs text-gray-500 mt-1">Orders received</p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg flex-shrink-0 ml-2">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              </div>
            </div>
                </CardContent>
              </Card>

        {/* 4. Total Deliveries */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.totalDeliveries)}</div>
                <p className="text-xs text-gray-500 mt-1">Completed</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0 ml-2">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
                </CardContent>
              </Card>

        {/* 5. Active Users */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.activeUsers)}</div>
                <p className="text-xs text-gray-500 mt-1">With orders</p>
              </div>
              <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg flex-shrink-0 ml-2">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
        </div>
          </CardContent>
        </Card>

        {/* 6. Total Products Added */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Products Added</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.totalProductsAdded)}</div>
                <p className="text-xs text-gray-500 mt-1">Total products</p>
              </div>
              <div className="p-2 sm:p-3 bg-pink-100 rounded-lg flex-shrink-0 ml-2">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
              </div>
            </div>
            </CardContent>
          </Card>

        {/* 7. Products Sold */}
          <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Products Sold</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.totalProductsSold)}</div>
                <p className="text-xs text-gray-500 mt-1">Unique products</p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0 ml-2">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
                    </div>
          </CardContent>
        </Card>

        {/* 8. Sales Growth */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Sales Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {data.salesGrowth > 0 ? '+' : ''}{data.salesGrowth.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">vs previous period</p>
              </div>
              <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg flex-shrink-0 ml-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
                    </div>
          </CardContent>
        </Card>

        {/* 9. Active Coupons */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Active Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.activeCoupons || 0)}</div>
                <p className="text-xs text-gray-500 mt-1">Currently active</p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
          </CardContent>
        </Card>

        {/* 10. Total Usage Limit */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Usage Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {data.unlimitedCoupons > 0 
                    ? `${formatNumber(data.totalUsageLimit || 0)}+` 
                    : formatNumber(data.totalUsageLimit || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.unlimitedCoupons > 0 
                    ? `${data.unlimitedCoupons} unlimited` 
                    : 'Total limit'}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                  </div>
          </CardContent>
        </Card>

        {/* 11. Total Used Count */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Coupons Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.totalUsedCount || 0)}</div>
                <p className="text-xs text-gray-500 mt-1">Total used</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                  </div>
            </CardContent>
          </Card>
        </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Orders Chart */}
        <Card>
            <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
              Daily Orders
              </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Orders received per day</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
            <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
              <MonthlyChart data={data.monthlyData || []} />
              </Suspense>
            </CardContent>
          </Card>

        {/* Orders vs Deliveries Chart */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              Orders vs Deliveries
              </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Comparison over time</CardDescription>
            </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
              <AreaChart data={data.areaData || []} />
            </Suspense>
            </CardContent>
          </Card>
        </div>

      {/* Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Selling Products */}
          <Card>
            <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Top Selling Products
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Most sold products</CardDescription>
            </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              {data.topSellingProducts && data.topSellingProducts.length > 0 ? (
                data.topSellingProducts.slice(0, 10).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xs sm:text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">Quantity sold</p>
                      </div>
                    </div>
                    <div className="text-base sm:text-lg font-bold text-gray-900 ml-2 flex-shrink-0">{formatNumber(product.quantity)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-500 text-sm">No products sold yet</div>
              )}
            </div>
            </CardContent>
          </Card>

        {/* Latest Products Added */}
          <Card>
            <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Latest Products Added
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Recently added products</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
            <div className="space-y-2 sm:space-y-3">
              {data.latestProducts && Array.isArray(data.latestProducts) && data.latestProducts.length > 0 ? (
                data.latestProducts.slice(0, 10).map((product, index) => (
                  <div key={`latest-${index}-${product.name}`} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{product.name || 'Unknown Product'}</p>
                        <p className="text-xs text-gray-500 truncate">{product.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-2 flex-shrink-0 whitespace-nowrap">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-gray-500 mb-2 text-sm">No products added yet</div>
                  {loadingData && (
                    <div className="text-xs text-gray-400">Loading products...</div>
                  )}
                  {!loadingData && dashboardData && (
                    <div className="text-xs text-gray-400">
                      {dashboardData.latestProducts ? 
                        `Found ${dashboardData.latestProducts.length} products` : 
                        'No products data available'}
                    </div>
                  )}
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Category Distribution Pie Chart */}
      {data.categoryData && data.categoryData.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Products by Category
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribution of products across categories</CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
              <PieChart data={data.categoryData} />
            </Suspense>
          </CardContent>
        </Card>
      )}
        </>
      )}

      {/* Bill Analytics Section */}
      {activeSection === 'bill' && (
        <>
          {loadingBillData ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : billData ? (
            <>
              {/* Main Bill Management Stats - Kitna ka aaya, kitna diya, kitna baki */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Kitna ka aaya saman - Total Amount */}
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                      <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      <span className="text-xs sm:text-base">कितना का आया सामान</span>
                    </CardTitle>
                    <CardDescription className="text-xs">Total Bill Amount</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 truncate">
                          {formatCurrency(billData.summary?.totalAmount || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">सभी बिलों का कुल योग</p>
                      </div>
                      <div className="p-2 sm:p-3 md:p-4 bg-blue-100 rounded-xl flex-shrink-0 ml-2">
                        <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Kitna diya gaya - Paid Amount */}
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      <span className="text-xs sm:text-base">कितना दिया गया</span>
                    </CardTitle>
                    <CardDescription className="text-xs">Total Paid Amount</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 truncate">
                          {formatCurrency(billData.summary?.paidAmount || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">कुल भुगतान राशि</p>
                        {billData.summary?.totalAmount > 0 && (
                          <p className="text-xs text-green-600 mt-1 font-medium">
                            {((billData.summary.paidAmount / billData.summary.totalAmount) * 100).toFixed(1)}% Paid
                          </p>
                        )}
                      </div>
                      <div className="p-2 sm:p-3 md:p-4 bg-green-100 rounded-xl flex-shrink-0 ml-2">
                        <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Kitna baki hai - Remaining Amount */}
                <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base font-semibold text-gray-700 flex items-center gap-2">
                      <History className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      <span className="text-xs sm:text-base">कितना बाकी है</span>
                    </CardTitle>
                    <CardDescription className="text-xs">Total Remaining Amount</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-700 truncate">
                          {formatCurrency(billData.summary?.remainingAmount || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-2">बकाया राशि</p>
                        {billData.summary?.totalAmount > 0 && (
                          <p className="text-xs text-orange-600 mt-1 font-medium">
                            {((billData.summary.remainingAmount / billData.summary.totalAmount) * 100).toFixed(1)}% Pending
                          </p>
                        )}
                      </div>
                      <div className="p-2 sm:p-3 md:p-4 bg-orange-100 rounded-xl flex-shrink-0 ml-2">
                        <History className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Status Charts - Half-Half Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Simple Bill Management Payment Status - Left Side */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Simple Bill Management
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">भुगतान स्थिति - Paid vs Remaining</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
                      <PieChart 
                        data={[
                          { 
                            name: 'Paid (दिया गया)', 
                            value: billData.sources?.simpleBillManagement?.paidAmount || 0,
                            color: '#10b981'
                          },
                          { 
                            name: 'Remaining (बाकी)', 
                            value: billData.sources?.simpleBillManagement?.remainingAmount || 0,
                            color: '#f59e0b'
                          }
                        ].filter(item => item.value > 0)}
                        dataKey="value"
                        nameKey="name"
                      />
                    </Suspense>
                  </CardContent>
                </Card>

                {/* Bill Management Payment Status - Right Side */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      Bill Management
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">भुगतान स्थिति - Paid vs Remaining</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
                      <PieChart 
                        data={[
                          { 
                            name: 'Paid (दिया गया)', 
                            value: billData.sources?.billManagement?.paidAmount || 0,
                            color: '#10b981'
                          },
                          { 
                            name: 'Remaining (बाकी)', 
                            value: billData.sources?.billManagement?.remainingAmount || 0,
                            color: '#f59e0b'
                          }
                        ].filter(item => item.value > 0)}
                        dataKey="value"
                        nameKey="name"
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>

              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Bills */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Bills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {formatNumber(billData.summary?.totalBills || 0)}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <p className="text-xs text-gray-500">Last {selectedPeriod} days</p>
                          {billData.summary?.billsGrowth !== undefined && (
                            <span className={`text-xs font-medium ${
                              billData.summary.billsGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {billData.summary.billsGrowth >= 0 ? '↑' : '↓'} {Math.abs(billData.summary.billsGrowth)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0 ml-2">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Amount */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {formatCurrency(billData.summary?.totalAmount || 0)}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <p className="text-xs text-gray-500">Last {selectedPeriod} days</p>
                          {billData.summary?.amountGrowth !== undefined && (
                            <span className={`text-xs font-medium ${
                              billData.summary.amountGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {billData.summary.amountGrowth >= 0 ? '↑' : '↓'} {Math.abs(billData.summary.amountGrowth)}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Average Bill Value */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Avg Bill Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {formatCurrency(billData.summary?.averageBillValue || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Per bill</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0 ml-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Total Items */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                          {formatNumber(billData.sources?.billItemsInventory?.totalItems || 0)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">From all bills</p>
                      </div>
                      <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0 ml-2">
                        <Package className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Source-wise Breakdown - All 6 Sources */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {/* Bill Management */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Bill Management</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Bills:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatNumber(billData.sources?.billManagement?.count || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Total:</span>
                        <span className="text-base sm:text-lg font-semibold text-blue-600 truncate ml-2">
                          {formatCurrency(billData.sources?.billManagement?.amount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-xs sm:text-sm text-gray-600">Paid:</span>
                        <span className="text-sm sm:text-base font-semibold text-green-600 truncate ml-2">
                          {formatCurrency(billData.sources?.billManagement?.paidAmount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Remaining:</span>
                        <span className="text-sm sm:text-base font-semibold text-orange-600 truncate ml-2">
                          {formatCurrency(billData.sources?.billManagement?.remainingAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* GST Bill Management */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">GST Bill Management</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Bills:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatNumber(billData.sources?.gstBillManagement?.count || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Amount:</span>
                        <span className="text-base sm:text-lg font-semibold text-green-600 truncate ml-2">
                          {formatCurrency(billData.sources?.gstBillManagement?.amount || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Simple Bill Management */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Simple Bill Management</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Bills:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatNumber(billData.sources?.simpleBillManagement?.count || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Total:</span>
                        <span className="text-base sm:text-lg font-semibold text-blue-600 truncate ml-2">
                          {formatCurrency(billData.sources?.simpleBillManagement?.amount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-xs sm:text-sm text-gray-600">Paid:</span>
                        <span className="text-sm sm:text-base font-semibold text-green-600 truncate ml-2">
                          {formatCurrency(billData.sources?.simpleBillManagement?.paidAmount || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Remaining:</span>
                        <span className="text-sm sm:text-base font-semibold text-orange-600 truncate ml-2">
                          {formatCurrency(billData.sources?.simpleBillManagement?.remainingAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Invoice Creator */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Quick Invoice Creator</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Invoices:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatNumber(billData.sources?.quickInvoiceCreator?.count || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Amount:</span>
                        <span className="text-base sm:text-lg font-semibold text-green-600 truncate ml-2">
                          {formatCurrency(billData.sources?.quickInvoiceCreator?.amount || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bill Items Inventory */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Bill Items Inventory</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Items:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatNumber(billData.sources?.billItemsInventory?.count || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Total Qty:</span>
                        <span className="text-base sm:text-lg font-semibold text-blue-600 truncate ml-2">
                          {formatNumber(billData.sources?.billItemsInventory?.totalItems || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Seller List */}
                <Card>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">Seller List</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">Total Sellers:</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatNumber(billData.sources?.sellerList?.count || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t pt-2 mt-2">
                        <span className="text-xs sm:text-sm text-gray-600">Active Sellers:</span>
                        <span className="text-sm sm:text-base font-semibold text-green-600 truncate ml-2">
                          {formatNumber(billData.sources?.sellerList?.activeCount || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bill Type Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                {billData.byType && Object.entries(billData.byType).map(([type, data]) => {
                  if (!data || data.count === 0) return null;
                  const typeNames = {
                    gstBills: 'GST Bills',
                    simpleBills: 'Simple Bills',
                    regularBills: 'Regular Bills',
                    invoices: 'Invoices'
                  };
                  const colors = {
                    gstBills: 'bg-green-100 text-green-600',
                    simpleBills: 'bg-yellow-100 text-yellow-600',
                    regularBills: 'bg-blue-100 text-blue-600',
                    invoices: 'bg-purple-100 text-purple-600'
                  };
                  return (
                    <Card key={type}>
                      <CardHeader className="pb-2 sm:pb-3">
                        <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">{typeNames[type] || type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{formatNumber(data.count || 0)}</div>
                            <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{formatCurrency(data.amount || 0)}</div>
                          </div>
                          <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ml-2 ${colors[type] || 'bg-gray-100'}`}>
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Payment Status Trend Chart */}
              {billData.charts?.monthly && billData.charts.monthly.some(item => item.paidAmount > 0 || item.remainingAmount > 0) && (
                <Card className="mt-4 sm:mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      Payment Status Trend (भुगतान स्थिति)
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Monthly Paid vs Remaining Amounts</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
                      <AreaChart 
                        data={billData.charts.monthly.map(item => ({
                          month: item.month,
                          orders: item.paidAmount || 0,
                          deliveries: item.remainingAmount || 0
                        }))} 
                      />
                    </Suspense>
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4 justify-center text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-600">Paid (दिया गया)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded"></div>
                        <span className="text-gray-600">Remaining (बाकी)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {/* Monthly Bills Chart */}
                {billData.charts?.monthly && billData.charts.monthly.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        Monthly Bills Trend
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Bills and revenue by month</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
                        <MonthlyChart 
                          data={billData.charts.monthly.map(item => ({
                            day: item.month,
                            orders: item.bills,
                            amount: item.amount
                          }))} 
                        />
                      </Suspense>
                    </CardContent>
                  </Card>
                )}

                {/* Daily Bills Chart */}
                {billData.charts?.daily && billData.charts.daily.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                        Daily Bills Trend
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Bills and revenue by day</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
                        <AreaChart 
                          data={billData.charts.daily.map(item => ({
                            month: item.day,
                            orders: item.bills,
                            deliveries: Math.round(item.amount / 1000) // Scale down for visualization
                          }))} 
                        />
                      </Suspense>
                    </CardContent>
                  </Card>
                )}

                {/* Bill Type Distribution Pie Chart */}
                {billData.charts?.billTypeDistribution && billData.charts.billTypeDistribution.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <PieChartIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Bill Type Distribution
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Distribution by bill type</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <Suspense fallback={<div className="h-48 sm:h-64 flex items-center justify-center text-sm">Loading chart...</div>}>
                        <PieChart 
                          data={billData.charts.billTypeDistribution.map(item => ({
                            name: item.name,
                            value: item.value,
                            amount: item.amount
                          }))} 
                        />
                      </Suspense>
                    </CardContent>
                  </Card>
                )}

                {/* Top Items */}
                {billData.charts?.topItems && billData.charts.topItems.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                        Top Items Sold
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm">Most sold items from bills</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-6">
                      <div className="space-y-2 sm:space-y-3">
                        {billData.charts.topItems.slice(0, 10).map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs sm:text-sm flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                                <p className="text-xs text-gray-500 truncate">{item.category}</p>
                              </div>
                            </div>
                            <div className="text-right ml-2 flex-shrink-0">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base">{formatNumber(item.quantity)}</p>
                              <p className="text-xs text-gray-500">{formatCurrency(item.totalValue)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No bill data available</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later</p>
            </div>
          )}
        </>
      )}
    </div>
  );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
