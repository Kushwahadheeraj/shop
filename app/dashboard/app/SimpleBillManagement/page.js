"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Plus, Search, Eye, Edit, Trash2, DollarSign, Building2, CreditCard, History, Receipt, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import AddSimpleBillForm from './AddSimpleBillForm';
import AddShopForm from './AddShopForm';
import SimpleBillViewModal from './SimpleBillViewModal';
import EditSimpleBillForm from './EditSimpleBillForm';
import PaymentModal from './PaymentModal';
import API_BASE_URL from '@/lib/apiConfig';
import { useDebounce } from '@/lib/useDebounce';

const SimpleBillManagementPage = () => {
  // Backend helpers - memoize these to prevent recreation
  const join = useCallback((base, path) => `${base.replace(/\/$/, '')}${path}`, []);
  const api = useCallback((path) => {
    return join(API_BASE_URL, path);
  }, [join]);
  const toArray = useCallback((res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.shops)) return res.data.shops;
    if (Array.isArray(res?.data?.bills)) return res.data.bills;
    return [];
  }, []);
  const getSellerId = useCallback(() => {
    try {
      const tokenStr = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!tokenStr) return null;
      const payload = JSON.parse(atob((tokenStr.split('.')[1] || '').replace(/-/g, '+').replace(/_/g, '/')));
      return payload?.id || null;
    } catch {
      return null;
    }
  }, []);
  const sellerId = getSellerId();
  const router = useRouter();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  const [showAddBillForm, setShowAddBillForm] = useState(false);
  const [showAddShopForm, setShowAddShopForm] = useState(false);
  const [showBillViewModal, setShowBillViewModal] = useState(false);
  const [showEditBillForm, setShowEditBillForm] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistoryModal, setShowPaymentHistoryModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [shops, setShops] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedShop, setSelectedShop] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Debounce search to reduce filter operations (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0
  });

  // Refs to prevent duplicate fetches
  const fetchingShopsRef = useRef(false);
  const fetchingBillsRef = useRef(false);
  const hasLoadedOnceRef = useRef(false);

  // Fetch shops
  const fetchShops = useCallback(async () => {
    // Prevent duplicate fetches
    if (fetchingShopsRef.current) return;
    
    try {
      fetchingShopsRef.current = true;
      setShopsLoading(true);
      const token = localStorage.getItem('token');
      const currentSellerId = getSellerId();
      const qs = currentSellerId ? `?sellerId=${encodeURIComponent(currentSellerId)}` : '';
      const response = await fetch(api(`/shops${qs}`), { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // console.error('❌ Error fetching shops - Response:', response.status, errorData);
        // console.error('❌ Error details:', {
        //   message: errorData.message,
        //   error: errorData.error,
        //   errorName: errorData.errorName,
        //   errorCode: errorData.errorCode
        // });
        // Show user-friendly error
        if (errorData.message) {
          alert(`Error loading shops: ${errorData.message}`);
        }
        setShops([]);
        return;
      }
      
      const data = await response.json().catch(() => ({}));
      const list = toArray(data);
      setShops(Array.isArray(list) ? list : []);
    } catch (error) {
      // console.error('❌ Error fetching shops:', error);
      // console.error('❌ Error stack:', error.stack);
      alert(`Error loading shops: ${error.message || 'Unknown error'}`);
      setShops([]);
    } finally {
      setShopsLoading(false);
      fetchingShopsRef.current = false;
    }
  }, [api, getSellerId, toArray]);

  // Fetch bills - fetch all bills, filtering is done client-side
  const fetchBills = useCallback(async () => {
    // Prevent duplicate fetches
    if (fetchingBillsRef.current) return;
    
    try {
      fetchingBillsRef.current = true;
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login/seller');
        fetchingBillsRef.current = false;
        return;
      }
      
      const params = new URLSearchParams();
      const currentSellerId = getSellerId();
      if (currentSellerId) params.append('sellerId', currentSellerId);
      
      // Always fetch all bills - filtering is done client-side for better UX
      const response = await fetch(api(`/simple-bills?${params.toString()}`), { headers: token ? { 'Authorization': `Bearer ${token}` } : {} });
      const data = await response.json().catch(() => ({}));
      const list = toArray(data);
      setBills(Array.isArray(list) ? list : []);
    } catch (error) {
      // console.error('❌ Error fetching bills:', error);
    } finally {
      setLoading(false);
      fetchingBillsRef.current = false;
    }
  }, [api, getSellerId, toArray, router]);

  // Get date range based on filter selection
  const getDateRange = (range) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0];
    
    switch (range) {
      case 'today':
        return { startDate: endDate, endDate };
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        return { startDate: yesterdayStr, endDate: yesterdayStr };
      case 'thisWeek':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return { startDate: startOfWeek.toISOString().split('T')[0], endDate };
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { startDate: startOfMonth.toISOString().split('T')[0], endDate };
      case 'lastMonth':
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        return { 
          startDate: startOfLastMonth.toISOString().split('T')[0], 
          endDate: endOfLastMonth.toISOString().split('T')[0] 
        };
      case 'thisYear':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return { startDate: startOfYear.toISOString().split('T')[0], endDate };
      default:
        return { startDate: null, endDate: null };
    }
  };

  // Memoize shop lookup to avoid repeated find operations
  const selectedShopName = useMemo(() => {
    if (!selectedShop) return null;
    const shop = shops.find(s => String(s?._id || s?.id || '') === String(selectedShop));
    return shop?.name || null;
  }, [selectedShop, shops]);

  // Calculate stats from local bills data - OPTIMIZED with early returns and single pass
  const calculateStatsFromBills = useCallback((billsData, shopsData, currentSelectedShop, currentSearchTerm, currentFilterDateRange) => {
    const safeBills = Array.isArray(billsData) ? billsData : [];
    if (safeBills.length === 0) {
      return { totalBills: 0, totalAmount: 0, paidAmount: 0, remainingAmount: 0 };
    }
    
    // Early return if no filters
    if (!currentSelectedShop && !currentSearchTerm && !currentFilterDateRange) {
      const num = (v) => Number(v ?? 0);
      const totalAmount = safeBills.reduce((sum, bill) => sum + num(bill.pricing?.totalAmount || bill.totalAmount), 0);
      const paidAmount = safeBills.reduce((sum, bill) => sum + num(bill.payment?.paidAmount || bill.paidAmount), 0);
      return {
        totalBills: safeBills.length,
        totalAmount,
        paidAmount,
        remainingAmount: Math.max(0, totalAmount - paidAmount)
      };
    }
    
    // Pre-compute filter values once
    const shopObj = currentSelectedShop ? (Array.isArray(shopsData) ? shopsData : [])
      .find(s => String(s?._id || s?.id || s?.shopId || '') === String(currentSelectedShop)) : null;
    const normalize = (v) => v ? String(v).toLowerCase().replace(/[^a-z0-9]/g, '') : '';
    const selNameNorm = shopObj ? normalize(shopObj?.name || shopObj?.title || shopObj?.shopName || '') : null;
    const searchLower = currentSearchTerm ? currentSearchTerm.toLowerCase() : '';
    const dateRange = currentFilterDateRange ? getDateRange(currentFilterDateRange) : null;
    const startDate = dateRange?.startDate;
    const endDate = dateRange?.endDate;
    
    // Single pass filter with early returns - O(n) complexity
    const num = (v) => Number(v ?? 0);
    let totalBills = 0;
    let totalAmount = 0;
    let paidAmount = 0;
    
    for (const bill of safeBills) {
      // Shop filter - early return
      if (selNameNorm) {
        let billShopId = '';
        if (typeof bill.shopId === 'string') {
          billShopId = bill.shopId;
        } else if (bill.shopId && typeof bill.shopId === 'object') {
          billShopId = bill.shopId._id || bill.shopId.id || '';
        } else if (bill.shop?._id) {
          billShopId = bill.shop._id;
        }
        
        if (billShopId && billShopId !== String(currentSelectedShop)) continue;
        
        if (!billShopId) {
          const billNameNorm = normalize(bill.shopName || bill.shop?.name || bill.shop || bill.shop_title || '');
          if (!billNameNorm || (billNameNorm !== selNameNorm && !billNameNorm.includes(selNameNorm) && !selNameNorm.includes(billNameNorm))) {
            continue;
          }
        }
      }
      
      // Search filter - early return
      if (searchLower) {
        const billNumber = (bill.billNumber || '').toLowerCase();
        const shopName = (bill.shopName || '').toLowerCase();
        const description = (bill.description || '').toLowerCase();
        
        if (!billNumber.includes(searchLower) && 
            !shopName.includes(searchLower) && 
            !description.includes(searchLower)) {
          continue;
        }
      }
      
      // Date filter - early return
      if (startDate && endDate) {
        const billDate = new Date(bill.billDate || bill.createdAt || 0).toISOString().split('T')[0];
        if (billDate < startDate || billDate > endDate) continue;
      }
      
      // Calculate stats in single pass
      totalBills++;
      totalAmount += num(bill.pricing?.totalAmount || bill.totalAmount);
      paidAmount += num(bill.payment?.paidAmount || bill.paidAmount);
    }
    
    return {
      totalBills,
      totalAmount,
      paidAmount,
      remainingAmount: Math.max(0, totalAmount - paidAmount)
    };
  }, [shops]); // Only shops as dependency since we use it for shop lookup

  const fetchStats = useCallback(async () => {
    // Stats calculated locally
  }, []);

  // Load real data from database - only on mount
  useEffect(() => {
    // Prevent multiple initial loads
    if (hasLoadedOnceRef.current) return;
    
    const loadRealData = async () => {
      try {
        hasLoadedOnceRef.current = true;
        await fetchShops();
        await fetchBills(); // Fetch all bills, filtering is done client-side
        await fetchStats();
      } catch (error) {
        // console.error('❌ Error loading data:', error);
        hasLoadedOnceRef.current = false; // Reset on error so it can retry
      }
    };
    loadRealData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push('/login/seller');
      } else if (!isSeller()) {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, isSeller, router]);

  // Recalculate stats - only when bills, shops, or filters change (using debounced search)
  useEffect(() => {
    const calculatedStats = calculateStatsFromBills(bills, shops, selectedShop, debouncedSearchTerm, filterDateRange);
    setStats(calculatedStats);
  }, [bills, shops, selectedShop, debouncedSearchTerm, filterDateRange, calculateStatsFromBills]);

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

  if (!isAuthenticated() || !isSeller()) {
    return null;
  }

  const handleSaveBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to create a bill');
      
      const response = await fetch(`${API_BASE_URL}/simple-bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      const data = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (data.success) {
        fetchBills();
        fetchStats();
        alert('Simple bill created successfully!');
      } else {
        throw new Error(data.message || 'Failed to create bill');
      }
    } catch (error) {
      // console.error('❌ Error saving bill:', error);
      throw error;
    }
  };

  const handleSaveShop = async (shopData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to create a shop');
      
      const response = await fetch(`${API_BASE_URL}/shops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // console.error('❌ Error creating shop - Response:', response.status, errorData);
        // console.error('❌ Error details:', {
        //   message: errorData.message,
        //   error: errorData.error,
        //   errorName: errorData.errorName,
        //   errorCode: errorData.errorCode
        // });
        
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login/seller');
          throw new Error('Session expired. Please log in again.');
        }
        
        throw new Error(errorData.message || errorData.error || 'Failed to create shop');
      }
      
      const data = await response.json();
      if (data.success) {
        await fetchShops();
        alert('Shop added successfully!');
      } else {
        throw new Error(data.message || 'Failed to create shop');
      }
    } catch (error) {
      // console.error('❌ Error saving shop:', error);
      // console.error('❌ Error stack:', error.stack);
      throw error;
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillViewModal(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setShowBillViewModal(false);
    setShowEditBillForm(true);
  };

  const handleAddPayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handleViewPaymentHistory = () => {
    setShowPaymentHistoryModal(true);
  };

  const handleAddPaymentFromRemaining = () => {
    let shopBills = bills;
    
    if (selectedShop && selectedShop !== '') {
      const selectedShopName = shops.find(s => s._id === selectedShop)?.name;
      shopBills = bills.filter(bill => bill.shopName === selectedShopName);
    }
    
    const billsWithRemaining = shopBills
      .filter(bill => {
        const remaining = (bill.pricing?.totalAmount || 0) - (bill.payment?.paidAmount || 0);
        return remaining > 0;
      })
      .sort((a, b) => new Date(a.billDate) - new Date(b.billDate));
    
    if (billsWithRemaining.length === 0) {
      alert('No bills with remaining amount found!');
      return;
    }
    
    const totalRemainingAmount = billsWithRemaining.reduce((sum, bill) => {
      return sum + ((bill.pricing?.totalAmount || 0) - (bill.payment?.paidAmount || 0));
    }, 0);
    
    const combinedBill = {
      _id: 'combined-remaining',
      billNumber: `All Remaining Bills (${billsWithRemaining.length})`,
      shopName: selectedShop && selectedShop !== '' ? 
        shops.find(s => s._id === selectedShop)?.name : 'All Shops',
      pricing: {
        totalAmount: totalRemainingAmount
      },
      payment: {
        paidAmount: 0,
        remainingAmount: totalRemainingAmount
      },
      billDate: new Date(),
      isCombinedBill: true,
      originalBills: billsWithRemaining
    };
    
    setSelectedBill(combinedBill);
    setShowPaymentModal(true);
  };

  const handleSavePayment = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to add payment');
      
      if (paymentData.billId === 'combined-remaining' && selectedBill?.isCombinedBill) {
        await handleCombinedBillPayment(paymentData, token);
        return;
      }
      
      const response = await fetch(api(`/simple-bills/${paymentData.billId}/payment`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (data.success) {
        fetchBills();
        fetchStats();
        alert('Payment added successfully!');
      } else {
        throw new Error(data.message || 'Failed to add payment');
      }
    } catch (error) {
      // console.error('❌ Error adding payment:', error);
      throw error;
    }
  };

  const handleCombinedBillPayment = async (paymentData, token) => {
    try {
      const paymentAmount = paymentData.amount;
      const remainingBills = selectedBill.originalBills;
      let remainingPayment = paymentAmount;
      let processedBills = [];
      
      for (const bill of remainingBills) {
        if (remainingPayment <= 0) break;
        
        const billRemaining = (bill.pricing?.totalAmount || 0) - (bill.payment?.paidAmount || 0);
        const paymentForThisBill = Math.min(remainingPayment, billRemaining);
        
        if (paymentForThisBill > 0) {
          const billPaymentData = {
            ...paymentData,
            billId: bill._id,
            amount: paymentForThisBill,
            notes: `${paymentData.notes || ''} (Part of combined payment: ₹${paymentAmount})`.trim()
          };
          
          const response = await fetch(api(`/simple-bills/${bill._id}/payment`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(billPaymentData)
          });
          
          const data = await response.json();
          
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/login/seller');
            throw new Error('Session expired. Please log in again.');
          }
          
          if (data.success) {
            remainingPayment -= paymentForThisBill;
            processedBills.push({
              billNumber: bill.billNumber,
              amount: paymentForThisBill,
              remaining: billRemaining - paymentForThisBill
            });
          } else {
            throw new Error(`Failed to process payment for bill ${bill.billNumber}: ${data.message}`);
          }
        }
      }
      
      await fetchBills();
      await fetchStats();
      
      const successMessage = `Payment of ₹${paymentAmount} processed successfully!\n\n` +
        `Processed ${processedBills.length} bills:\n` +
        processedBills.map(b => `• ${b.billNumber}: ₹${b.amount} (Remaining: ₹${b.remaining})`).join('\n');
      
      alert(successMessage);
      
    } catch (error) {
      // console.error('❌ Error processing combined bill payment:', error);
      throw error;
    }
  };

  const handleUpdateBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Please log in to update a bill');
      
      const response = await fetch(api(`/simple-bills/${selectedBill._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      const data = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (data.success) {
        fetchBills();
        fetchStats();
        alert('Simple bill updated successfully!');
      } else {
        throw new Error(data.message || 'Failed to update bill');
      }
    } catch (error) {
      // console.error('❌ Error updating bill:', error);
      throw error;
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(api(`/simple-bills/${billId}`), {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        if (data.success) {
          fetchBills();
          fetchStats();
          alert('Simple bill deleted successfully!');
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        // console.error('Error deleting bill:', error);
        alert('Error deleting bill');
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simple Bill Management</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              await fetchShops();
              await fetchBills();
              await fetchStats();
            }}
            className="flex items-center gap-2 px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 transition-colors"
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => setShowAddShopForm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Add Shop
          </button>
          <button
            onClick={() => setShowAddBillForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Bill
          </button>
        </div>
      </div>

      {/* Stats Cards - Enhanced with Hindi Labels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Kitna ka aaya saman - Total Amount */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <Receipt className="w-5 h-5 text-blue-600" />
                कितना का आया सामान
              </p>
              <p className="text-xs text-gray-500 mb-2">Total Bill Amount</p>
              <p className="text-3xl font-bold text-blue-700">{formatCurrency(stats.totalAmount)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {selectedShop && selectedShop !== '' 
                  ? `${shops.find(s => s._id === selectedShop)?.name || 'Selected Shop'}` 
                  : 'All Shops'} • {stats.totalBills} Bills
              </p>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Kitna diya gaya - Paid Amount */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-lg border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <CreditCard className="w-5 h-5 text-green-600" />
                कितना दिया गया
              </p>
              <p className="text-xs text-gray-500 mb-2">Total Paid Amount</p>
              <p className="text-3xl font-bold text-green-700">{formatCurrency(stats.paidAmount)}</p>
              {stats.totalAmount > 0 && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  {((stats.paidAmount / stats.totalAmount) * 100).toFixed(1)}% Paid
                </p>
              )}
              {selectedShop && (
                <button
                  onClick={handleViewPaymentHistory}
                  className="mt-2 text-xs text-green-600 hover:text-green-800 hover:underline"
                  title="View Payment History"
                >
                  View History →
                </button>
              )}
            </div>
            <div className="p-4 bg-green-100 rounded-xl">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Kitna baki hai - Remaining Amount */}
        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl shadow-lg border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                <History className="w-5 h-5 text-orange-600" />
                कितना बाकी है
              </p>
              <p className="text-xs text-gray-500 mb-2">Total Remaining Amount</p>
              <p className="text-3xl font-bold text-orange-700">{formatCurrency(stats.remainingAmount)}</p>
              {stats.totalAmount > 0 && (
                <p className="text-xs text-orange-600 mt-2 font-medium">
                  {((stats.remainingAmount / stats.totalAmount) * 100).toFixed(1)}% Pending
                </p>
              )}
              {selectedShop && stats.remainingAmount > 0 && (
                <button
                  onClick={handleAddPaymentFromRemaining}
                  className="mt-2 text-xs text-orange-600 hover:text-orange-800 hover:underline"
                  title="Add Payment"
                >
                  Add Payment →
                </button>
              )}
            </div>
            <div className="p-4 bg-orange-100 rounded-xl">
              <History className="w-8 h-8 text-orange-600" />
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
              onChange={(e) => setSelectedShop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={shopsLoading}
            >
              <option value="">
                {shopsLoading ? 'Loading shops...' : (() => {
                  // Automatically filter only 'simple' category shops
                  const filteredShops = shops.filter(shop => shop.category === 'simple' || !shop.category);
                  return `All Shops (${filteredShops.length})`;
                })()}
              </option>
              {shops
                .filter(shop => shop.category === 'simple' || !shop.category)
                .map(shop => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name} - {shop.address}
                  </option>
                ))}
            </select>
            {shops.filter(shop => shop.category === 'simple' || !shop.category).length === 0 && !shopsLoading && (
              <p className="text-sm text-red-500 mt-1">No Simple Bill shops found. Add a shop first.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedShop('');
                setSearchTerm('');
                setFilterDateRange('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Simple Bills</h3>
        </div>
        
        {loading ? (
          // Skeleton loading - instant render
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No bills found</p>
            <p className="text-sm text-gray-400">Create your first simple bill to get started</p>
          </div>
        ) : (() => {
          let filteredBills = Array.isArray(bills) ? bills : [];
          
          if (selectedShop && selectedShop !== '') {
            const selObj = (Array.isArray(shops) ? shops : []).find(s => String(s?._id || s?.id || s?.shopId || '') === String(selectedShop));
            const selNameLc = selObj?.name ? String(selObj.name).toLowerCase() : '';
            filteredBills = filteredBills.filter(bill => {
              let billShopId = '';
              if (typeof bill.shopId === 'string') {
                billShopId = bill.shopId;
              } else if (bill.shopId && typeof bill.shopId === 'object') {
                billShopId = bill.shopId._id || bill.shopId.id || '';
              } else if (bill.shop?._id) {
                billShopId = bill.shop._id;
              }
              
              const billShopNameLc = (bill.shopName || bill.shop?.name || '').toString().toLowerCase();
              if (billShopId) return billShopId === String(selectedShop);
              if (selNameLc && billShopNameLc) return billShopNameLc === selNameLc;
              return true;
            });
          }
          
          if (searchTerm && searchTerm.trim()) {
            const q = searchTerm.trim().toLowerCase();
            filteredBills = filteredBills.filter(bill => {
              const parts = [
                bill.billNumber,
                bill.shopName,
                bill.shop?.name,
                bill.description,
                bill.notes,
              ].map(v => (v ?? '').toString().toLowerCase());
              return parts.some(p => p && p.includes(q));
            });
          }

          const getBillDate = (b) => new Date(b.billDate || b.createdAt || 0);

          if (filterDateRange) {
            const { startDate, endDate } = getDateRange(filterDateRange);
            if (startDate && endDate) {
              const start = new Date(startDate);
              const end = new Date(endDate);
              filteredBills = filteredBills.filter(bill => {
                const d = getBillDate(bill);
                return d && !isNaN(d) && d >= start && d <= end;
              });
            }
          }
          
          if (filteredBills.length === 0) {
            return (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No bills found</p>
                <p className="text-sm text-gray-400">
                  {selectedShop ? 'No bills found for selected shop' : 'Try adjusting your filters'}
                </p>
              </div>
            );
          }
          
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bill.billNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.shopName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(bill.billDate || bill.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(bill.pricing?.totalAmount || bill.totalAmount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(bill.payment?.paidAmount || bill.paidAmount || 0)} / {formatCurrency(bill.pricing?.totalAmount || bill.totalAmount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewBill(bill)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Bill"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditBill(bill)}
                            className="text-green-600 hover:text-green-900"
                            title="Edit Bill"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleAddPayment(bill)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Add Payment"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteBill(bill._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Bill"
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
      {showAddBillForm && (
        <AddSimpleBillForm
          onClose={() => setShowAddBillForm(false)}
          onSave={handleSaveBill}
          shops={shops.filter(shop => shop.category === 'simple' || !shop.category)}
        />
      )}

      {showAddShopForm && (
        <AddShopForm
          onClose={() => setShowAddShopForm(false)}
          onSave={handleSaveShop}
        />
      )}

      {showBillViewModal && (
        <SimpleBillViewModal
          bill={selectedBill}
          isOpen={showBillViewModal}
          onClose={() => {
            setShowBillViewModal(false);
            setSelectedBill(null);
          }}
          onEdit={handleEditBill}
          onDelete={handleDeleteBill}
        />
      )}

      {showEditBillForm && (
        <EditSimpleBillForm
          bill={selectedBill}
          onClose={() => {
            setShowEditBillForm(false);
            setSelectedBill(null);
          }}
          onSave={handleUpdateBill}
          shops={shops.filter(shop => shop.category === 'simple' || !shop.category)}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          bill={selectedBill}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedBill(null);
          }}
          onSave={handleSavePayment}
        />
      )}

      {/* Payment History Modal */}
      {showPaymentHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
              <button
                onClick={() => setShowPaymentHistoryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {(() => {
                const selectedShopName = shops.find(s => s._id === selectedShop)?.name;
                const shopBills = bills.filter(bill => bill.shopName === selectedShopName);
                const allPayments = shopBills.flatMap(bill => 
                  (bill.paymentHistory || []).map(payment => ({
                    ...payment,
                    billNumber: bill.billNumber,
                    billId: bill._id
                  }))
                ).sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

                if (allPayments.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No payment history found</p>
                      <p className="text-sm text-gray-400">Payments will appear here once added</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">
                        Payment History for {selectedShopName}
                      </h3>
                      <p className="text-sm text-blue-600">
                        Total Payments: {allPayments.length} | 
                        Total Amount: {formatCurrency(allPayments.reduce((sum, p) => sum + p.amount, 0))}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {allPayments.map((payment, index) => (
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-2">
                                {payment.customerName && (
                                  <span className="text-sm font-medium text-gray-900">
                                    {payment.customerName}
                                  </span>
                                )}
                                <span className="text-sm text-gray-500">
                                  {formatDate(payment.paymentDate)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  payment.method === 'cash' ? 'bg-green-100 text-green-800' :
                                  payment.method === 'upi' ? 'bg-blue-100 text-blue-800' :
                                  payment.method === 'cheque' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {payment.method.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <p>Bill: {payment.billNumber}</p>
                                {payment.notes && <p>Notes: {payment.notes}</p>}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatCurrency(payment.amount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleBillManagementPage;
