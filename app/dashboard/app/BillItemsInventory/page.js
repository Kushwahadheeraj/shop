"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Package, DollarSign, Filter, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

const BillItemsInventoryPage = () => {
  // Use Next.js API routes instead of direct backend calls
  const toArray = useCallback((res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.bills)) return res.data.bills;
    if (Array.isArray(res?.bills)) return res.bills;
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

  const router = useRouter();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  const [billType, setBillType] = useState('simple'); // 'simple' or 'gst'
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const fetchingBillsRef = useRef(false);
  const hasLoadedOnceRef = useRef(false);

  // Fetch Simple Bills
  const fetchSimpleBills = useCallback(async () => {
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
      
      const currentSellerId = getSellerId();
      const params = new URLSearchParams();
      if (currentSellerId) params.append('sellerId', currentSellerId);
      
      // Use Next.js API route instead of direct backend call
      const response = await fetch(`/api/simple-bills?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error('❌ Failed to fetch simple bills:', response.status, response.statusText);
        setAllItems([]);
        setUniqueCategories([]);
        return;
      }
      
      const data = await response.json().catch(() => ({}));
      console.log('📦 Simple bills response:', { 
        success: data.success, 
        dataType: typeof data.data,
        isArray: Array.isArray(data.data),
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A'
      });
      
      const bills = toArray(data);
      console.log('📋 Parsed bills:', bills.length);
      
      // Extract all items from bills
      const items = [];
      bills.forEach((bill, billIndex) => {
        if (Array.isArray(bill.items)) {
          bill.items.forEach((item, itemIndex) => {
            items.push({
              ...item,
              billNumber: bill.billNumber || bill.billNo || `BILL-${billIndex + 1}`,
              billDate: bill.billDate || bill.createdAt || bill.date,
              billType: 'simple',
              shopName: bill.shopName || bill.shop || 'N/A',
              // For Simple Bill: unitPrice is per piece, totalPrice is quantity * unitPrice
              unitPrice: item.unitPrice || item.price || 0,
              totalPrice: item.totalPrice || item.total || (item.quantity * (item.unitPrice || item.price || 0)) || 0,
              quantity: item.quantity || item.qty || 0,
              category: item.category || item.type || 'Uncategorized',
              name: item.name || item.itemName || item.productName || 'Unknown Item'
            });
          });
        } else {
          console.warn(`⚠️ Bill ${billIndex} has no items array:`, bill);
        }
      });
      
      console.log('✅ Extracted items from simple bills:', items.length);
      if (items.length > 0) {
        console.log('Sample item:', items[0]);
      }
      
      setAllItems(items);
      
      // Extract unique categories
      const categories = [...new Set(items.map(item => item.category || 'Uncategorized').filter(Boolean))];
      setUniqueCategories(categories.sort());
      
    } catch (error) {
      console.error('❌ Error fetching simple bills:', error);
    } finally {
      setLoading(false);
      fetchingBillsRef.current = false;
    }
  }, [getSellerId, toArray, router]);

  // Fetch GST Bills from BillManagement endpoint
  const fetchGSTBills = useCallback(async () => {
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
      
      const currentSellerId = getSellerId();
      const params = new URLSearchParams();
      if (currentSellerId) params.append('sellerId', currentSellerId);
      
      // Use Next.js API route instead of direct backend call
      const response = await fetch(`/api/bills?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        console.error('❌ Failed to fetch GST bills:', response.status, response.statusText);
        setAllItems([]);
        setUniqueCategories([]);
        return;
      }
      
      const data = await response.json().catch(() => ({}));
      console.log('📦 GST bills response:', { 
        success: data.success, 
        dataType: typeof data.data,
        isArray: Array.isArray(data.data),
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A'
      });
      
      const bills = toArray(data);
      console.log('📋 Parsed GST bills:', bills.length);
      
      // Extract all items from bills (these are GST bills from BillManagement)
      const items = [];
      bills.forEach((bill, billIndex) => {
        if (Array.isArray(bill.items)) {
          bill.items.forEach((item, itemIndex) => {
            items.push({
              ...item,
              billNumber: bill.billNumber || bill.billNo || `BILL-${billIndex + 1}`,
              billDate: bill.billDate || bill.createdAt || bill.date,
              billType: 'gst',
              shopName: bill.shopName || bill.shop || 'N/A',
              // For BillManagement bills: unitPrice is per piece, totalPrice is quantity * unitPrice
              unitPrice: item.unitPrice || item.price || 0,
              totalPrice: item.totalPrice || item.total || (item.quantity * (item.unitPrice || item.price || 0)) || 0,
              quantity: item.quantity || item.qty || 0,
              category: item.category || item.type || 'Uncategorized',
              name: item.name || item.itemName || item.productName || 'Unknown Item'
            });
          });
        } else {
          console.warn(`⚠️ GST Bill ${billIndex} has no items array:`, bill);
        }
      });
      
      console.log('✅ Extracted items from GST bills:', items.length);
      if (items.length > 0) {
        console.log('Sample GST item:', items[0]);
      }
      
      setAllItems(items);
      
      // Extract unique categories
      const categories = [...new Set(items.map(item => item.category || 'Uncategorized').filter(Boolean))];
      setUniqueCategories(categories.sort());
      
    } catch (error) {
      console.error('❌ Error fetching GST bills:', error);
    } finally {
      setLoading(false);
      fetchingBillsRef.current = false;
    }
  }, [getSellerId, toArray, router]);

  // Load data based on bill type
  useEffect(() => {
    if (!hasLoadedOnceRef.current) return;
    
    if (billType === 'simple') {
      fetchSimpleBills();
    } else {
      fetchGSTBills();
    }
  }, [billType, fetchSimpleBills, fetchGSTBills]);

  // Initial load
  useEffect(() => {
    if (hasLoadedOnceRef.current) return;
    
    const loadData = async () => {
      hasLoadedOnceRef.current = true;
      await fetchSimpleBills();
    };
    
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Filter items based on search and category
  const filteredItems = allItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.billNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      (item.category || 'Uncategorized').toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (amount) => {
    const roundedAmount = Math.round((amount + Number.EPSILON) * 100) / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(roundedAmount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  };

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
                Bill Items Inventory
              </h1>
            </div>
            <p className="text-sm sm:text-base text-amber-50/90 max-w-2xl">
              सभी बिलों के आइटम्स एक जगह, सर्च/फिल्टर करें और मूल्य देखें (Simple + GST)।
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              Items: {allItems.length}
            </div>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
              Total Value: {formatCurrency(allItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Bill Type Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => {
              setBillType('simple');
              setSearchTerm('');
              setSelectedCategory('');
              fetchSimpleBills();
            }}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              billType === 'simple'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-300/50'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Simple Bill Items
          </button>
          <button
            onClick={() => {
              setBillType('gst');
              setSearchTerm('');
              setSelectedCategory('');
              fetchGSTBills();
            }}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              billType === 'gst'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-300/50'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            GST Bill Items
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Search by Item Name, Bill Number, or Shop</span>
              <span className="sm:hidden">Search Items</span>
            </label>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border border-amber-200 rounded-lg text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-full flex-shrink-0">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{filteredItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-full flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:h-6 text-amber-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Quantity</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                {filteredItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-full flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div className="ml-3 sm:ml-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                {formatCurrency(filteredItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">
            {billType === 'simple' ? 'Simple Bill' : 'GST Bill'} Items ({filteredItems.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Loading items...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-sm sm:text-base text-gray-500">No items found</p>
            <p className="text-xs sm:text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Per Piece Price
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Bill Number
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Shop Name
                  </th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Bill Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                      <div className="truncate max-w-[120px] sm:max-w-none">{item.name || 'N/A'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full whitespace-nowrap">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                      {item.quantity || 0}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap hidden sm:table-cell">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {formatCurrency(item.totalPrice || 0)}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap hidden md:table-cell">
                      <div className="truncate max-w-[100px]">{item.billNumber || 'N/A'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                      <div className="truncate max-w-[150px]">{item.shopName || 'N/A'}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap hidden md:table-cell">
                      {formatDate(item.billDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillItemsInventoryPage;
