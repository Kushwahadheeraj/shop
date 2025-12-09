"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, Building2, Plus, Search, FileText, Image as ImageIcon, Trash2, Calendar, Filter, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import AddShopForm from '../SimpleBillManagement/AddShopForm';
import API_BASE_URL from '@/lib/apiConfig';

const BillFileManagementPage = () => {
  // Backend helpers
  const join = useCallback((base, path) => `${base.replace(/\/$/, '')}${path}`, []);
  const api = useCallback((path) => {
    return join(API_BASE_URL, path);
  }, [join]);
  const toArray = useCallback((res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.shops)) return res.data.shops;
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
  const [fileType, setFileType] = useState('gst'); // 'gst' or 'bill'
  const [selectedShop, setSelectedShop] = useState('');
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [showAddShopForm, setShowAddShopForm] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [billFiles, setBillFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filterShop, setFilterShop] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'gst', 'bill'

  const fetchingShopsRef = useRef(false);

  // Fetch shops
  const fetchShops = useCallback(async () => {
    if (fetchingShopsRef.current) return;
    
    try {
      fetchingShopsRef.current = true;
      setShopsLoading(true);
      const token = localStorage.getItem('token');
      const currentSellerId = getSellerId();
      const qs = currentSellerId ? `?sellerId=${encodeURIComponent(currentSellerId)}` : '';
      const response = await fetch(api(`/shops${qs}`), {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json().catch(() => ({}));
      const list = toArray(data);
      setShops(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('❌ Error fetching shops:', error);
    } finally {
      setShopsLoading(false);
      fetchingShopsRef.current = false;
    }
  }, [api, getSellerId, toArray]);

  // Load shops on mount
  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Fetch bill files
  const fetchBillFiles = useCallback(async () => {
    try {
      setFilesLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filterShop) params.append('shopId', filterShop);
      if (filterStartDate) params.append('startDate', filterStartDate);
      if (filterEndDate) params.append('endDate', filterEndDate);
      
      const qs = params.toString();
      const response = await fetch(api(`/bill-files/summary${qs ? `?${qs}` : ''}`), {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await response.json();
      if (data.success) {
        setBillFiles(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bill files:', error);
    } finally {
      setFilesLoading(false);
    }
  }, [api, filterShop, filterStartDate, filterEndDate]);

  // Load bill files on mount and when filters change
  useEffect(() => {
    fetchBillFiles();
  }, [fetchBillFiles]);

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

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isPDF = file.type === 'application/pdf';
      return isImage || isPDF;
    });

    if (newFiles.length === 0) {
      alert('Please select only PDF or Image files');
      return;
    }

    setUploadFiles(prev => [...prev, ...newFiles]);
    e.target.value = ''; // Reset input
  };

  // Remove file from list
  const handleRemoveFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload files to Cloudinary
  const uploadFileToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    // Use backend API on port 5000
    const response = await fetch(`${API_BASE_URL}/upload/cloudinary`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  // Handle upload
  const handleUpload = async () => {
    if (!selectedShop) {
      alert('Please select a shop');
      return;
    }

    if (uploadFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    setUploading(true);
    const progress = {};
    setUploadProgress(progress);

    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        progress[i] = 0;
        setUploadProgress({ ...progress });

        try {
          const url = await uploadFileToCloudinary(file);
          uploadedFiles.push({
            fileName: file.name,
            fileUrl: url,
            fileType: file.type,
            shopId: selectedShop,
            billType: fileType, // 'gst' or 'bill'
            uploadedAt: new Date().toISOString()
          });

          progress[i] = 100;
          setUploadProgress({ ...progress });
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          alert(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
          progress[i] = -1; // Error
          setUploadProgress({ ...progress });
        }
      }

      // Save to backend
      const token = localStorage.getItem('token');
      
      // uploadedFiles array already contains only successfully uploaded files
      if (uploadedFiles.length === 0) {
        throw new Error('No files were uploaded successfully');
      }
      
      const saveResponse = await fetch(`${API_BASE_URL}/bill-files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          files: uploadedFiles
        })
      });

      const saveData = await saveResponse.json();
      
      if (saveResponse.ok && saveData.success) {
        alert(`${uploadedFiles.length} file(s) uploaded and saved successfully!`);
        setUploadFiles([]);
        setSelectedShop('');
        setUploadProgress({});
        // Refresh the files list
        await fetchBillFiles();
      } else {
        throw new Error(saveData.message || 'Failed to save file records');
      }

    } catch (error) {
      console.error('Error uploading files:', error);
      const errorMessage = error.message || 'Error uploading files. Please try again.';
      alert(errorMessage);
    } finally {
      setUploading(false);
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

      const data = await response.json();
      if (response.status === 401) {
        localStorage.removeItem('token');
        router.push('/login/seller');
        throw new Error('Session expired. Please log in again.');
      }
      
      if (data.success) {
        await fetchShops();
        alert('Shop added successfully!');
        setShowAddShopForm(false);
      } else {
        throw new Error(data.message || 'Failed to create shop');
      }
    } catch (error) {
      console.error('Error saving shop:', error);
      alert('Error saving shop: ' + error.message);
      throw error;
    }
  };

  // Delete bill file
  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/bill-files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        alert('File deleted successfully!');
        await fetchBillFiles();
      } else {
        throw new Error(data.message || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file: ' + error.message);
    }
  };

  // Group files by shop
  const groupFilesByShop = (files) => {
    const grouped = {};
    files.forEach(file => {
      // Filter by active tab
      if (activeTab === 'gst' && file.billType !== 'gst') return;
      if (activeTab === 'bill' && file.billType !== 'bill') return;
      
      const shopId = file.shopId?._id || file.shopId;
      const shopName = file.shopId?.name || 'Unknown Shop';
      if (!grouped[shopId]) {
        grouped[shopId] = {
          shop: file.shopId,
          shopName,
          gst: [],
          bill: []
        };
      }
      if (file.billType === 'gst') {
        grouped[shopId].gst.push(file);
      } else {
        grouped[shopId].bill.push(file);
      }
    });
    return grouped;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const groupedFiles = groupFilesByShop(billFiles);

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
                Bill File Management
              </h1>
            </div>
            <p className="text-sm sm:text-base text-amber-50/90 max-w-2xl">
              Upload और मैनेज करें PDF/Images फाइलें, दुकानों के हिसाब से फिल्टर करें।
            </p>
          </div>
        </div>
      </div>

      {/* File Type Selector */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => {
              setFileType('gst');
              setUploadFiles([]);
              setSelectedShop('');
            }}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              fileType === 'gst'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-300/50'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            GST Bill File
          </button>
          <button
            onClick={() => {
              setFileType('bill');
              setUploadFiles([]);
              setSelectedShop('');
            }}
            className={`flex-1 px-3 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
              fileType === 'bill'
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md shadow-amber-300/50'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            Bill File
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Upload {fileType === 'gst' ? 'GST Bill' : 'Bill'} Files
        </h3>

        {/* Shop Selection */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Select Shop *
          </label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              disabled={shopsLoading || uploading}
            >
              <option value="">
                {shopsLoading ? 'Loading shops...' : 'Select a shop'}
              </option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>
                  {shop.name} - {shop.address}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddShopForm(true)}
              className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
              disabled={uploading}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              Add Shop
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Select Files (PDF or Images) *
            <span className="text-gray-500 text-xs ml-1 sm:ml-2 block sm:inline">Minimum 1, Maximum: Unlimited</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-amber-400 transition-colors">
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.gif"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2" />
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, PNG, JPG, GIF up to 10MB each
              </p>
            </label>
          </div>
        </div>

        {/* Selected Files List */}
        {uploadFiles.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Selected Files ({uploadFiles.length})
            </h4>
            <div className="space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
              {uploadFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {file.type === 'application/pdf' ? (
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    ) : (
                      <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {uploadProgress[index] !== undefined && (
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                        {uploadProgress[index] === -1 ? (
                          <span className="text-xs text-red-500 whitespace-nowrap">Failed</span>
                        ) : uploadProgress[index] < 100 ? (
                          <span className="text-xs text-amber-700 whitespace-nowrap">{uploadProgress[index]}%</span>
                        ) : (
                          <span className="text-xs text-amber-700 whitespace-nowrap">✓ Uploaded</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedShop || uploadFiles.length === 0 || uploading}
          className="w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white text-sm sm:text-base rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-300/40"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Upload {uploadFiles.length > 0 ? `${uploadFiles.length} ` : ''}File(s)</span>
            </>
          )}
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Uploaded Files</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-amber-800 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            Filters
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Files ({billFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('gst')}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'gst'
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            GST Bills ({billFiles.filter(f => f.billType === 'gst').length})
          </button>
          <button
            onClick={() => setActiveTab('bill')}
            className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'bill'
                ? 'border-b-2 border-amber-600 text-amber-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bills ({billFiles.filter(f => f.billType === 'bill').length})
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Filter by Shop
                </label>
                <select
                  value={filterShop}
                  onChange={(e) => setFilterShop(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">All Shops</option>
                  {shops.map(shop => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
            {/* Clear Filters Button */}
            {(filterShop || filterStartDate || filterEndDate) && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setFilterShop('');
                    setFilterStartDate('');
                    setFilterEndDate('');
                  }}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Files Display */}
        {filesLoading ? (
          <div className="text-center py-6 sm:py-8">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-gray-600">Loading files...</p>
          </div>
        ) : Object.keys(groupedFiles).length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
            <p className="text-sm sm:text-base">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {Object.values(groupedFiles).map((group, idx) => {
              // Show shop only if it has files for the active tab
              const hasGstFiles = group.gst.length > 0;
              const hasBillFiles = group.bill.length > 0;
              const shouldShowShop = 
                activeTab === 'all' ? (hasGstFiles || hasBillFiles) :
                activeTab === 'gst' ? hasGstFiles :
                activeTab === 'bill' ? hasBillFiles : false;

              if (!shouldShowShop) return null;

              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-3 sm:mb-4 pb-3 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{group.shopName}</h4>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500">
                      ({group.gst.length} GST, {group.bill.length} Bill)
                    </span>
                  </div>

                  {/* GST Bills Section - Show only if activeTab is 'all' or 'gst' */}
                  {group.gst.length > 0 && (activeTab === 'all' || activeTab === 'gst') && (
                    <div className="mb-4 sm:mb-6">
                      <h5 className="text-sm sm:text-md font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                          GST Bills ({group.gst.length})
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {group.gst.map((file) => (
                          <div
                            key={file._id}
                            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {file.fileType === 'application/pdf' ? (
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                )}
                                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {file.fileName}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteFile(file._id)}
                                className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="truncate">{formatDate(file.uploadedAt)}</span>
                            </div>
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              View File
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Non-GST Bills Section - Show only if activeTab is 'all' or 'bill' */}
                  {group.bill.length > 0 && (activeTab === 'all' || activeTab === 'bill') && (
                    <div>
                      <h5 className="text-sm sm:text-md font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                        <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm">
                          Bills without GST ({group.bill.length})
                        </span>
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {group.bill.map((file) => (
                          <div
                            key={file._id}
                            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {file.fileType === 'application/pdf' ? (
                                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
                                )}
                                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {file.fileName}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteFile(file._id)}
                                className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="truncate">{formatDate(file.uploadedAt)}</span>
                            </div>
                            <a
                              href={file.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                              View File
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Shop Modal */}
      {showAddShopForm && (
        <AddShopForm
          onClose={() => setShowAddShopForm(false)}
          onSave={handleSaveShop}
        />
      )}
    </div>
  );
};

export default BillFileManagementPage;

