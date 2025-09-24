"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, DollarSign, Building2, CreditCard, History, Receipt, X, FileText, Printer, BarChart3, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import AddGSTBillForm from './AddGSTBillForm';
import GSTBillViewModal from './GSTBillViewModal';
import EditGSTBillForm from './EditGSTBillForm';
import InvoiceTemplates from './components/InvoiceTemplates';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContactsManager from './components/ContactsManager';

const GSTBillManagementPage = () => {
  const router = useRouter();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  const [showAddGSTBillForm, setShowAddGSTBillForm] = useState(false);
  const [showGSTBillViewModal, setShowGSTBillViewModal] = useState(false);
  const [showEditGSTBillForm, setShowEditGSTBillForm] = useState(false);
  const [showInvoiceTemplates, setShowInvoiceTemplates] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [shops, setShops] = useState([]);
  const [gstBills, setGstBills] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');
  const [loading, setLoading] = useState(true);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    totalGST: 0,
    netAmount: 0
  });

  // Load real data from database
  useEffect(() => {
    const loadRealData = async () => {
      console.log('🔄 Loading GST bills data from database...');
      
      try {
        console.log('📊 Fetching shops...');
        await fetchShops();
        console.log('📊 Shops fetched successfully:', shops);
        
        console.log('📊 Fetching GST bills...');
        await fetchGSTBills();
        console.log('📊 GST bills fetched successfully:', gstBills);
        
        console.log('📊 Fetching stats...');
        await fetchStats();
        console.log('📊 Stats fetched successfully:', stats);
        
        console.log('✅ All data loaded successfully!');
      } catch (error) {
        console.error('❌ Error loading data:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
    };
    
    loadRealData();
  }, []);

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/login/seller');
      } else if (!isSeller()) {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, isSeller, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not a seller
  if (!isAuthenticated() || !isSeller()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  // Fetch GST shops only (GST module uses dedicated shops)
  const fetchShops = async () => {
    try {
      setShopsLoading(true);
      const token = localStorage.getItem('token');
      console.log('🔑 Token for GST shops API:', token ? 'Present' : 'Missing');
      console.log('🔗 GST Shops API URL: /api/gst-shops');
      
      const response = await fetch('/api/gst-shops', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Shops API Response Status:', response.status);
      console.log('📡 Shops API Response OK:', response.ok);
      
      const data = await response.json();
      console.log('📊 Shops API Raw Response:', data);
      
      if (response.status === 401) {
        console.error('❌ Authentication failed:', data.message);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login/seller');
        return;
      }
      
      if (data.success) {
        const shops = data.data || [];
        console.log('✅ Shops data extracted:', shops);
        console.log('✅ Number of shops:', shops.length);
        setShops(shops);
        console.log('✅ Shops state updated successfully');
      } else {
        console.error('❌ API returned error:', data.message);
        console.error('❌ Full error response:', data);
      }
    } catch (error) {
      console.error('❌ Network error fetching shops:', error);
      console.error('❌ Error details:', error.message);
    } finally {
      setShopsLoading(false);
    }
  };

  // Fetch GST bills
  const fetchGSTBills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('🔑 Token for GST bills API:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.error('❌ No authentication token found');
        return;
      }
      
      const params = new URLSearchParams();
      if (selectedShop) params.append('shopId', selectedShop);
      if (searchTerm) params.append('search', searchTerm);
      
      if (filterDateRange) {
        const { startDate, endDate } = getDateRange(filterDateRange);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      }

      const apiUrl = `http://localhost:5000/api/gst-bills?${params}`;
      console.log('🔗 GST Bills API URL:', apiUrl);
      console.log('📋 Query Parameters:', params.toString());

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 GST Bills API Response Status:', response.status);
      console.log('📡 GST Bills API Response OK:', response.ok);
      
      if (response.status === 401) {
        console.error('❌ Authentication failed');
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login/seller');
        return;
      }
      
      const data = await response.json();
      console.log('📊 GST Bills API Raw Response:', data);
      
      if (data.success && data.data) {
        const bills = data.data.gstBills || [];
        setGstBills(bills);
        console.log('✅ GST Bills fetched successfully:', bills);
        
        if (bills.length > 0) {
          const calculatedStats = calculateStatsFromBills(bills);
          setStats(calculatedStats);
          console.log('📊 Stats calculated from GST bills:', calculatedStats);
        }
      } else {
        console.error('❌ API returned error:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Error fetching GST bills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get date range based on filter selection
  const getDateRange = (range) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    
    switch (range) {
      case '1d':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return { startDate: yesterday.toISOString().split('T')[0], endDate };
      case '3d':
        const threeDaysAgo = new Date(now);
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return { startDate: threeDaysAgo.toISOString().split('T')[0], endDate };
      case '1w':
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return { startDate: oneWeekAgo.toISOString().split('T')[0], endDate };
      case '15d':
        const fifteenDaysAgo = new Date(now);
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
        return { startDate: fifteenDaysAgo.toISOString().split('T')[0], endDate };
      case '1m':
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return { startDate: oneMonthAgo.toISOString().split('T')[0], endDate };
      case '2m':
        const twoMonthsAgo = new Date(now);
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
        return { startDate: twoMonthsAgo.toISOString().split('T')[0], endDate };
      case '6m':
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return { startDate: sixMonthsAgo.toISOString().split('T')[0], endDate };
      case '1y':
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        return { startDate: oneYearAgo.toISOString().split('T')[0], endDate };
      default:
        return { startDate: null, endDate: null };
    }
  };

  // Calculate stats from local bills data
  const calculateStatsFromBills = (billsData, currentSelectedShop = selectedShop, currentSearchTerm = searchTerm, currentFilterDateRange = filterDateRange) => {
    console.log('🔍 Calculating GST stats from bills data:', billsData.length, 'bills');
    
    let filteredBills = billsData;
    
    // Filter by selected shop if any
    if (currentSelectedShop && currentSelectedShop !== '') {
      const selectedShopName = shops.find(s => s._id === currentSelectedShop)?.name;
      filteredBills = billsData.filter(bill => bill.shopName === selectedShopName);
      console.log('🔍 Filtered bills for shop:', selectedShopName, '=', filteredBills.length);
    } else {
      console.log('🔍 No shop selected - showing all bills:', billsData.length);
    }
    
    // Filter by search term if any
    if (currentSearchTerm) {
      filteredBills = filteredBills.filter(bill => 
        bill.invoiceNumber.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        bill.shopName.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        bill.customerName.toLowerCase().includes(currentSearchTerm.toLowerCase())
      );
      console.log('🔍 Filtered bills by search term:', currentSearchTerm, '=', filteredBills.length);
    }
    
    // Filter by date range if selected
    if (currentFilterDateRange) {
      const { startDate, endDate } = getDateRange(currentFilterDateRange);
      if (startDate && endDate) {
        filteredBills = filteredBills.filter(bill => {
          const billDate = new Date(bill.invoiceDate);
          return billDate >= new Date(startDate) && billDate <= new Date(endDate);
        });
        console.log('🔍 Filtered bills by date range:', filteredBills.length);
      }
    }
    
    // Calculate totals from all bills
    const totalBills = filteredBills.length;
    const totalAmount = roundCurrency(filteredBills.reduce((sum, bill) => {
      const amount = bill.grandTotal || 0;
      return sum + amount;
    }, 0));
    
    const totalGST = roundCurrency(filteredBills.reduce((sum, bill) => {
      const gst = bill.gstAmount || 0;
      return sum + gst;
    }, 0));
    
    const netAmount = roundCurrency(filteredBills.reduce((sum, bill) => {
      const net = bill.netAmount || 0;
      return sum + net;
    }, 0));
    
    console.log('📊 Final calculated GST stats:', {
      totalBills,
      totalAmount,
      totalGST,
      netAmount
    });
    
    return {
      totalBills,
      totalAmount,
      totalGST,
      netAmount
    };
  };

  // Fetch GST bill statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token for stats API:', token ? 'Present' : 'Missing');
      
      const params = new URLSearchParams();
      if (selectedShop) params.append('shopId', selectedShop);
      
      if (filterDateRange) {
        const { startDate, endDate } = getDateRange(filterDateRange);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      }

      const apiUrl = `http://localhost:5000/api/gst-bills/stats?${params}`;
      console.log('🔗 Stats API URL:', apiUrl);
      console.log('📋 Stats Query Parameters:', params.toString());

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Stats API Response Status:', response.status);
      console.log('📡 Stats API Response OK:', response.ok);
      
      const data = await response.json();
      console.log('📊 Stats API Raw Response:', data);
      
      if (response.status === 401) {
        console.error('❌ Authentication failed:', data.message);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login/seller');
        return;
      }
      
      if (data.success && data.data?.overview) {
        console.log('✅ GST Stats data extracted:', data.data.overview);
        console.log('✅ Stats details:', {
          totalBills: data.data.overview.totalBills,
          totalAmount: data.data.overview.totalAmount,
          totalGST: data.data.overview.totalGST,
          netAmount: data.data.overview.netAmount
        });
        setStats(data.data.overview);
      } else {
        console.log('⚠️ API stats failed, calculating from local bills data');
        const calculatedStats = calculateStatsFromBills(gstBills);
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching GST stats:', error);
      console.log('⚠️ Stats API error, calculating from local bills data');
      const calculatedStats = calculateStatsFromBills(gstBills);
      setStats(calculatedStats);
    }
  };

  // Recalculate stats whenever bills, selectedShop, searchTerm, or filterDateRange changes
  useEffect(() => {
    if (gstBills.length > 0) {
      console.log('🔄 Recalculating GST stats due to bills, shop, search, or date change...');
      console.log('🔍 Current selected shop:', selectedShop);
      console.log('🔍 Current search term:', searchTerm);
      console.log('🔍 Current date range:', filterDateRange);
      console.log('🔍 Current bills count:', gstBills.length);
      
      const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, searchTerm, filterDateRange);
      setStats(calculatedStats);
      
      console.log('📊 Updated GST stats:', calculatedStats);
    }
  }, [gstBills, selectedShop, searchTerm, filterDateRange]);

  const handleSaveGSTBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to create a GST bill');
      }
      
      console.log('🔍 Creating GST bill with data:', billData);
      
      const response = await fetch('http://localhost:5000/api/gst-bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      console.log('🔍 GST Bill creation response status:', response.status);
      const data = await response.json();
      console.log('🔍 GST Bill creation response data:', data);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 500) {
        console.error('❌ Server error:', data);
        throw new Error('Server error: ' + (data.message || 'Internal server error'));
      }
      
      if (data.success) {
        console.log('✅ GST Bill created successfully');
        fetchGSTBills();
        fetchStats();
        alert('GST Bill created successfully!');
      } else {
        console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to create GST bill');
      }
    } catch (error) {
      console.error('❌ Error saving GST bill:', error);
      throw error;
    }
  };

  const handleViewGSTBill = (bill) => {
    setSelectedBill(bill);
    setShowGSTBillViewModal(true);
  };

  const handleEditGSTBill = (bill) => {
    setSelectedBill(bill);
    setShowGSTBillViewModal(false);
    setShowEditGSTBillForm(true);
  };

  const handleUpdateGSTBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to update a GST bill');
      }
      
      console.log('🔍 Updating GST bill with data:', billData);
      
      const response = await fetch(`http://localhost:5000/api/gst-bills/${selectedBill._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      console.log('🔍 GST Bill update response status:', response.status);
      const data = await response.json();
      console.log('🔍 GST Bill update response data:', data);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 500) {
        console.error('❌ Server error:', data);
        throw new Error('Server error: ' + (data.message || 'Internal server error'));
      }
      
      if (data.success) {
        console.log('✅ GST Bill updated successfully');
        fetchGSTBills();
        fetchStats();
        alert('GST Bill updated successfully!');
      } else {
        console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to update GST bill');
      }
    } catch (error) {
      console.error('❌ Error updating GST bill:', error);
      throw error;
    }
  };

  const handleDeleteGSTBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this GST bill?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/gst-bills/${billId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          fetchGSTBills();
          fetchStats();
          alert('GST Bill deleted successfully!');
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error deleting GST bill:', error);
        alert('Error deleting GST bill');
      }
    }
  };

  const formatCurrency = (amount) => {
    const roundedAmount = Math.round((amount + Number.EPSILON) * 100) / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(roundedAmount);
  };

  const roundCurrency = (amount) => {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST Bill Management</h1>
          {/* <p className="text-gray-600">Manage your GST bills and invoices</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Shops loaded: {shops.length}</p>
            <p>GST Bills loaded: {gstBills.length}</p>
            <p>Stats: Total {formatCurrency(stats.totalAmount)} | GST {formatCurrency(stats.totalGST)} | Net {formatCurrency(stats.netAmount)}</p>
            <p className="text-xs text-blue-600">
              {gstBills.length === 0 ? 'No data found' : 'Data loaded from database'}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedShop && selectedShop !== '') || searchTerm || filterDateRange ? 
                `Showing filtered results (${stats.totalBills} bills)` : 
                `Showing all results (${stats.totalBills} bills)`
              }
            </p>
          </div> */}
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              console.log('🔄 Refreshing all GST data from database...');
              await fetchShops();
              await fetchGSTBills();
              await fetchStats();
            }}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => setShowContacts(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-4 h-4" />
            Contacts
          </button>
          <button
            onClick={() => setShowAnalyticsDashboard(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setShowInvoiceTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Templates
          </button>
          <button
            onClick={() => setShowAddGSTBillForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add GST Bill
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total GST Bills {selectedShop && selectedShop !== '' ? `(${shops.find(s => s._id === selectedShop)?.name || 'Selected Shop'})` : '(All Shops)'}
              </p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total GST</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalGST)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Amount</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.netAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop</label>
            <select
              value={selectedShop}
              onChange={(e) => {
                console.log('🏪 Shop changed to:', e.target.value);
                setSelectedShop(e.target.value);
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, e.target.value, searchTerm, filterDateRange);
                    setStats(calculatedStats);
                    console.log('📊 Stats updated for shop change:', calculatedStats);
                  }, 100);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={shopsLoading}
            >
              <option value="">
                {shopsLoading ? 'Loading shops...' : `All Shops (${shops.length})`}
              </option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>
                  {shop.name} - {(shop.street||'')}{shop.city?`, ${shop.city}`:''}{shop.stateName?`, ${shop.stateName}`:''}
                </option>
              ))}
            </select>
            {shops.length === 0 && !shopsLoading && (
              <p className="text-sm text-red-500 mt-1">No shops found. Add a shop first.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={filterDateRange}
              onChange={(e) => {
                console.log('📅 Date range changed to:', e.target.value);
                setFilterDateRange(e.target.value);
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, searchTerm, e.target.value);
                    setStats(calculatedStats);
                    console.log('📊 Stats updated for date range change:', calculatedStats);
                  }, 100);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Time</option>
              <option value="1d">Last 1 Day</option>
              <option value="3d">Last 3 Days</option>
              <option value="1w">Last 1 Week</option>
              <option value="15d">Last 15 Days</option>
              <option value="1m">Last 1 Month</option>
              <option value="2m">Last 2 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search GST bills..."
                value={searchTerm}
                onChange={(e) => {
                  console.log('🔍 Search term changed to:', e.target.value);
                  setSearchTerm(e.target.value);
                  
                  if (gstBills.length > 0) {
                    setTimeout(() => {
                      const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, e.target.value, filterDateRange);
                      setStats(calculatedStats);
                      console.log('📊 Stats updated for search term change:', calculatedStats);
                    }, 100);
                  }
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                console.log('🧹 Clearing all filters');
                setSelectedShop('');
                setSearchTerm('');
                setFilterDateRange('');
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, '', '', '');
                    setStats(calculatedStats);
                    console.log('📊 Stats updated after clearing filters:', calculatedStats);
                  }, 100);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* GST Bills Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">GST Bills</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading GST bills...</p>
            </div>
          </div>
        ) : gstBills.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No GST bills found</p>
            <p className="text-sm text-gray-400">Create your first GST bill to get started</p>
          </div>
        ) : (() => {
          // Filter bills based on selected shop and search term
          let filteredBills = gstBills;
          
          // Filter by selected shop (only if a shop is actually selected)
          if (selectedShop && selectedShop !== '') {
            const selectedShopName = shops.find(s => s._id === selectedShop)?.name;
            filteredBills = gstBills.filter(bill => bill.shopName === selectedShopName);
          }
          
          // Filter by search term
          if (searchTerm) {
            filteredBills = filteredBills.filter(bill => 
              bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bill.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bill.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          // Filter by date range
          if (filterDateRange) {
            const { startDate, endDate } = getDateRange(filterDateRange);
            if (startDate && endDate) {
              filteredBills = filteredBills.filter(bill => {
                const billDate = new Date(bill.invoiceDate);
                return billDate >= new Date(startDate) && billDate <= new Date(endDate);
              });
            }
          }
          
          console.log('🔍 Filtered GST bills:', {
            selectedShop,
            searchTerm,
            filterDateRange,
            originalCount: gstBills.length,
            filteredCount: filteredBills.length,
            filteredBills: filteredBills.map(b => ({ id: b._id, shop: b.shopName, amount: b.grandTotal }))
          });
          
          if (filteredBills.length === 0) {
            return (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No GST bills found</p>
                <p className="text-sm text-gray-400">
                  {selectedShop ? 'No GST bills found for selected shop' : 'Try adjusting your filters'}
                </p>
              </div>
            );
          }
          
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bill.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.shopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(bill.invoiceDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bill.netAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bill.gstAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bill.grandTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewGSTBill(bill)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View GST Bill"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditGSTBill(bill)}
                          className="text-green-600 hover:text-green-900"
                          title="Edit GST Bill"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => window.print()}
                          className="text-purple-600 hover:text-purple-900"
                          title="Print GST Bill"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteGSTBill(bill._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete GST Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      {/* Modals */}
      {showAddGSTBillForm && (
        <AddGSTBillForm
          onClose={() => setShowAddGSTBillForm(false)}
          onSave={handleSaveGSTBill}
          shops={shops}
        />
      )}

      {showGSTBillViewModal && (
        <GSTBillViewModal
          bill={selectedBill}
          isOpen={showGSTBillViewModal}
          onClose={() => {
            setShowGSTBillViewModal(false);
            setSelectedBill(null);
          }}
          onEdit={handleEditGSTBill}
          onDelete={handleDeleteGSTBill}
        />
      )}

      {showEditGSTBillForm && (
        <EditGSTBillForm
          bill={selectedBill}
          onClose={() => {
            setShowEditGSTBillForm(false);
            setSelectedBill(null);
          }}
          onSave={handleUpdateGSTBill}
          shops={shops}
        />
      )}

      {showInvoiceTemplates && (
        <InvoiceTemplates
          onClose={() => setShowInvoiceTemplates(false)}
          onSelectTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
        />
      )}

      {showAnalyticsDashboard && (
        <AnalyticsDashboard
          onClose={() => setShowAnalyticsDashboard(false)}
          bills={gstBills}
        />
      )}

      {showContacts && (
        <ContactsManager isOpen={showContacts} onClose={()=>setShowContacts(false)} />
      )}
    </div>
  );
};

export default GSTBillManagementPage;