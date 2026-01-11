"use client";

import React, { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2, DollarSign, FileText, Printer, BarChart3, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import AddGSTBillForm from './AddGSTBillForm';
import GSTBillViewModal from './GSTBillViewModal';
import EditGSTBillForm from './EditGSTBillForm';
import API_BASE_URL from '@/lib/apiConfig';
import { useDebounce } from '@/lib/useDebounce';

// Lazy load heavy components to avoid webpack issues
const InvoiceTemplates = lazy(() => import('./components/InvoiceTemplates'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const ContactsManager = lazy(() => import('./components/ContactsManager'));

const GSTBillManagementPage = () => {
  const router = useRouter();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  
  // Memoized backend helpers - prevent recreation on every render
  const api = useCallback((path) => {
    const base = API_BASE_URL.replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }, []);
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
  
  // Debounce search to reduce filter operations (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    totalGST: 0,
    netAmount: 0
  });

  // Memoized date range helper - cache results for same range
  const getDateRange = useCallback((range) => {
    if (!range) return { startDate: null, endDate: null };
    
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    const toDate = (d) => d.toISOString().split('T')[0];
    
    const ranges = {
      today: { startDate: endDate, endDate },
      yesterday: (() => { const d = new Date(now); d.setDate(d.getDate() - 1); const y = toDate(d); return { startDate: y, endDate: y }; })(),
      thisWeek: (() => { const start = new Date(now); start.setDate(now.getDate() - now.getDay()); return { startDate: toDate(start), endDate }; })(),
      thisMonth: (() => { const start = new Date(now.getFullYear(), now.getMonth(), 1); return { startDate: toDate(start), endDate }; })(),
      lastMonth: (() => { const start = new Date(now.getFullYear(), now.getMonth() - 1, 1); const end = new Date(now.getFullYear(), now.getMonth(), 0); return { startDate: toDate(start), endDate: toDate(end) }; })(),
      thisYear: (() => { const start = new Date(now.getFullYear(), 0, 1); return { startDate: toDate(start), endDate }; })()
    };
    
    return ranges[range] || { startDate: null, endDate: null };
  }, []);

  // Memoized format functions - prevent recreation on every render
  const formatCurrency = useCallback((amount) => {
    const rounded = Math.round((parseFloat(amount || 0) + Number.EPSILON) * 100) / 100;
    return `₹${rounded.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('en-IN');
    } catch {
      return '';
    }
  }, []);

  // Fetch shops - Include both GST shops and Clients (client list me jo names hain)
  const fetchShops = useCallback(async () => {
    try {
      setShopsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      // Fetch both GST shops and Clients in parallel - OPTIMIZED
      const [gstShopsRes, clientsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/gst-shops`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/clients`, { headers }).catch(() => null)
      ]);
      
      // Process responses in parallel - OPTIMIZED
      const [gstShopsData, clientsData] = await Promise.all([
        gstShopsRes?.ok ? gstShopsRes.json().catch(() => null) : null,
        clientsRes?.ok ? clientsRes.json().catch(() => null) : null
      ]);
      
      const allShops = [];
      const shopMap = new Map(); // Use Map for O(1) duplicate removal
      
      // Process GST shops
      if (gstShopsData?.success && Array.isArray(gstShopsData.data)) {
        gstShopsData.data.forEach(shop => {
          const id = shop._id || shop.id;
          if (id && !shopMap.has(id)) {
            shopMap.set(id, {
              _id: id,
              id,
              name: shop.name || shop.businessName || shop.shopName,
              ...shop
            });
          }
        });
      }
      
      // Process Clients as shops
      const clients = clientsData?.data?.clients || clientsData?.data || (Array.isArray(clientsData) ? clientsData : []);
      if (Array.isArray(clients)) {
        clients.forEach(client => {
          const id = client._id || client.id;
          if (id && !shopMap.has(id)) {
            shopMap.set(id, {
              _id: id,
              id,
              name: client.name || client.businessName || '',
              isClient: true,
              ...client
            });
          }
        });
      }
      
      setShops(Array.from(shopMap.values()));
    } catch (e) {
      // console.error('❌ Error fetching shops:', e);
      setShops([]);
    } finally {
      setShopsLoading(false);
    }
  }, []);

  // Fetch GST bills - ALWAYS filter by shop to ensure shop-wise isolation
  const fetchGSTBills = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const params = new URLSearchParams();
      
      // CRITICAL: Always require shopId for shop-wise data isolation
      if (!selectedShop) {
        // If no shop selected, don't fetch any bills (or select first shop)
        if (shops.length > 0) {
          const firstShopId = shops[0]._id || shops[0].id;
          setSelectedShop(firstShopId);
          params.append('shopId', firstShopId);
        } else {
          setGstBills([]);
          setLoading(false);
          return;
        }
      } else {
        params.append('shopId', selectedShop);
      }
      
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
      
      // Optimized response parsing - single pass
      const bills = data?.success && data?.data 
        ? (Array.isArray(data.data.gstBills) ? data.data.gstBills : 
           Array.isArray(data.data) ? data.data : 
           Array.isArray(data.bills) ? data.bills : [])
        : [];
      
      setGstBills(bills);
    } catch (e) {
      // console.error('❌ Error fetching GST bills:', e);
      setGstBills([]);
    } finally {
      setLoading(false);
    }
  }, [selectedShop, debouncedSearchTerm, filterDateRange, shops, api, getDateRange]);

  // Memoize shop lookup to avoid repeated find operations
  const selectedShopName = useMemo(() => {
    if (!selectedShop) return null;
    const shop = shops.find(s => String(s?._id || s?.id || '') === String(selectedShop));
    return shop?.name || null;
  }, [selectedShop, shops]);

  // Calculate stats from bills data - OPTIMIZED with early returns and single pass
  const calculateStatsFromBills = useCallback((billsData, currentSelectedShop = selectedShop, currentSearchTerm = debouncedSearchTerm, currentFilterDateRange = filterDateRange) => {
    const safeBills = Array.isArray(billsData) ? billsData : [];
    if (safeBills.length === 0) {
      return { totalBills: 0, totalAmount: 0, totalGST: 0, netAmount: 0 };
    }
    
    // Early return if no filters
    if (!currentSelectedShop && !currentSearchTerm && !currentFilterDateRange) {
      const totalAmount = safeBills.reduce((sum, bill) => sum + (parseFloat(bill.grandTotal) || 0), 0);
      const totalGST = safeBills.reduce((sum, bill) => sum + (parseFloat(bill.gstAmount) || 0), 0);
      const netAmount = safeBills.reduce((sum, bill) => sum + (parseFloat(bill.netAmount) || 0), 0);
      return {
        totalBills: safeBills.length,
        totalAmount: isNaN(totalAmount) ? 0 : totalAmount,
        totalGST: isNaN(totalGST) ? 0 : totalGST,
        netAmount: isNaN(netAmount) ? 0 : netAmount
      };
    }
    
    // Pre-compute filter values once
    const shopName = currentSelectedShop ? selectedShopName : null;
    const searchLower = currentSearchTerm ? currentSearchTerm.toLowerCase() : '';
    const dateRange = currentFilterDateRange ? getDateRange(currentFilterDateRange) : null;
    const startDate = dateRange?.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : null;
    
    // Single pass filter with early returns - O(n) complexity
    let totalBills = 0;
    let totalAmount = 0;
    let totalGST = 0;
    let netAmount = 0;
    
    for (const bill of safeBills) {
      // Shop filter - early return
      if (shopName && bill.shopName !== shopName) continue;
      
      // Search filter - early return
      if (searchLower) {
        const customerName = (bill.customerName || '').toLowerCase();
        const invoiceNumber = (bill.invoiceNumber || '').toLowerCase();
        const billShopName = (bill.shopName || '').toLowerCase();
        
        if (!customerName.includes(searchLower) && 
            !invoiceNumber.includes(searchLower) && 
            !billShopName.includes(searchLower)) {
          continue;
        }
      }
      
      // Date filter - early return
      if (startDate && endDate) {
        const billDate = new Date(bill.invoiceDate);
        if (billDate < startDate || billDate > endDate) continue;
      }
      
      // Calculate stats in single pass
      totalBills++;
      totalAmount += parseFloat(bill.grandTotal) || 0;
      totalGST += parseFloat(bill.gstAmount) || 0;
      netAmount += parseFloat(bill.netAmount) || 0;
    }
    
    return {
      totalBills,
      totalAmount: isNaN(totalAmount) ? 0 : totalAmount,
      totalGST: isNaN(totalGST) ? 0 : totalGST,
      netAmount: isNaN(netAmount) ? 0 : netAmount
    };
  }, [selectedShop, debouncedSearchTerm, filterDateRange, shops, selectedShopName]);

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
      const calculated = calculateStatsFromBills(gstBills, selectedShop, debouncedSearchTerm, filterDateRange);
      setStats(calculated);
    } catch (e) {
      // console.error('❌ Error fetching stats:', e);
      // Fallback to local calculation
      const calculated = calculateStatsFromBills(gstBills, selectedShop, debouncedSearchTerm, filterDateRange);
      setStats(calculated);
    }
  }, [selectedShop, debouncedSearchTerm, filterDateRange, gstBills, calculateStatsFromBills]);

  // Load real data from database
  useEffect(() => {
    const loadRealData = async () => {
      // console.log('🔄 Loading GST bills data from database...');
      
      try {
        // console.log('📊 Fetching shops...');
        await fetchShops();
        
        // Set default shop selection - first shop if available
        if (shops.length > 0 && !selectedShop) {
          setSelectedShop(shops[0]._id || shops[0].id);
        }
        
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

  // Auto-select first shop when shops are loaded
  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0]._id || shops[0].id);
    }
  }, [shops, selectedShop]);

  // Refetch data when filters change
  useEffect(() => {
    if (!loading) {
      fetchGSTBills();
    }
  }, [selectedShop, debouncedSearchTerm, filterDateRange, shops]);

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

  // Memoize filtered bills to avoid recalculating on every render
  const filteredBills = useMemo(() => {
    if (gstBills.length === 0) return [];
    
    // Early return if no filters
    if (!selectedShop && !debouncedSearchTerm && !filterDateRange) {
      return gstBills;
    }
    
    // Pre-compute filter values once
    const shopName = selectedShopName;
    const searchLower = debouncedSearchTerm ? debouncedSearchTerm.toLowerCase() : '';
    const dateRange = filterDateRange ? getDateRange(filterDateRange) : null;
    const startDate = dateRange?.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange?.endDate ? new Date(dateRange.endDate) : null;
    
    // Single pass filter - O(n) complexity with early returns
    return gstBills.filter(bill => {
      // Shop filter - early return
      if (shopName && bill.shopName !== shopName) return false;
      
      // Search filter - early return
      if (searchLower) {
        const customerName = (bill.customerName || '').toLowerCase();
        const invoiceNumber = (bill.invoiceNumber || '').toLowerCase();
        const billShopName = (bill.shopName || '').toLowerCase();
        
        if (!customerName.includes(searchLower) && 
            !invoiceNumber.includes(searchLower) && 
            !billShopName.includes(searchLower)) {
          return false;
        }
      }
      
      // Date filter - early return
      if (startDate && endDate) {
        const billDate = new Date(bill.invoiceDate);
        if (billDate < startDate || billDate > endDate) return false;
      }
      
      return true;
    });
  }, [gstBills, selectedShop, selectedShopName, debouncedSearchTerm, filterDateRange]);

  // Recalculate stats whenever filtered bills change - OPTIMIZED
  useEffect(() => {
    if (filteredBills.length > 0) {
      const calculatedStats = calculateStatsFromBills(gstBills, selectedShop, debouncedSearchTerm, filterDateRange);
      setStats(calculatedStats);
    } else {
      setStats({
        totalBills: 0,
        totalAmount: 0,
        totalGST: 0,
        netAmount: 0
      });
    }
  }, [filteredBills.length, calculateStatsFromBills, gstBills, selectedShop, debouncedSearchTerm, filterDateRange]);

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
        // Refresh shops list to include any new shops added in client bill
        fetchShops();
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
        // Refresh shops list to include any new shops added in client bill
        fetchShops();
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
          await fetchGSTBills(); // Wait for refresh
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



  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
      {/* Header / Hero */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-5 sm:p-6 lg:p-7 text-white shadow-xl border border-amber-300/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2.5 rounded-xl">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                GST Invoice
              </h1>
            </div>
            <p className="text-sm sm:text-base text-amber-50/90 max-w-2xl">
              GST बिल बनाएं, टेम्पलेट चुनें, एनालिटिक्स देखें, और संपर्कों को प्रबंधित करें।
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <button
              onClick={async () => {
                await fetchShops();
                await fetchGSTBills();
                await fetchStats();
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white/15 hover:bg-white/25 border border-white/30 rounded-xl transition-all duration-200 shadow-md"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={() => setShowContacts(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-200 shadow-md"
            >
              <Users className="w-4 h-4" />
              Contacts
            </button>
            <button
              onClick={() => setShowAnalyticsDashboard(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-200 shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setShowInvoiceTemplates(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-white text-amber-700 rounded-xl hover:bg-amber-50 transition-all duration-200 shadow-md"
            >
              <FileText className="w-4 h-4" />
              Templates
            </button>
            <button
              onClick={() => setShowAddGSTBillForm(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold bg-gradient-to-r from-amber-100 via-white to-amber-50 text-amber-700 rounded-xl hover:from-white hover:to-white transition-all duration-200 shadow-lg shadow-amber-400/40"
            >
              <Plus className="w-4 h-4" />
              Add GST Bill
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Total GST Bills {selectedShop && selectedShop !== '' ? `(${shops.find(s => s._id === selectedShop)?.name || 'Selected Shop'})` : '(Select Shop)'}
              </p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{stats.totalBills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-full flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total GST</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{formatCurrency(stats.totalGST)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-orange-100 rounded-full flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Net Amount</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{formatCurrency(stats.netAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Shop</label>
            <select
              value={selectedShop}
              onChange={(e) => {
                const shopId = e.target.value;
                // console.log('🏪 Shop changed to:', shopId);
                setSelectedShop(shopId);
                // Clear filters when shop changes to show only that shop's data
                if (shopId) {
                  setSearchTerm('');
                  setFilterDateRange('');
                }
                
                if (gstBills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(gstBills, shopId, searchTerm, filterDateRange);
                    setStats(calculatedStats);
                    // console.log('📊 Stats updated for shop change:', calculatedStats);
                  }, 100);
                }
              }}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={shopsLoading}
              required
            >
              <option value="">
                {shopsLoading ? 'Loading shops...' : 'Select Shop (Required)'}
              </option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
            {shops.length === 0 && !shopsLoading && (
              <p className="text-sm text-red-500 mt-1">No shops found. Add a shop first.</p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Time Period</label>
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
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              <input
                type="text"
                placeholder="Search by client name, invoice number..."
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
                className="w-full pl-8 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* GST Bills Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">GST Bills</h3>
        </div>
        
        {loading ? (
          // Skeleton loading - instant render
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-3 sm:space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : gstBills.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-sm sm:text-base text-gray-500">No GST bills found</p>
            <p className="text-xs sm:text-sm text-gray-400">Create your first GST bill to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[780px] text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Shop</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">GST</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.map((bill) => (
                <tr key={bill._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                    <div className="truncate max-w-[120px] sm:max-w-none">{bill.invoiceNumber}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    <div className="truncate max-w-[150px] sm:max-w-none">{bill.customerName}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                    <div className="truncate max-w-[160px]">{bill.shopName}</div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    {new Date(bill.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                    ₹{parseFloat(bill.netAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                    ₹{parseFloat(bill.gstAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                    ₹{parseFloat(bill.grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button 
                        onClick={() => handleViewGSTBill(bill)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="View GST Bill"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditGSTBill(bill)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Edit GST Bill"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={() => window.print()}
                        className="text-purple-600 hover:text-purple-900 p-1"
                        title="Print GST Bill"
                      >
                        <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteGSTBill(bill._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete GST Bill"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddGSTBillForm && (
        <AddGSTBillForm
          onClose={() => {
            setShowAddGSTBillForm(false);
            // Refresh shops list when form closes to include any new shops added in client bill
            fetchShops();
          }}
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
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-4 rounded">Loading templates...</div></div>}>
          <InvoiceTemplates
            onClose={() => setShowInvoiceTemplates(false)}
            onSelectTemplate={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />
        </Suspense>
      )}

      {showAnalyticsDashboard && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-4 rounded">Loading analytics...</div></div>}>
          <AnalyticsDashboard
            onClose={() => setShowAnalyticsDashboard(false)}
            bills={gstBills}
          />
        </Suspense>
      )}

      {showContacts && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-4 rounded">Loading contacts...</div></div>}>
          <ContactsManager isOpen={showContacts} onClose={()=>setShowContacts(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default GSTBillManagementPage;