"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown,
  Package,
  DollarSign,
  BarChart3,
  Activity
} from 'lucide-react';
import MonthlyChart from './components/MonthlyChart';
import AreaChart from './components/AreaChart';
import API_BASE_URL from '@/lib/apiConfig';

export default function DashboardPage() {
  const { isAuthenticated, isSeller, loading, user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [currentView, setCurrentView] = useState('user'); // 'user' or 'product'

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
    router.push('/login');
    return null;
  }

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
    topProducts: []
  };

  const data = dashboardData || defaultData;

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex space-x-2">
                <Button
                  variant={currentView === 'user' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('user')}
                  className={currentView === 'user' ? 'bg-yellow-300 hover:bg-yellow-700' : ''}
                >
                  <Users className="w-4 h-4 mr-2" />
                  User Analytics
                </Button>
                <Button
                  variant={currentView === 'product' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentView('product')}
                  className={currentView === 'product' ? 'bg-yellow-300 hover:bg-yellow-700' : ''}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Product Analytics
                </Button>
        </div>
      </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </Select>
              <div className="text-sm text-gray-500">
                Welcome back, {user?.name || 'Seller'}
      </div>
            </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'user' ? (
          <>
            {/* User Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.users?.total)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{data.users?.growth}% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.users?.new)}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.users?.active || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.orders?.total || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{data.orders?.growth || 0}% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Orders</CardTitle>
                  <CardDescription>
                    Orders over the last {selectedPeriod} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyChart data={data.monthlyData || []} />
                </CardContent>
              </Card>

              {/* Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Orders vs Deliveries</CardTitle>
                  <CardDescription>
                    Monthly comparison of orders and deliveries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart data={data.areaData || []} />
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* Product Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.products?.total || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{data.products?.growth || 0}% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.products?.new || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    This month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.products?.active || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently selling
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(data.revenue || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{data.sales?.growth || 0}% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>
        </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Sales Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Sales</CardTitle>
                  <CardDescription>
                    Sales over the last {selectedPeriod} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MonthlyChart data={data.monthlyData || []} />
                </CardContent>
              </Card>

              {/* Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales vs Revenue</CardTitle>
                  <CardDescription>
                    Monthly comparison of sales and revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaChart data={data.areaData || []} />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Product Management Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>
              Manage your products - add, edit, and delete products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/Dashboard/ProductAdd')}
                className="bg-yellow-300 hover:bg-yellow-300 text-white"
              >
                <Package className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button
                onClick={() => router.push('/Dashboard/ProductList')}
                variant="outline"
                className="border-yellow-300 text-yellow-300 hover:bg-yellow-50"
              >
                <Package className="w-4 h-4 mr-2" />
                View All Products
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>
              Your best performing products this {selectedPeriod} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts?.length > 0 ? (
                dashboardData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-yellow-800">{product.id}</span>
            </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-gray-500">{formatNumber(product.sales)} units sold</p>
            </div>
          </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-gray-500">{formatNumber(product.sales)} sales</p>
        </div>
      </div>
                ))
              ) : (
        <div className="text-center py-8 text-gray-500">
                  <div className="w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
        </div>
                  <p>No product data available</p>
      </div>
              )}
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 