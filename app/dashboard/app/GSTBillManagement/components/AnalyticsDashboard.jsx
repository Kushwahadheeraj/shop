"use client";
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Package, Calendar, Download, Filter, RefreshCw, Eye, FileText, PieChart, LineChart, X, CheckCircle } from 'lucide-react';

const AnalyticsDashboard = ({ onClose, bills = [] }) => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [chartType, setChartType] = useState('bar');

  // Calculate analytics data
  const calculateAnalytics = () => {
    const now = new Date();
    const startDate = new Date(now.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));
    
    const filteredBills = bills.filter(bill => {
      const billDate = new Date(bill.invoiceDate);
      return billDate >= startDate && billDate <= now;
    });

    const totalRevenue = filteredBills.reduce((sum, bill) => sum + (bill.grandTotal || 0), 0);
    const totalBills = filteredBills.length;
    const paidBills = filteredBills.filter(bill => bill.paymentStatus === 'Paid').length;
    const pendingBills = filteredBills.filter(bill => bill.paymentStatus === 'Pending').length;
    const overdueBills = filteredBills.filter(bill => bill.paymentStatus === 'Overdue').length;
    
    const averageBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;
    
    // Calculate monthly revenue
    const monthlyRevenue = {};
    filteredBills.forEach(bill => {
      const month = new Date(bill.invoiceDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (bill.grandTotal || 0);
    });

    // Calculate GST breakdown
    const gstBreakdown = {
      cgst: filteredBills.reduce((sum, bill) => sum + (bill.totalCGST || 0), 0),
      sgst: filteredBills.reduce((sum, bill) => sum + (bill.totalSGST || 0), 0),
      totalGST: filteredBills.reduce((sum, bill) => sum + (bill.gstAmount || 0), 0)
    };

    // Top customers
    const customerRevenue = {};
    filteredBills.forEach(bill => {
      const customer = bill.customerName || 'Unknown';
      customerRevenue[customer] = (customerRevenue[customer] || 0) + (bill.grandTotal || 0);
    });

    const topCustomers = Object.entries(customerRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, revenue]) => ({ name, revenue }));

    // Payment status distribution
    const paymentStatusData = [
      { status: 'Paid', count: paidBills, color: 'bg-green-500' },
      { status: 'Pending', count: pendingBills, color: 'bg-yellow-300' },
      { status: 'Overdue', count: overdueBills, color: 'bg-red-500' }
    ];

    return {
      totalRevenue,
      totalBills,
      paidBills,
      pendingBills,
      overdueBills,
      averageBillValue,
      monthlyRevenue,
      gstBreakdown,
      topCustomers,
      paymentStatusData
    };
  };

  const analytics = calculateAnalytics();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? '+' : ''}{change}% from last period
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-sm sm:text-base text-gray-600">Track your business performance and insights</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(analytics.totalRevenue)}
              icon={DollarSign}
              color="bg-green-500"
              change="12.5"
              changeType="positive"
            />
            <StatCard
              title="Total Invoices"
              value={analytics.totalBills}
              icon={FileText}
              color="bg-blue-500"
              change="8.2"
              changeType="positive"
            />
            <StatCard
              title="Paid Invoices"
              value={analytics.paidBills}
              icon={CheckCircle}
              color="bg-green-500"
              change="5.1"
              changeType="positive"
            />
            <StatCard
              title="Average Bill Value"
              value={formatCurrency(analytics.averageBillValue)}
              icon={TrendingUp}
              color="bg-purple-500"
              change="3.7"
              changeType="positive"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Revenue Chart */}
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setChartType('bar')}
                    className={`p-2 rounded ${chartType === 'bar' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`p-2 rounded ${chartType === 'line' ? 'bg-purple-100 text-purple-600' : 'text-gray-400'}`}
                  >
                    <LineChart className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Revenue chart will be displayed here</p>
                </div>
              </div>
            </div>

            {/* Payment Status Distribution */}
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Status</h3>
              <div className="space-y-3 sm:space-y-4">
                {analytics.paymentStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${item.color}`}></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{item.status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-gray-600">{item.count}</span>
                      <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.count / analytics.totalBills) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Customers */}
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Top Customers</h3>
              <div className="space-y-2.5 sm:space-y-3">
                {analytics.topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-medium text-purple-600">
                          {customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[150px] sm:max-w-[200px]">{customer.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(customer.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GST Breakdown */}
            <div className="bg-white p-4 sm:p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">GST Breakdown</h3>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">CGST</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(analytics.gstBreakdown.cgst)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">SGST</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(analytics.gstBreakdown.sgst)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm font-medium text-gray-900">Total GST</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(analytics.gstBreakdown.totalGST)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-top border-gray-200">
            <button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
