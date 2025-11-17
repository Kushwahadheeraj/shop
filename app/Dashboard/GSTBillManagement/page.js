"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, DollarSign, Building2, CreditCard, History, Receipt, X, FileText, Printer, BarChart3, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import AddGSTBillForm from './AddGSTBillForm';
import GSTBillViewModal from './GSTBillViewModal';
import EditGSTBillForm from './EditGSTBillForm';
import InvoiceTemplates from './components/InvoiceTemplates';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContactsManager from './components/ContactsManager';
import API_BASE_URL from '@/lib/apiConfig';

const GSTBillManagementPage = () => {
  // Backend helpers
  const join = (base, path) => `${base.replace(/\/$/, '')}${path}`;
  const api = (path) => join(API_BASE_URL, path);
  
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

  // Helper to derive start/end dates from a named range
  const getDateRange = (range) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    switch (range) {
      case 'today':
        return { startDate: endDate, endDate };
      case 'yesterday':
        {
          const d = new Date(now);
          d.setDate(d.getDate() - 1);
          const y = d.toISOString().split('T')[0];
          return { startDate: y, endDate: y };
        }
      case 'thisWeek':
        {
          const start = new Date(now);
          start.setDate(now.getDate() - now.getDay());
          return { startDate: start.toISOString().split('T')[0], endDate };
        }
      case 'thisMonth':
        {
          const start = new Date(now.getFullYear(), now.getMonth(), 1);
          return { startDate: start.toISOString().split('T')[0], endDate };
        }
      case 'lastMonth':
        {
          const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const end = new Date(now.getFullYear(), now.getMonth(), 0);
          return { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0] };
        }
      case 'thisYear':
        {
          const start = new Date(now.getFullYear(), 0, 1);
          return { startDate: start.toISOString().split('T')[0], endDate };
        }
      default:
        return { startDate: null, endDate: null };
    }
  };

  // Fetch shops
  const fetchShops = useCallback(async () => {
    try {
      setShopsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(`${API_BASE_URL}/shops`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        // Best-effort logging
        try { const err = await res.json(); /* console.error('❌ Shops API error:', err); */ } catch {}
        return;
      }
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        setShops(data.data);
      } else if (data?.success && data?.data?.shops) {
        setShops(data.data.shops);
      }
    } catch (e) {
      // console.error('❌ Error fetching shops:', e);
    } finally {
      setShopsLoading(false);
    }
  }, []);

  // Fetch GST bills
  const fetchGSTBills = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const params = new URLSearchParams();
      if (selectedShop) params.append('shopId', selectedShop);
      if (searchTerm) params.append('search', searchTerm);
      if (filterDateRange) {
        const dr = getDateRange(filterDateRange);
        if (dr.startDate) params.append('startDate', dr.startDate);
        if (dr.endDate) params.append('endDate', dr.endDate);
      }
      const res = await fetch(api(`/gst-bills?${params.toString()}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) {
        try { const err = await res.json(); /* console.error('❌ GST bills API error:', err); */ } catch {}
        return;
      }
      const data = await res.json();
      // console.log('📊 GST Bills API response:', data);
      
      // Backend returns: { success: true, data: { gstBills: [...], stats: {...} } }
      if (data?.success && data?.data) {
        if (Array.isArray(data.data.gstBills)) {
          setGstBills(data.data.gstBills);
          // console.log('✅ GST Bills set:', data.data.gstBills.length, 'bills');
        } else if (Array.isArray(data.data)) {
          // Fallback: if data.data is directly an array
          setGstBills(data.data);
          // console.log('✅ GST Bills set (direct array):', data.data.length, 'bills');
        } else if (Array.isArray(data.bills)) {
          // Another fallback
          setGstBills(data.bills);
          // console.log('✅ GST Bills set (from bills field):', data.bills.length, 'bills');
        } else {
          // console.warn('⚠️ No bills array found in response:', data);
          setGstBills([]);
        }
      } else {
        // console.warn('⚠️ Unexpected GST bills response format:', data);
        setGstBills([]);
      }
    } catch (e) {
      // console.error('❌ Error fetching GST bills:', e);
      setGstBills([]);
    } finally {
      setLoading(false);
    }
  }, [selectedShop, searchTerm, filterDateRange]);

  // Calculate stats from bills data
  const calculateStatsFromBills = useCallback((billsData, currentSelectedShop = selectedShop, currentSearchTerm = searchTerm, currentFilterDateRange = filterDateRange) => {
    const safeBills = Array.isArray(billsData) ? billsData : [];
    // console.log('🔍 Calculating stats from bills data:', safeBills.length, 'bills');
    
    let filteredBills = safeBills;
    
    // Filter by selected shop if any
    if (currentSelectedShop && currentSelectedShop !== '') {
      const selectedShopObj = shops.find(s => String(s?._id || s?.id || '') === String(currentSelectedShop));
      const selectedShopName = selectedShopObj?.name;
      if (selectedShopName) {
        filteredBills = filteredBills.filter(bill => bill.shopName === selectedShopName);
      }
    }
    
    // Filter by search term
    if (currentSearchTerm && currentSearchTerm !== '') {
      filteredBills = filteredBills.filter(bill => 
        (bill.invoiceNumber || '').toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        (bill.shopName || '').toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        (bill.customerName || '').toLowerCase().includes(currentSearchTerm.toLowerCase())
      );
    }
    
    // Filter by date range
    if (currentFilterDateRange && currentFilterDateRange !== '') {
      const { startDate, endDate } = getDateRange(currentFilterDateRange);
      if (startDate && endDate) {
        filteredBills = filteredBills.filter(bill => {
          const billDate = new Date(bill.invoiceDate);
          return billDate >= new Date(startDate) && billDate <= new Date(endDate);
        });
      }
    }
    
    // Calculate stats
    const totalBills = filteredBills.length;
    const totalAmount = filteredBills.reduce((sum, bill) => sum + (parseFloat(bill.grandTotal) || 0), 0);
    const totalGST = filteredBills.reduce((sum, bill) => sum + (parseFloat(bill.gstAmount) || 0), 0);
    const netAmount = filteredBills.reduce((sum, bill) => sum + (parseFloat(bill.netAmount) || 0), 0);
    
    return {
      totalBills,
      totalAmount: isNaN(totalAmount) ? 0 : totalAmount,
      totalGST: isNaN(totalGST) ? 0 : totalGST,
      netAmount: isNaN(netAmount) ? 0 : netAmount
    };
  }, [selectedShop, searchTerm, filterDateRange, shops]);

  // Fetch stats (fallback to local calculation if API fails)
  const fetchStats = useCallback(async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const params = new URLSearchParams();
      if (selectedShop) params.append('shopId', selectedShop);
      if (searchTerm) params.append('search', searchTerm);
      if (filterDateRange) {
        const dr = getDateRange(filterDateRange);
        if (dr.startDate) params.append('startDate', dr.startDate);
        if (dr.endDate) params.append('endDate', dr.endDate);
      }
      const res = await fetch(api(`/gst-bills/stats?${params.toString()}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data?.data) {
          setStats(data.data);
          return;
        }
      }
      // Fallback to local calculation
      const calculated = calculateStatsFromBills(gstBills, selectedShop, searchTerm, filterDateRange);
      setStats(calculated);
    } catch (e) {
      // console.error('❌ Error fetching stats:', e);
      // Fallback to local calculation
      const calculated = calculateStatsFromBills(gstBills, selectedShop, searchTerm, filterDateRange);
      setStats(calculated);
    }
  }, [selectedShop, searchTerm, filterDateRange, gstBills, calculateStatsFromBills]);

  // Load real data from database
  useEffect(() => {
    const loadRealData = async () => {
      // console.log('🔄 Loading GST bills data from database...');
      
      try {
        // console.log('📊 Fetching shops...');
        await fetchShops();
        
        // console.log('📊 Fetching GST bills...');
        await fetchGSTBills();
        
        // console.log('✅ Initial data loaded successfully!');
      } catch (error) {
        // console.error('❌ Error loading data:', error);
        // console.error('❌ Error details:', error.message);
        // console.error('❌ Error stack:', error.stack);
      }
    };
    
    loadRealData();
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    if (!loading) {
      fetchGSTBills();
    }
  }, [selectedShop, searchTerm, filterDateRange]);

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

  // Recalculate stats whenever bills, selectedShop, searchTerm, or filterDateRange changes
  useEffect(() => {
    if (gstBills.length > 0 || shops.length > 0) {
      // console.log('🔄 Recalculating GST stats due to bills, shop, search, or date change...');
      // console.log('🔍 Current selected shop:', selectedShop);
      // console.log('🔍 Current search term:', searchTerm);
      // console.log('🔍 Current date range:', filterDateRange);
      // console.log('🔍 Current bills count:', gstBills.length);
      
      const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, searchTerm, filterDateRange);
      setStats(calculatedStats);
      
      // console.log('📊 Updated GST stats:', calculatedStats);
    } else if (gstBills.length === 0) {
      // Reset stats when no bills
      setStats({
        totalBills: 0,
        totalAmount: 0,
        totalGST: 0,
        netAmount: 0
      });
    }
  }, [gstBills, selectedShop, searchTerm, filterDateRange, shops, calculateStatsFromBills]);

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


  const handleSaveGSTBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to create a GST bill');
      }
      
      // console.log('🔍 Creating GST bill with data:', billData);
      
      const response = await fetch(api('/gst-bills'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      // console.log('🔍 GST Bill creation response status:', response.status);
      const data = await response.json();
      // console.log('🔍 GST Bill creation response data:', data);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 500) {
        // console.error('❌ Server error:', data);
        throw new Error('Server error: ' + (data.message || 'Internal server error'));
      }
      
      if (data.success) {
        // console.log('✅ GST Bill created successfully');
        fetchGSTBills();
        fetchStats();
        alert('GST Bill created successfully!');
      } else {
        // console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to create GST bill');
      }
    } catch (error) {
      // console.error('❌ Error saving GST bill:', error);
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
      
      // console.log('🔍 Updating GST bill with data:', billData);
      
      const response = await fetch(api(`/gst-bills/${selectedBill._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      // console.log('🔍 GST Bill update response status:', response.status);
      const data = await response.json();
      // console.log('🔍 GST Bill update response data:', data);
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 500) {
        // console.error('❌ Server error:', data);
        throw new Error('Server error: ' + (data.message || 'Internal server error'));
      }
      
      if (data.success) {
        // console.log('✅ GST Bill updated successfully');
        fetchGSTBills();
        fetchStats();
        alert('GST Bill updated successfully!');
      } else {
        // console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to update GST bill');
      }
    } catch (error) {
      // console.error('❌ Error updating GST bill:', error);
      throw error;
    }
  };

  const handleDeleteGSTBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this GST bill?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(api(`/gst-bills/${billId}`), {
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
        // console.error('Error deleting GST bill:', error);
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
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">GST Bill Management</h1>
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
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={async () => {
              // console.log('🔄 Refreshing all GST data from database...');
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop</label>
            <select
              value={selectedShop}
              onChange={(e) => {
                // console.log('🏪 Shop changed to:', e.target.value);
                setSelectedShop(e.target.value);
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, e.target.value, searchTerm, filterDateRange);
                    setStats(calculatedStats);
                    // console.log('📊 Stats updated for shop change:', calculatedStats);
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
                // console.log('📅 Date range changed to:', e.target.value);
                setFilterDateRange(e.target.value);
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, searchTerm, e.target.value);
                    setStats(calculatedStats);
                    // console.log('📊 Stats updated for date range change:', calculatedStats);
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
                  // console.log('🔍 Search term changed to:', e.target.value);
                  setSearchTerm(e.target.value);
                  
                  if (gstBills.length > 0) {
                    setTimeout(() => {
                      const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, e.target.value, filterDateRange);
                      setStats(calculatedStats);
                      // console.log('📊 Stats updated for search term change:', calculatedStats);
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
                // console.log('🧹 Clearing all filters');
                setSelectedShop('');
                setSearchTerm('');
                setFilterDateRange('');
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, '', '', '');
                    setStats(calculatedStats);
                    // console.log('📊 Stats updated after clearing filters:', calculatedStats);
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
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200">
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
          
          // console.log('🔍 Filtered GST bills:', {
          //   selectedShop,
          //   searchTerm,
          //   filterDateRange,
          //   originalCount: gstBills.length,
          //   filteredCount: filteredBills.length,
          //   filteredBills: filteredBills.map(b => ({ id: b._id, shop: b.shopName, amount: b.grandTotal }))
          // });
          
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
              <table className="w-full text-xs sm:text-sm">
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