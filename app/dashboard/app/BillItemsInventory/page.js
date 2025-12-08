"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Package, DollarSign, Filter } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bill Items Inventory</h1>
          <p className="text-gray-600 mt-1">View all items from your bills</p>
        </div>
      </div>

      {/* Bill Type Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setBillType('simple');
              setSearchTerm('');
              setSelectedCategory('');
              fetchSimpleBills();
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              billType === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              billType === 'gst'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            GST Bill Items
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-2" />
              Search by Item Name, Bill Number, or Shop
            </label>
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quantity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {filteredItems.reduce((sum, item) => sum + (item.quantity || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(filteredItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {billType === 'simple' ? 'Simple Bill' : 'GST Bill'} Items ({filteredItems.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading items...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No items found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Per Piece Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bill Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {item.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.unitPrice || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(item.totalPrice || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.billNumber || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.shopName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
