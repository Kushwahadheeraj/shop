"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  DollarSign,
  Activity,
  AlertCircle,
  Settings,
  Clock3,
  ShieldCheck
} from 'lucide-react';
import MonthlyChart from './components/MonthlyChart';
import AreaChart from './components/AreaChart';
import API_BASE_URL from '@/lib/apiConfig';

const SETTINGS_STORAGE_KEY = "dashboard_settings_v1";
const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    push: false,
    sms: false,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessages: true,
  },
  theme: "light",
  language: "en",
  security: {
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: "30",
  },
};

export default function DashboardPage() {
  const { isAuthenticated, isSeller, loading, user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [currentView, setCurrentView] = useState('user'); // 'user' or 'product'
  const [settingsSnapshot, setSettingsSnapshot] = useState(DEFAULT_SETTINGS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/dashboard/analytics?view=${currentView}&period=${selectedPeriod}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          // console.log('Dashboard API response:', result);
          if (result.success) {
            setDashboardData(result.data);
          } else {
            // console.error('API returned error:', result.error);
            // Set default data structure to prevent crashes
            setDashboardData({
              users: { total: 0, new: 0, active: 0, growth: 0 },
              orders: { total: 0, deliveries: 0, growth: 0 },
              products: { total: 0, new: 0, active: 0, growth: 0 },
              sales: { total: 0, growth: 0 },
              revenue: 0,
              monthlyData: [],
              areaData: [],
              topProducts: []
            });
          }
        } else {
          // console.error('Failed to fetch dashboard data:', response.status, response.statusText);
          // Set default data structure
          setDashboardData({
            users: { total: 0, new: 0, active: 0, growth: 0 },
            orders: { total: 0, deliveries: 0, growth: 0 },
            products: { total: 0, new: 0, active: 0, growth: 0 },
            sales: { total: 0, growth: 0 },
            revenue: 0,
            monthlyData: [],
            areaData: [],
            topProducts: []
          });
        }
      } catch (error) {
        // console.error('Error fetching dashboard data:', error);
        // Set default data structure
        setDashboardData({
          users: { total: 0, new: 0, active: 0, growth: 0 },
          orders: { total: 0, deliveries: 0, growth: 0 },
          products: { total: 0, new: 0, active: 0, growth: 0 },
          sales: { total: 0, growth: 0 },
          revenue: 0,
          monthlyData: [],
          areaData: [],
          topProducts: []
        });
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated() && isSeller()) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isSeller, selectedPeriod, currentView]);

  // Load dashboard settings snapshot
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettingsSnapshot({
          notifications: parsed.notifications || DEFAULT_SETTINGS.notifications,
          privacy: parsed.privacy || DEFAULT_SETTINGS.privacy,
          theme: parsed.theme || DEFAULT_SETTINGS.theme,
          language: parsed.language || DEFAULT_SETTINGS.language,
          security: parsed.security || DEFAULT_SETTINGS.security,
        });
      } else {
        setSettingsSnapshot(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Failed to load settings snapshot:', error);
      setSettingsSnapshot(DEFAULT_SETTINGS);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num || 0);
  };

  // Fallback data structure
  const defaultData = {
    users: { total: 0, new: 0, active: 0, growth: 0 },
    orders: { total: 0, deliveries: 0, growth: 0 },
    products: { total: 0, new: 0, active: 0, growth: 0 },
    sales: { total: 0, growth: 0 },
    revenue: 0,
    monthlyData: [],
    areaData: [],
    topProducts: [],
    recentActivity: [],
  };

  const data = dashboardData || defaultData;

  const statsConfig = useMemo(() => {
    if (currentView === 'user') {
      return [
        {
          title: 'Total Users',
          value: formatNumber(data.users?.total),
          subtitle: 'Overall registered users',
          trend: data.users?.growth,
          icon: Users,
        },
        {
          title: 'New Users',
          value: formatNumber(data.users?.new),
          subtitle: 'Added this period',
          trend: '+',
          icon: Users,
        },
        {
          title: 'Active Users',
          value: formatNumber(data.users?.active),
          subtitle: 'Currently active',
          trend: null,
          icon: Activity,
        },
        {
          title: 'Total Orders',
          value: formatNumber(data.orders?.total),
          subtitle: 'Orders across stores',
          trend: data.orders?.growth,
          icon: ShoppingCart,
        },
      ];
    }
    return [
      {
        title: 'Total Products',
        value: formatNumber(data.products?.total),
        subtitle: 'Live catalogue size',
        trend: data.products?.growth,
        icon: Package,
      },
      {
        title: 'New Products',
        value: formatNumber(data.products?.new),
        subtitle: 'Added recently',
        trend: '+',
        icon: Package,
      },
      {
        title: 'Active Listings',
        value: formatNumber(data.products?.active),
        subtitle: 'Available to customers',
        trend: null,
        icon: Activity,
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(data.revenue || 0),
        subtitle: 'Gross sales',
        trend: data.sales?.growth,
        icon: DollarSign,
      },
    ];
  }, [currentView, data]);

  const recentActivity = useMemo(() => {
    if (data.recentActivity?.length) return data.recentActivity;
    return [
      { type: 'Order', description: 'New order received', time: '2 mins ago', status: 'success' },
      { type: 'Inventory', description: 'Stock updated - Adhesives', time: '15 mins ago', status: 'pending' },
      { type: 'Payment', description: 'Invoice approved', time: '45 mins ago', status: 'success' },
      { type: 'Alert', description: 'Low stock: Fiber Sheet', time: '1 hour ago', status: 'warning' },
    ];
  }, [data.recentActivity]);

  const notificationSummary = useMemo(() => {
    const activeNotifications = Object.entries(settingsSnapshot.notifications || {})
      .filter(([, enabled]) => enabled)
      .map(([key]) => key);
    return activeNotifications.length ? activeNotifications : ['No notifications enabled'];
  }, [settingsSnapshot.notifications]);

  const quickLinks = [
    { label: 'Profile Settings', path: '/Profile', icon: Settings },
    { label: 'Seller Access', path: '/SellerList', icon: ShieldCheck },
    { label: 'Billing Preferences', path: '/SimpleBillManagement', icon: DollarSign },
    { label: 'Product Catalog', path: '/ProductList', icon: Package },
  ];

  const statusBadge = (status) => {
    if (status === 'success') return 'text-green-700 bg-green-50';
    if (status === 'warning') return 'text-yellow-700 bg-yellow-50';
    return 'text-gray-700 bg-gray-100';
  };

  // Show loading while checking authentication
  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated or not a seller
  if (!isAuthenticated() || !isSeller()) {
    router.push('/login/seller');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Good {new Date().getHours() < 12 ? 'morning' : 'evening'},</p>
              <h1 className="text-3xl font-bold text-gray-900">{user?.username || 'Seller'} Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track store health, performance, and latest configuration at one glance.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex space-x-2">
                <Button
                  variant={currentView === 'user' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('user')}
                  className={currentView === 'user' ? 'bg-yellow-300 hover:bg-yellow-400 text-white border-none' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  User Analytics
                </Button>
                <Button
                  variant={currentView === 'product' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('product')}
                  className={currentView === 'product' ? 'bg-yellow-300 hover:bg-yellow-400 text-white border-none' : ''}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Product Analytics
                </Button>
              </div>
              <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="w-40">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {statsConfig.map((stat) => (
            <Card key={stat.title} className="border border-yellow-100 shadow-sm hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
                {stat.trend && (
                  <p className="text-xs mt-2 text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +{stat.trend}% vs last period
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts + Settings Snapshot */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>
                {currentView === 'user' ? 'Daily Orders' : 'Daily Sales'} (last {selectedPeriod} days)
              </CardTitle>
              <CardDescription>Interactive view of your {currentView === 'user' ? 'orders' : 'sales'} trend.</CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyChart data={data.monthlyData || []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings Snapshot
              </CardTitle>
              <CardDescription>Latest configuration from Settings page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {!settingsLoaded ? (
                <p className="text-gray-500 flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-yellow-400" /> Loading preferences...
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between bg-yellow-50 border border-yellow-100 rounded px-3 py-2">
                    <div>
                      <p className="text-xs text-gray-500">Theme</p>
                      <p className="font-semibold text-gray-800 capitalize">{settingsSnapshot.theme}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Language</p>
                      <p className="font-semibold text-gray-800 uppercase">{settingsSnapshot.language}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">2FA</p>
                      <p className="font-semibold text-gray-800">
                        {settingsSnapshot.security?.twoFactorAuth ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Notifications</p>
                    <div className="flex flex-wrap gap-2">
                      {notificationSummary.map((notification) => (
                        <span key={notification} className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          {notification}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-gray-500">Quick Links</p>
                    <div className="grid grid-cols-1 gap-2">
                      {quickLinks.map((link) => (
                        <button
                          key={link.label}
                          onClick={() => router.push(link.path)}
                          className="flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-yellow-50 rounded border text-left"
                        >
                          <span className="text-sm font-medium text-gray-700">{link.label}</span>
                          <link.icon className="w-4 h-4 text-yellow-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comparative Chart + Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>
                {currentView === 'user' ? 'Orders vs Deliveries' : 'Sales vs Revenue'} (Monthly)
              </CardTitle>
              <CardDescription>Compare performance metrics month over month.</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart data={data.areaData || []} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" /> Live Activity
              </CardTitle>
              <CardDescription>Latest happenings around your store.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={`${activity.description}-${index}`} className="border rounded-lg px-3 py-2 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{activity.description}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(activity.status)}`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock3 className="w-3 h-3" /> {activity.time}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Product Management & Top Products */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Product & Inventory Management</CardTitle>
              <CardDescription>Quick actions for listing management</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => router.push('/ProductAdd')}
                className="bg-yellow-300 hover:bg-yellow-400 text-white flex items-center gap-2"
              >
                <Package className="w-4 h-4" /> Add Product
              </Button>
              <Button
                onClick={() => router.push('/ProductList')}
                variant="outline"
                className="border-yellow-300 text-yellow-600 hover:bg-yellow-50 flex items-center gap-2"
              >
                <Activity className="w-4 h-4" /> View Products
              </Button>
              <Button
                onClick={() => router.push('/SimpleBillManagement')}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" /> Billing Center
              </Button>
              <Button
                onClick={() => router.push('/SellerList')}
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Seller Access
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best sellers this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topProducts?.length ? (
                  data.topProducts.map((product, index) => (
                    <div key={`${product.name}-${index}`} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500">{formatNumber(product.sales)} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue || 0)}</p>
                        <p className="text-xs text-gray-500">{product.category || '—'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-yellow-50 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p>No product data available for this period.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}