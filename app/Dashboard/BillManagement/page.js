"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, Calendar, DollarSign, Building2, CreditCard, History, Receipt, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import AddBillForm from './AddBillForm';
import AddShopForm from './AddShopForm';
import BillViewModal from './BillViewModal';
import EditBillForm from './EditBillForm';
import PaymentModal from './PaymentModal';

const BillManagementPage = () => {
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
  const [loading, setLoading] = useState(true);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBills: 0,
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0
  });

  // Load real data from database
  useEffect(() => {
    const loadRealData = async () => {
      console.log('🔄 Loading real data from database...');
      
      try {
        // Try to fetch data from API
        await fetchShops();
        await fetchBills();
        await fetchStats();
      } catch (error) {
        console.error('❌ Error loading data:', error);
      }
    };
    
    // Load real data from database
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

  // Recalculate stats whenever bills, selectedShop, searchTerm, or filterDateRange changes
  useEffect(() => {
    if (bills.length > 0) {
      console.log('🔄 Recalculating stats due to bills, shop, search, or date change...');
      console.log('🔍 Current selected shop:', selectedShop);
      console.log('🔍 Current search term:', searchTerm);
      console.log('🔍 Current date range:', filterDateRange);
      console.log('🔍 Current bills count:', bills.length);
      
      const calculatedStats = calculateStatsFromBills(bills, selectedShop, searchTerm, filterDateRange);
      setStats(calculatedStats);
      
      console.log('📊 Updated stats:', calculatedStats);
    }
  }, [bills, selectedShop, searchTerm, filterDateRange]);

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

  // Fetch shops
  const fetchShops = async () => {
    try {
      setShopsLoading(true);
      const token = localStorage.getItem('token');
      console.log('🔍 Fetching shops with token:', token ? 'Token present' : 'No token');
      
      const response = await fetch('/api/shops', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('🔍 Shops API response status:', response.status);
      const data = await response.json();
      console.log('🔍 Shops API response data:', data);
      
      if (response.status === 401) {
        console.error('❌ Authentication failed:', data.message);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login/seller');
        return;
      }
      
      if (data.success) {
        const shops = data.data.shops || [];
        setShops(shops);
        console.log('✅ Shops set successfully:', shops);
        console.log('✅ Number of shops:', shops.length);
        
        if (shops.length === 0) {
          console.log('⚠️ No shops found in database');
        }
      } else {
        console.error('❌ API returned error:', data.message);
        console.log('🔍 Full error response:', data);
      }
    } catch (error) {
      console.error('❌ Error fetching shops:', error);
      console.log('🔍 Error details:', error);
    } finally {
      setShopsLoading(false);
    }
  };

  // Fetch bills
  const fetchBills = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No authentication token found');
        return;
      }
      
      const params = new URLSearchParams();
      if (selectedShop) params.append('shopId', selectedShop);
      if (searchTerm) params.append('search', searchTerm);
      
      // Add date range filtering
      if (filterDateRange) {
        const { startDate, endDate } = getDateRange(filterDateRange);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      }

      console.log('🔍 Fetching bills with params:', params.toString());
      console.log('🔍 Token present:', !!token);
      
      const response = await fetch(`/api/bills?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 Bills API response status:', response.status);
      
      if (response.status === 401) {
        console.error('❌ Authentication failed');
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login/seller');
        return;
      }
      
      const data = await response.json();
      console.log('🔍 Bills API response data:', data);
      
      if (data.success && data.data) {
        const bills = data.data.bills || [];
        setBills(bills);
        console.log('✅ Bills fetched successfully:', bills);
        console.log('✅ Number of bills:', bills.length);
        
        if (bills.length === 0) {
          console.log('⚠️ No bills found in database');
        } else {
          // Calculate stats from the fetched bills
          console.log('🔍 Calculating stats from fetched bills...');
          const calculatedStats = calculateStatsFromBills(bills);
          setStats(calculatedStats);
          console.log('📊 Stats calculated from database bills:', calculatedStats);
        }
      } else {
        console.error('❌ API returned error:', data.message || 'Unknown error');
        console.log('🔍 Full error response:', data);
      }
    } catch (error) {
      console.error('❌ Error fetching bills:', error);
      console.log('🔍 Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get date range based on filter selection
  const getDateRange = (range) => {
    const now = new Date();
    const endDate = now.toISOString().split('T')[0]; // Today
    
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
    console.log('🔍 Calculating stats from bills data:', billsData.length, 'bills');
    console.log('🔍 Bills data sample:', billsData.slice(0, 2)); // Show first 2 bills for debugging
    console.log('🔍 Current filters:', { currentSelectedShop, currentSearchTerm, currentFilterDateRange });
    
    let filteredBills = billsData;
    
    // Filter by selected shop if any (only if a shop is actually selected)
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
        bill.billNumber.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
        bill.shopName.toLowerCase().includes(currentSearchTerm.toLowerCase())
      );
      console.log('🔍 Filtered bills by search term:', currentSearchTerm, '=', filteredBills.length);
    }
    
    // Filter by date range if selected
    if (currentFilterDateRange) {
      const { startDate, endDate } = getDateRange(currentFilterDateRange);
      if (startDate && endDate) {
        filteredBills = filteredBills.filter(bill => {
          const billDate = new Date(bill.billDate);
          return billDate >= new Date(startDate) && billDate <= new Date(endDate);
        });
        console.log('🔍 Filtered bills by date range:', filteredBills.length);
      }
    }
    
    // Calculate totals from all bills
    const totalBills = filteredBills.length;
    const totalAmount = roundCurrency(filteredBills.reduce((sum, bill) => {
      const amount = bill.pricing?.totalAmount || 0;
      console.log(`💰 Bill ${bill.billNumber}: totalAmount = ${amount}`);
      return sum + amount;
    }, 0));
    
    const paidAmount = roundCurrency(filteredBills.reduce((sum, bill) => {
      const amount = bill.payment?.paidAmount || 0;
      console.log(`💳 Bill ${bill.billNumber}: paidAmount = ${amount}`);
      return sum + amount;
    }, 0));
    
    const remainingAmount = roundCurrency(filteredBills.reduce((sum, bill) => {
      const amount = bill.payment?.remainingAmount || 0;
      console.log(`📊 Bill ${bill.billNumber}: remainingAmount = ${amount}`);
      return sum + amount;
    }, 0));
    
    console.log('📊 Final calculated stats:', {
      totalBills,
      totalAmount,
      paidAmount,
      remainingAmount
    });
    
    return {
      totalBills,
      totalAmount,
      paidAmount,
      remainingAmount
    };
  };

  // Fetch bill statistics
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedShop) params.append('shopId', selectedShop);
      
      // Add date range filtering for stats too
      if (filterDateRange) {
        const { startDate, endDate } = getDateRange(filterDateRange);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      }

      console.log('🔍 Fetching stats with params:', params.toString());
      console.log('🔍 Selected shop:', selectedShop);
      console.log('🔍 Filter date range:', filterDateRange);

      const response = await fetch(`/api/bills/stats?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      console.log('🔍 Stats API response:', data);
      
      if (response.status === 401) {
        console.error('Authentication failed:', data.message);
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login/seller');
        return;
      }
      
      if (data.success && data.data?.overview) {
        console.log('✅ Stats updated from API:', data.data.overview);
        setStats(data.data.overview);
      } else {
        console.log('⚠️ API stats failed, calculating from local bills data');
        // Fallback: calculate from local bills data
        const calculatedStats = calculateStatsFromBills(bills);
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback: calculate from local bills data
      console.log('⚠️ Stats API error, calculating from local bills data');
      const calculatedStats = calculateStatsFromBills(bills, selectedShop, searchTerm, filterDateRange);
      setStats(calculatedStats);
    }
  };


  // This useEffect is now handled by the loadRealData useEffect above

  const handleSaveBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to create a bill');
      }
      
      console.log('🔍 Creating bill with data:', billData);
      console.log('🔍 Token present:', token ? 'Yes' : 'No');
      
      const response = await fetch('/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      console.log('🔍 Bill creation response status:', response.status);
      const data = await response.json();
      console.log('🔍 Bill creation response data:', data);
      
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 500) {
        console.error('❌ Server error:', data);
        throw new Error('Server error: ' + (data.message || 'Internal server error'));
      }
      
      if (data.success) {
        console.log('✅ Bill created successfully');
        fetchBills();
        fetchStats();
        alert('Bill created successfully!');
      } else {
        console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to create bill');
      }
    } catch (error) {
      console.error('❌ Error saving bill:', error);
      throw error;
    }
  };

  const handleSaveShop = async (shopData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to create a shop');
      }
      
      console.log('Creating shop with token:', token ? 'Token present' : 'No token');
      
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      });

      const data = await response.json();
      
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (data.success) {
        console.log('Shop created successfully:', data.data);
        await fetchShops(); // Wait for shops to be fetched
        alert('Shop added successfully!');
      } else {
        console.error('Failed to create shop:', data.message);
        throw new Error(data.message || 'Failed to create shop');
      }
    } catch (error) {
      console.error('Error saving shop:', error);
      throw error;
    }
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setShowBillViewModal(true);
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    setShowBillViewModal(false); // Close view modal
    setShowEditBillForm(true);   // Open edit form
  };

  const handleAddPayment = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const handleViewPaymentHistory = () => {
    setShowPaymentHistoryModal(true);
  };

  const handleAddPaymentFromRemaining = () => {
    // Get all bills from selected shop (or all bills if no shop selected)
    let shopBills = bills;
    
    if (selectedShop && selectedShop !== '') {
      const selectedShopName = shops.find(s => s._id === selectedShop)?.name;
      shopBills = bills.filter(bill => bill.shopName === selectedShopName);
    }
    
    // Get bills with remaining amount (sorted by bill date)
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
    
    // Create a special bill object that represents all remaining bills
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
      
      if (!token) {
        throw new Error('Please log in to add payment');
      }
      
      console.log('🔍 Adding payment with data:', paymentData);
      
      // Check if this is a combined bill payment
      if (paymentData.billId === 'combined-remaining' && selectedBill?.isCombinedBill) {
        await handleCombinedBillPayment(paymentData, token);
        return;
      }
      
      const response = await fetch(`/api/bills/${paymentData.billId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
      });

      console.log('🔍 Payment response status:', response.status);
      const data = await response.json();
      console.log('🔍 Payment response data:', data);
      
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
        console.log('✅ Payment added successfully');
        fetchBills();
        fetchStats();
        alert('Payment added successfully!');
      } else {
        console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to add payment');
      }
    } catch (error) {
      console.error('❌ Error adding payment:', error);
      throw error;
    }
  };

  const handleCombinedBillPayment = async (paymentData, token) => {
    try {
      const paymentAmount = paymentData.amount;
      const remainingBills = selectedBill.originalBills;
      let remainingPayment = paymentAmount;
      let processedBills = [];
      
      console.log('🔄 Processing combined bill payment:', {
        totalPayment: paymentAmount,
        billsCount: remainingBills.length
      });
      
      // Process each bill in order (oldest first)
      for (const bill of remainingBills) {
        if (remainingPayment <= 0) break;
        
        const billRemaining = (bill.pricing?.totalAmount || 0) - (bill.payment?.paidAmount || 0);
        const paymentForThisBill = Math.min(remainingPayment, billRemaining);
        
        if (paymentForThisBill > 0) {
          const billPaymentData = {
            ...paymentData,
            billId: bill._id,
            amount: paymentForThisBill,
            previousPaidAmount: bill.payment?.paidAmount || 0,
            newPaidAmount: (bill.payment?.paidAmount || 0) + paymentForThisBill,
            notes: `${paymentData.notes || ''} (Part of combined payment: ₹${paymentAmount})`.trim()
          };
          
          console.log(`💳 Processing payment for bill ${bill.billNumber}:`, {
            billRemaining,
            paymentForThisBill,
            remainingPayment
          });
          
          const response = await fetch(`/api/bills/${bill._id}/payment`, {
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
            console.log(`✅ Payment processed for bill ${bill.billNumber}`);
          } else {
            console.error(`❌ Error processing payment for bill ${bill.billNumber}:`, data.message);
            throw new Error(`Failed to process payment for bill ${bill.billNumber}: ${data.message}`);
          }
        }
      }
      
      // Refresh data
      await fetchBills();
      await fetchStats();
      
      // Show success message with details
      const successMessage = `Payment of ₹${paymentAmount} processed successfully!\n\n` +
        `Processed ${processedBills.length} bills:\n` +
        processedBills.map(b => `• ${b.billNumber}: ₹${b.amount} (Remaining: ₹${b.remaining})`).join('\n');
      
      alert(successMessage);
      
    } catch (error) {
      console.error('❌ Error processing combined bill payment:', error);
      throw error;
    }
  };

  const handleUpdateBill = async (billData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to update a bill');
      }
      
      console.log('🔍 Updating bill with data:', billData);
      
      const response = await fetch(`/api/bills/${selectedBill._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(billData)
      });

      console.log('🔍 Bill update response status:', response.status);
      const data = await response.json();
      console.log('🔍 Bill update response data:', data);
      
      if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 500) {
        console.error('❌ Server error:', data);
        throw new Error('Server error: ' + (data.message || 'Internal server error'));
      }
      
      if (data.success) {
        console.log('✅ Bill updated successfully');
        fetchBills();
        fetchStats();
        alert('Bill updated successfully!');
      } else {
        console.error('❌ API returned error:', data.message);
        throw new Error(data.message || 'Failed to update bill');
      }
    } catch (error) {
      console.error('❌ Error updating bill:', error);
      throw error;
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/bills/${billId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          fetchBills();
          fetchStats();
          alert('Bill deleted successfully!');
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error deleting bill:', error);
        alert('Error deleting bill');
      }
    }
  };

  const formatCurrency = (amount) => {
    // Round to 2 decimal places to avoid floating point precision issues
    const roundedAmount = Math.round((amount + Number.EPSILON) * 100) / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(roundedAmount);
  };

  // Helper function to round currency values for calculations
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
          <h1 className="text-3xl font-bold text-gray-900">Bill Management</h1>
          <p className="text-gray-600">Manage your bills and shop transactions</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Shops loaded: {shops.length}</p>
            <p>Bills loaded: {bills.length}</p>
            <p>Stats: Total {formatCurrency(stats.totalAmount)} | Paid {formatCurrency(stats.paidAmount)} | Remaining {formatCurrency(stats.remainingAmount)}</p>
            <p className="text-xs text-blue-600">
              {bills.length === 0 ? 'No data found' : 'Data loaded from database'}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedShop && selectedShop !== '') || searchTerm || filterDateRange ? 
                `Showing filtered results (${stats.totalBills} bills)` : 
                `Showing all results (${stats.totalBills} bills)`
              }
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              console.log('🔄 Refreshing all data from database...');
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

      {/* Debug Info */}
      {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h3>
        <div className="text-xs text-yellow-700 space-y-1">
          <p>Shops loaded: {shops.length}</p>
          <p>Shops loading: {shopsLoading ? 'Yes' : 'No'}</p>
          <p>Shops data: {JSON.stringify(shops, null, 2)}</p>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Bills {selectedShop && selectedShop !== '' ? `(${shops.find(s => s._id === selectedShop)?.name || 'Selected Shop'})` : '(All Shops)'}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.paidAmount)}</p>
              </div>
            </div>
            {selectedShop && (
              <button
                onClick={handleViewPaymentHistory}
                className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                title="View Payment History"
              >
                <History className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.remainingAmount)}</p>
              </div>
            </div>
            {selectedShop && (
              <button
                onClick={handleAddPaymentFromRemaining}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                title="Add Payment"
              >
                <Receipt className="w-5 h-5" />
              </button>
            )}
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
                
                // Recalculate stats immediately when shop changes
                if (bills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(bills, e.target.value, searchTerm, filterDateRange);
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
                  {shop.name} - {shop.address}
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
                
                // Recalculate stats when date range changes
                if (bills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(bills, selectedShop, searchTerm, e.target.value);
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
                placeholder="Search bills..."
                value={searchTerm}
                onChange={(e) => {
                  console.log('🔍 Search term changed to:', e.target.value);
                  setSearchTerm(e.target.value);
                  
                  // Recalculate stats when search term changes
                  if (bills.length > 0) {
                    setTimeout(() => {
                      const calculatedStats = calculateStatsFromBills(bills, selectedShop, e.target.value, filterDateRange);
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
                
                // Recalculate stats when filters are cleared
                if (bills.length > 0) {
                  setTimeout(() => {
                    const calculatedStats = calculateStatsFromBills(bills, '', '', '');
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

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Bills</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading bills...</p>
            </div>
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No bills found</p>
            <p className="text-sm text-gray-400">Create your first bill to get started</p>
          </div>
        ) : (() => {
          // Filter bills based on selected shop and search term
          let filteredBills = bills;
          
          // Filter by selected shop (only if a shop is actually selected)
          if (selectedShop && selectedShop !== '') {
            const selectedShopName = shops.find(s => s._id === selectedShop)?.name;
            filteredBills = bills.filter(bill => bill.shopName === selectedShopName);
          }
          
          // Filter by search term
          if (searchTerm) {
            filteredBills = filteredBills.filter(bill => 
              bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
              bill.shopName.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          
          // Filter by date range
          if (filterDateRange) {
            const { startDate, endDate } = getDateRange(filterDateRange);
            if (startDate && endDate) {
              filteredBills = filteredBills.filter(bill => {
                const billDate = new Date(bill.billDate);
                return billDate >= new Date(startDate) && billDate <= new Date(endDate);
              });
            }
          }
          
          console.log('🔍 Filtered bills:', {
            selectedShop,
            searchTerm,
            filterDateRange,
            originalCount: bills.length,
            filteredCount: filteredBills.length,
            filteredBills: filteredBills.map(b => ({ id: b._id, shop: b.shopName, amount: b.pricing?.totalAmount }))
          });
          
          
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
                      {formatDate(bill.billDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bill.pricing.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bill.payment.paidAmount)} / {formatCurrency(bill.pricing.totalAmount)}
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
        <AddBillForm
          onClose={() => setShowAddBillForm(false)}
          onSave={handleSaveBill}
          shops={shops}
        />
      )}

      {showAddShopForm && (
        <AddShopForm
          onClose={() => setShowAddShopForm(false)}
          onSave={handleSaveShop}
        />
      )}

      {showBillViewModal && (
        <BillViewModal
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
        <EditBillForm
          bill={selectedBill}
          onClose={() => {
            setShowEditBillForm(false);
            setSelectedBill(null);
          }}
          onSave={handleUpdateBill}
          shops={shops}
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
                                <span className="text-sm font-medium text-gray-900">
                                  {payment.customerName}
                                </span>
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

export default BillManagementPage;
