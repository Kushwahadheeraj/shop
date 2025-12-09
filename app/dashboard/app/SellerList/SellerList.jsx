"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import API_BASE_URL from "@/lib/apiConfig";

// Helper function to get correct image URL
const getImageUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('/uploads/')) {
    // Remove /api from API_BASE_URL for image URLs
    const baseUrl = API_BASE_URL.replace(/\/api$/, '');
    return `${baseUrl}${avatar}`;
  }
  return avatar;
};

export default function SellerList() {
  const { user } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    role: "all"
  });
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [accessEmail, setAccessEmail] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSellerDetails, setSelectedSellerDetails] = useState(null);

  // Check if current user has access control permissions (only for managing access)
  const hasAccessControl = user?.email === "kushwahadheeraj245@gmail.com";

  // All authenticated sellers can view the list
  const canViewList = true;

  // Delete user function
  const handleDeleteUser = async (userId) => {
    if (!hasAccessControl) {
      setError("You don't have permission to delete users");
      return;
    }

    const seller = sellers.find(s => s.id === userId);
    if (!seller) {
      setError("User not found");
      return;
    }

    // Prevent deleting admin
    if (seller.email === "kushwahadheeraj245@gmail.com") {
      setError("Cannot delete admin account");
      return;
    }

    if (!confirm(`Are you sure you want to permanently delete ${seller.username || seller.email}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/seller/delete-user`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          adminEmail: "kushwahadheeraj245@gmail.com"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setError("");
        fetchSellers(); // Refresh the list
        alert(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  // Role management functions
  const handleRoleChange = async (sellerId, newRole) => {
    if (!hasAccessControl) {
      setError("You don't have permission to change user roles");
      return;
    }

    // Find the seller to get their current role and name
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) {
      setError("User not found");
      return;
    }

    // Don't allow changing if it's the same role
    if (seller.role === newRole) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/seller/update-role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sellerId,
          newRole,
          adminEmail: "kushwahadheeraj245@gmail.com"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setError("");
        fetchSellers(); // Refresh the list
        alert(`Role changed successfully! ${seller.username || seller.email} is now ${newRole}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sellers, filters]);

  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/seller/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched sellers:', data.sellers);
        setSellers(data.sellers || []);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch sellers");
      }
    } catch (err) {
      console.error('Error fetching sellers:', err);
      setError("Network error - please check your connection");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...sellers];

    // Exclude admin users from the table
    filtered = filtered.filter(seller => seller.role !== 'admin');

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(seller =>
        seller.username?.toLowerCase().includes(filters.search.toLowerCase()) ||
        seller.email?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(seller => seller.status === filters.status);
    }

    // Role filter (exclude admin from role filter options)
    if (filters.role !== "all") {
      filtered = filtered.filter(seller => seller.role === filters.role);
    }

    setFilteredSellers(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleAccessControl = async (sellerId, action) => {
    if (!hasAccessControl) {
      setError("You don't have permission to control seller access");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/seller/access-control`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sellerId,
          action,
          accessEmail: "kushwahadheeraj245@gmail.com"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setError("");
        fetchSellers(); // Refresh the list
        alert(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  const openAccessModal = (seller) => {
    setSelectedSeller(seller);
    setAccessEmail(seller.email);
    setShowAccessModal(true);
  };

  const closeAccessModal = () => {
    setShowAccessModal(false);
    setSelectedSeller(null);
    setAccessEmail("");
  };

  const updateSellerAccess = async () => {
    if (!selectedSeller) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/seller/update-access`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sellerId: selectedSeller.id,
          newEmail: accessEmail,
          accessEmail: "kushwahadheeraj245@gmail.com"
        })
      });

      if (response.ok) {
        const data = await response.json();
        setError("");
        closeAccessModal();
        fetchSellers(); // Refresh the list
        alert(data.message);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (err) {
      setError("Network error");
    }
  };

  // View seller details function
  const viewSellerDetails = (seller) => {
    setSelectedSellerDetails(seller);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedSellerDetails(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-5 sm:p-6 lg:p-7 text-white shadow-xl border border-amber-300/40">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2.5 rounded-xl">
                <span className="text-xl sm:text-2xl font-bold">👥</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                User Management
              </h1>
            </div>
            <p className="text-sm sm:text-base text-amber-50/90 max-w-2xl">
              Manage users, roles, and access. Admin accounts stay protected.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchSellers}
              className="w-full px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-colors text-sm sm:text-base shadow-md shadow-amber-400/30"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Sellers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[720px] md:min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={
                            getImageUrl(seller.avatar) || 
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.username || seller.email)}&background=3B82F6&color=ffffff&size=40`
                          }
                          alt={seller.username || 'User'}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.username || seller.email)}&background=3B82F6&color=ffffff&size=40`;
                          }}
                        />
                      </div>
                      <div className="ml-3 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {seller.username || 'No Username'}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 break-all">
                          ID: {seller.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="break-words text-xs sm:text-sm">{seller.email || 'No Email'}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-full ${
                      seller.role === 'admin' 
                        ? 'bg-amber-100 text-amber-800'
                        : seller.role === 'seller'
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {seller.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-[11px] sm:text-xs font-semibold rounded-full ${
                      seller.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : seller.status === 'inactive'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {seller.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                    {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      {/* View Details Button */}
                      <button
                        onClick={() => viewSellerDetails(seller)}
                        className="text-amber-600 hover:text-amber-700 text-xs font-medium text-left"
                      >
                        View Details
                      </button>
                      
                      {hasAccessControl && (
                        <>
                          {/* Role Management Toggle Buttons */}
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Change Role:</div>
                            <div className="flex flex-wrap gap-2 sm:space-x-1">
                              <button
                                onClick={() => handleRoleChange(seller.id, 'user')}
                                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                  seller.role === 'user'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                User
                              </button>
                              <button
                                onClick={() => handleRoleChange(seller.id, 'seller')}
                                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                  seller.role === 'seller'
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                }`}
                              >
                                Seller
                              </button>
                            </div>
                          </div>
                          
                          {/* Access Control Buttons */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openAccessModal(seller)}
                              className="text-amber-600 hover:text-amber-700 text-xs"
                            >
                              Edit Access
                            </button>
                            <button
                              onClick={() => handleAccessControl(seller.id, seller.status === 'active' ? 'deactivate' : 'activate')}
                              className={`text-xs ${
                                seller.status === 'active' 
                                  ? 'text-red-600 hover:text-red-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {seller.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(seller.id)}
                              className="text-red-600 hover:text-red-900 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSellers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found (admin users are excluded from this list)</p>
          </div>
        )}
      </div>

      {/* Access Control Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border shadow-lg rounded-xl p-5 sm:p-6">
            <div className="mt-1 space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Update Seller Access
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seller Email
                </label>
                <input
                  type="email"
                  value={accessEmail}
                  onChange={(e) => setAccessEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder="Enter new email"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3">
                <button
                  onClick={closeAccessModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={updateSellerAccess}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seller Details Modal */}
      {showDetailsModal && selectedSellerDetails && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border shadow-lg rounded-xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Seller Details
                </h3>
                <button
                  onClick={closeDetailsModal}
                  className="text-gray-400 hover:text-gray-600 self-start sm:self-auto"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-5">
                {/* Profile Image and Basic Info */}
                <div className="flex items-center space-x-4">
                  <img
                    className="h-16 w-16 rounded-full object-cover"
                    src={
                      getImageUrl(selectedSellerDetails.avatar) || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSellerDetails.username || selectedSellerDetails.email)}&background=3B82F6&color=ffffff&size=64`
                    }
                    alt={selectedSellerDetails.username || 'User'}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedSellerDetails.username || selectedSellerDetails.email)}&background=3B82F6&color=ffffff&size=64`;
                    }}
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedSellerDetails.username || 'No Username'}
                    </h4>
                    <p className="text-sm text-gray-600 break-words">
                      {selectedSellerDetails.email || 'No Email'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedSellerDetails.role === 'admin' 
                          ? 'bg-amber-100 text-amber-800' 
                          : selectedSellerDetails.role === 'seller'
                          ? 'bg-amber-200 text-amber-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedSellerDetails.role || 'user'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedSellerDetails.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : selectedSellerDetails.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedSellerDetails.status || 'active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Mobile Number</label>
                      <p className="text-sm text-gray-900 break-words">
                        {selectedSellerDetails.mobile || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Business Information</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">Shop Name</label>
                      <p className="text-sm text-gray-900 break-words">
                        {selectedSellerDetails.shopName || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">GST Number</label>
                      <p className="text-sm text-gray-900 font-mono break-words">
                        {selectedSellerDetails.gstNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Account Information</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-500">User ID</label>
                      <p className="text-sm text-gray-900 font-mono break-words">
                        {selectedSellerDetails.id}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Joined Date</label>
                      <p className="text-sm text-gray-900">
                        {selectedSellerDetails.createdAt ? new Date(selectedSellerDetails.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-4">
                <button
                  onClick={closeDetailsModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 