"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Camera, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import API_BASE_URL from "@/lib/apiConfig";
import { performLogout } from "@/lib/logout";

export default function Tracking() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSection, setActiveSection] = useState('orders');
  const [addresses, setAddresses] = useState([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    street: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
    type: 'home',
    landmark: '',
    isDefault: false
  });
  const [editAddress, setEditAddress] = useState({
    firstName: '',
    lastName: '',
    country: 'India',
    street: '',
    city: '',
    state: '',
    pin: '',
    phone: '',
    type: 'home',
    landmark: '',
    isDefault: false
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: '',
    phone: ''
  });
  const [editPassword, setEditPassword] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updating, setUpdating] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const token = localStorage.getItem('euser_token');
        const userData = localStorage.getItem('euser');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          // Load orders for this user
          loadUserOrders(parsedUser.id);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Load orders for the user
  const loadUserOrders = async (userId) => {
    if (!userId) return;
    
    setOrdersLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      } else {
        console.error('Failed to load orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handle order tracking by ID
  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      alert('Please enter an Order ID');
      return;
    }

    setOrdersLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedOrder(data.data);
        setOrders([data.data]); // Show only this order
      } else {
        alert('Order not found. Please check your Order ID.');
        setSelectedOrder(null);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error tracking order:', error);
      alert('Failed to track order. Please try again.');
      setSelectedOrder(null);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle logout
  const handleLogout = () => {
    // Reset all states first
    setUser(null);
    setOrders([]);
    setAddresses([]);
    setActiveSection('orders');
    setIsEditingProfile(false);
    setIsEditingPassword(false);
    setShowAddAddress(false);
    setEditingAddressId(null);
    setSelectedOrder(null);
    setOrderId('');
    setEmail('');
    
    // Use centralized logout function
    performLogout();
  };

  // Load addresses from localStorage
  const loadAddresses = () => {
    try {
      const savedAddresses = localStorage.getItem('euser_addresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  // Save addresses to localStorage
  const saveAddresses = (addressList) => {
    try {
      localStorage.setItem('euser_addresses', JSON.stringify(addressList));
      setAddresses(addressList);
    } catch (error) {
      console.error('Error saving addresses:', error);
    }
  };

  // Add new address
  const addAddress = () => {
    if (addresses.length >= 6) {
      alert('Maximum 6 addresses allowed');
      return;
    }

    const address = {
      ...newAddress,
      id: Date.now().toString()
    };

    const updatedAddresses = [...addresses, address];
    saveAddresses(updatedAddresses);
    setNewAddress({
      firstName: '',
      lastName: '',
      country: 'India',
      street: '',
      city: '',
      state: '',
      pin: '',
      phone: '',
      type: 'home',
      landmark: '',
      isDefault: false
    });
    setShowAddAddress(false);
    alert('Address added successfully');
  };

  // Delete address
  const deleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      saveAddresses(updatedAddresses);
      alert('Address deleted successfully');
    }
  };

  // Check if address can be edited (within 1 hour of order confirmation)
  const canEditAddress = (addressId) => {
    // Find if this address is used in any recent orders
    const recentOrders = orders.filter(order => {
      const orderTime = new Date(order.createdAt);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      return orderTime > oneHourAgo && order.address && order.address.id === addressId;
    });
    
    return recentOrders.length === 0; // Can edit if not used in recent orders
  };

  // Start editing address
  const startEditAddress = (address) => {
    if (!canEditAddress(address.id)) {
      alert('This address cannot be edited as it was used in a recent order (within 1 hour). The delivery will be made to the address used at the time of order.');
      return;
    }
    
    setEditingAddressId(address.id);
    setEditAddress({ ...address });
  };

  // Update address
  const updateAddress = () => {
    if (!editingAddressId) return;

    const updatedAddresses = addresses.map(addr => 
      addr.id === editingAddressId ? { ...editAddress, id: editingAddressId } : addr
    );
    
    saveAddresses(updatedAddresses);
    setEditingAddressId(null);
    setEditAddress({
      firstName: '',
      lastName: '',
      country: 'India',
      street: '',
      city: '',
      state: '',
      pin: '',
      phone: '',
      type: 'home',
      landmark: '',
      isDefault: false
    });
    alert('Address updated successfully');
  };

  // Cancel editing address
  const cancelEditAddress = () => {
    setEditingAddressId(null);
    setEditAddress({
      firstName: '',
      lastName: '',
      country: 'India',
      street: '',
      city: '',
      state: '',
      pin: '',
      phone: '',
      type: 'home',
      landmark: '',
      isDefault: false
    });
  };

  // Load addresses when component mounts
  useEffect(() => {
    loadAddresses();
  }, []);

  // Initialize edit profile data when user data loads
  useEffect(() => {
    if (user) {
      setEditProfile({
        name: user.name || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('euser_token');
      const response = await fetch(`${API_BASE_URL}/euser/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editProfile),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('euser', JSON.stringify(updatedUser));
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async () => {
    if (!user?.id) return;

    // Validate passwords
    if (editPassword.newPassword !== editPassword.confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (editPassword.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('euser_token');
      const response = await fetch(`${API_BASE_URL}/euser/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: editPassword.oldPassword,
          newPassword: editPassword.newPassword
        }),
      });

      if (response.ok) {
        alert('Password updated successfully!');
        setEditPassword({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setIsEditingPassword(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditingProfile(false);
    setIsEditingPassword(false);
    setEditProfile({
      name: user?.name || '',
      phone: user?.phone || ''
    });
    setEditPassword({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload/cloudinary`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;

      // Update user profile with new avatar
      const token = localStorage.getItem('euser_token');
      const updateResponse = await fetch(`${API_BASE_URL}/euser/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avatar: imageUrl }),
      });

      if (updateResponse.ok) {
        const updatedUser = { ...user, avatar: imageUrl };
        setUser(updatedUser);
        localStorage.setItem('euser', JSON.stringify(updatedUser));
        setShowImageUpload(false);
        alert('Profile picture updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-[#f8f8f8] mt-36 min-h-screen py-8">
      <div className="max-w-6xl mx-auto bg-white rounded shadow-sm">
        <h1 className="text-3xl font-extrabold text-center py-6 tracking-widest">TRACK YOUR ORDER</h1>
        <Separator />
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/3 border-r px-8 py-8 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-2 overflow-hidden">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="absolute -bottom-1 -right-1 bg-yellow-300 hover:bg-yellow-300 text-white rounded-full p-1.5 shadow-lg transition-colors"
                  title="Change profile picture"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              
              {showImageUpload && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="avatar-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
              )}
              
              <div className="font-semibold text-gray-700 text-center">
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                ) : user ? (
                  <>
                    {user.username || user.name || user.email}
                    <span className="text-gray-400 text-xs block">
                      #{user.id?.slice(-4) || '0000'}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">Not logged in</span>
                )}
              </div>
            </div>
            <nav className="w-full">
              <ul className="space-y-1 text-sm">
                <li>
                  <button
                    onClick={() => setActiveSection('orders')}
                    className={`block w-full text-left border-l-4 pl-2 py-2 ${
                      activeSection === 'orders' 
                        ? 'border-yellow-300 bg-gray-100 font-bold' 
                        : 'border-transparent hover:bg-gray-100'
                    }`}
                  >
                    ORDERS
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('addresses')}
                    className={`block w-full text-left border-l-4 pl-2 py-2 ${
                      activeSection === 'addresses' 
                        ? 'border-yellow-300 bg-gray-100 font-bold' 
                        : 'border-transparent hover:bg-gray-100'
                    }`}
                  >
                    ADDRESSES
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveSection('account')}
                    className={`block w-full text-left border-l-4 pl-2 py-2 ${
                      activeSection === 'account' 
                        ? 'border-yellow-300 bg-gray-100 font-bold' 
                        : 'border-transparent hover:bg-gray-100'
                    }`}
                  >
                    ACCOUNT DETAILS
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left border-l-4 border-transparent pl-2 py-2 hover:bg-gray-100"
                  >
                    LOGOUT
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          {/* Main Content */}
          <div className="md:w-2/3 px-8 py-8">
            {/* Orders Section */}
            {activeSection === 'orders' && (
              <div>
                {/* Order Search Form */}
                <div className="mb-8">
                  <p className="mb-6 text-gray-600">
                    To track your order please enter your Order ID in the box below and press the "Track" button.
                    This was given to you on your receipt and in the confirmation email you should have received.
                  </p>
                  <form onSubmit={handleTrackOrder} className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                      <label className="block font-bold mb-1">Order ID</label>
                      <Input
                        placeholder="Found in your order confirmation email."
                        value={orderId}
                        onChange={e => setOrderId(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block font-bold mb-1">Billing email</label>
                      <Input
                        placeholder="Email you used during checkout."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={ordersLoading}
                      className="bg-yellow-300 hover:bg-yellow-300 text-white font-bold px-8 py-2 mt-6 md:mt-0 disabled:opacity-50"
                    >
                      {ordersLoading ? 'TRACKING...' : 'TRACK'}
                    </Button>
                  </form>
                </div>

                {/* Orders List */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedOrder ? 'Order Details' : 'Your Orders'}
                    </h2>
                    {selectedOrder && (
                      <Button
                        onClick={() => {
                          setSelectedOrder(null);
                          if (user?.id) loadUserOrders(user.id);
                        }}
                        variant="outline"
                        className="text-sm"
                      >
                        View All Orders
                      </Button>
                    )}
                  </div>

                  {ordersLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300"></div>
                      <span className="ml-2 text-gray-600">Loading orders...</span>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">📦</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Found</h3>
                      <p className="text-gray-500">
                        {selectedOrder ? 'Order not found. Please check your Order ID.' : 'You haven\'t placed any orders yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                          {/* Order Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Placed on {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>

                          {/* Order Items */}
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2">Items ({order.items.length})</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                  <div className="flex items-center space-x-3">
                                    {item.thumbnail && (
                                      <img
                                        src={item.thumbnail}
                                        alt={item.name}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium text-gray-800">{item.name}</p>
                                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="font-semibold text-gray-800">₹{item.price}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Totals */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="font-semibold">₹{order.totals?.subtotal || 0}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">Shipping:</span>
                              <span className="font-semibold">₹{order.totals?.shipping || 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold border-t border-gray-300 pt-2">
                              <span>Total:</span>
                              <span>₹{order.totals?.grandTotal || 0}</span>
                            </div>
                          </div>

                          {/* Delivery Address */}
                          {order.address && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-700 mb-2">Delivery Address</h4>
                              <div className="text-sm text-gray-600">
                                <p>{order.address.firstName} {order.address.lastName}</p>
                                <p>{order.address.street}</p>
                                <p>{order.address.city}, {order.address.state} - {order.address.pin}</p>
                                <p>Phone: {order.address.phone}</p>
                              </div>
                            </div>
                          )}

                          {/* Order Actions */}
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              View Details
                            </Button>
                            {order.status === 'created' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                              >
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Section */}
            {activeSection === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Your Addresses</h2>
                  <Button
                    onClick={() => setShowAddAddress(true)}
                    className="bg-yellow-300 hover:bg-yellow-300 text-white"
                  >
                    Add New Address
                  </Button>
                </div>

                {showAddAddress && (
                  <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <Input
                          value={newAddress.firstName}
                          onChange={(e) => setNewAddress({...newAddress, firstName: e.target.value})}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <Input
                          value={newAddress.lastName}
                          onChange={(e) => setNewAddress({...newAddress, lastName: e.target.value})}
                          placeholder="Enter last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                        <Input
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                          placeholder="Enter street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <Input
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          placeholder="Enter city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <Input
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                        <Input
                          value={newAddress.pin}
                          onChange={(e) => setNewAddress({...newAddress, pin: e.target.value})}
                          placeholder="Enter PIN code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <Input
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                        <select
                          value={newAddress.type}
                          onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                      <Input
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                        placeholder="Enter landmark for delivery instructions"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddAddress(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={addAddress}
                        className="bg-yellow-300 hover:bg-yellow-300 text-white"
                      >
                        Add Address
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-white p-6 rounded-lg shadow-sm border">
                      {editingAddressId === address.id ? (
                        // Edit Address Form
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Edit Address</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                              <Input
                                value={editAddress.firstName}
                                onChange={(e) => setEditAddress({...editAddress, firstName: e.target.value})}
                                placeholder="Enter first name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                              <Input
                                value={editAddress.lastName}
                                onChange={(e) => setEditAddress({...editAddress, lastName: e.target.value})}
                                placeholder="Enter last name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                              <Input
                                value={editAddress.street}
                                onChange={(e) => setEditAddress({...editAddress, street: e.target.value})}
                                placeholder="Enter street address"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                              <Input
                                value={editAddress.city}
                                onChange={(e) => setEditAddress({...editAddress, city: e.target.value})}
                                placeholder="Enter city"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                              <Input
                                value={editAddress.state}
                                onChange={(e) => setEditAddress({...editAddress, state: e.target.value})}
                                placeholder="Enter state"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                              <Input
                                value={editAddress.pin}
                                onChange={(e) => setEditAddress({...editAddress, pin: e.target.value})}
                                placeholder="Enter PIN code"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                              <Input
                                value={editAddress.phone}
                                onChange={(e) => setEditAddress({...editAddress, phone: e.target.value})}
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                              <select
                                value={editAddress.type}
                                onChange={(e) => setEditAddress({...editAddress, type: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                              >
                                <option value="home">Home</option>
                                <option value="work">Work</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark (Optional)</label>
                            <Input
                              value={editAddress.landmark}
                              onChange={(e) => setEditAddress({...editAddress, landmark: e.target.value})}
                              placeholder="Enter landmark for delivery instructions"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              onClick={cancelEditAddress}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={updateAddress}
                              className="bg-yellow-300 hover:bg-yellow-300 text-white"
                            >
                              Update Address
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Address Display
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {address.firstName} {address.lastName}
                            </h3>
                            <p className="text-gray-600">{address.street}</p>
                            <p className="text-gray-600">
                              {address.city}, {address.state} - {address.pin}
                            </p>
                            <p className="text-gray-600">Phone: {address.phone}</p>
                            {address.landmark && (
                              <p className="text-gray-600">Landmark: {address.landmark}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {address.type.toUpperCase()}
                              </span>
                              {!canEditAddress(address.id) && (
                                <span className="inline-block px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded">
                                  LOCKED (Recent Order)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => startEditAddress(address)}
                              variant="outline"
                              size="sm"
                              className={`${
                                canEditAddress(address.id) 
                                  ? 'text-yellow-300 border-yellow-300 hover:bg-yellow-50' 
                                  : 'text-gray-400 border-gray-300 cursor-not-allowed'
                              }`}
                              disabled={!canEditAddress(address.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => deleteAddress(address.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {addresses.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-6xl mb-4">🏠</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No Addresses</h3>
                      <p className="text-gray-500">Add your first address to get started</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Account Details Section */}
            {activeSection === 'account' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setIsEditingProfile(true)}
                      variant="outline"
                      className="text-yellow-300 border-yellow-300 hover:bg-yellow-50"
                    >
                      Edit Profile
                    </Button>
                    <Button
                      onClick={() => setIsEditingPassword(true)}
                      variant="outline"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                      <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <Image
                            src={user.avatar}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => setShowImageUpload(!showImageUpload)}
                        className="absolute -bottom-1 -right-1 bg-yellow-300 hover:bg-yellow-300 text-white rounded-full p-1.5 shadow-lg transition-colors"
                        title="Change profile picture"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {user?.username || user?.name || user?.email || 'User'}
                      </h3>
                      <p className="text-gray-600">Member since {user?.createdAt ? formatDate(user.createdAt) : 'Unknown'}</p>
                    </div>
                  </div>

                  {showImageUpload && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="avatar-upload-account"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="avatar-upload-account"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload New Profile Picture'}
                      </label>
                    </div>
                  )}

                  {/* Profile Edit Form */}
                  {isEditingProfile && (
                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-300">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Input
                            value={editProfile.name}
                            onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                            placeholder="Enter your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <Input
                            value={editProfile.phone}
                            onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={updating}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProfileUpdate}
                          disabled={updating}
                          className="bg-yellow-300 hover:bg-yellow-300 text-white"
                        >
                          {updating ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Password Change Form */}
                  {isEditingPassword && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
                          <Input
                            type="password"
                            value={editPassword.oldPassword}
                            onChange={(e) => setEditPassword({...editPassword, oldPassword: e.target.value})}
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                          <Input
                            type="password"
                            value={editPassword.newPassword}
                            onChange={(e) => setEditPassword({...editPassword, newPassword: e.target.value})}
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                          <Input
                            type="password"
                            value={editPassword.confirmPassword}
                            onChange={(e) => setEditPassword({...editPassword, confirmPassword: e.target.value})}
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={cancelEditing}
                          disabled={updating}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePasswordUpdate}
                          disabled={updating}
                          className="bg-blue-400 hover:bg-blue-500 text-white"
                        >
                          {updating ? 'Updating...' : 'Update Password'}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <Input
                        value={user?.username || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <Input
                        value={user?.email || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <Input
                        value={user?.name || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <Input
                        value={user?.phone || ''}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Statistics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-300">{orders.length}</p>
                        <p className="text-sm text-gray-600">Total Orders</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {orders.filter(order => order.status === 'delivered').length}
                        </p>
                        <p className="text-sm text-gray-600">Delivered</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          {orders.filter(order => order.status === 'created').length}
                        </p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
