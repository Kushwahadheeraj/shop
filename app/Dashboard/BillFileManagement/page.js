"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Upload, X, Building2, Plus, Search, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../components/AuthContext';
import AddShopForm from '../SimpleBillManagement/AddShopForm';

const BillFileManagementPage = () => {
  // Backend helpers
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '';
  const join = useCallback((base, path) => `${base.replace(/\/$/, '')}${path}`, []);
  const api = useCallback((path) => {
    return API_BASE ? join(API_BASE, path) : path;
  }, [API_BASE, join]);
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
      const response = await fetch(api(`/api/shops${qs}`), {
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
    // Use Next.js API route
    const response = await fetch('/api/upload/cloudinary', {
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
      
      const saveResponse = await fetch('/api/bill-files', {
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
          <h1 className="text-3xl font-bold text-gray-900">Bill File Management</h1>
          <p className="text-gray-600 mt-1">Upload and manage bill files (PDF/Images)</p>
        </div>
      </div>

      {/* File Type Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setFileType('gst');
              setUploadFiles([]);
              setSelectedShop('');
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              fileType === 'gst'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
              fileType === 'bill'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Bill File
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Upload {fileType === 'gst' ? 'GST Bill' : 'Bill'} Files
        </h3>

        {/* Shop Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Shop *
          </label>
          <div className="flex gap-4">
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              disabled={uploading}
            >
              <Plus className="w-4 h-4" />
              Add Shop
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Files (PDF or Images) *
            <span className="text-gray-500 text-xs ml-2">Minimum 1, Maximum: Unlimited</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
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
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Selected Files ({uploadFiles.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {uploadFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {file.type === 'application/pdf' ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {uploadProgress[index] !== undefined && (
                      <div className="flex items-center gap-2">
                        {uploadProgress[index] === -1 ? (
                          <span className="text-xs text-red-500">Failed</span>
                        ) : uploadProgress[index] < 100 ? (
                          <span className="text-xs text-blue-500">{uploadProgress[index]}%</span>
                        ) : (
                          <span className="text-xs text-green-500">✓ Uploaded</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-4 text-red-500 hover:text-red-700"
                    disabled={uploading}
                  >
                    <X className="w-5 h-5" />
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
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Upload {uploadFiles.length > 0 ? `${uploadFiles.length} ` : ''}File(s)</span>
            </>
          )}
        </button>
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

