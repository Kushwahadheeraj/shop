"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import API_BASE_URL from "@/lib/apiConfig";

const STORAGE_KEY = "euser_checkout_address";
const ADDRESS_STORAGE_KEY = "euser_addresses";

function currency(amount) {
  const n = Number(amount || 0);
  return `₹${n.toLocaleString()}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], total = 0 } = useCart() || { items: [], total: 0 };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "India",
    street: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [addresses, setAddresses] = useState([]);
  // Index of selected address in 'addresses' array (0..n-1)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);
  const [isChangingAddress, setIsChangingAddress] = useState(true); // Start with address selection view
  const [showPlatformFeePopup, setShowPlatformFeePopup] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    country: "India",
    street: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    type: "HOME", // HOME, WORK, OTHER
    landmark: "", // Landmark for delivery
    isDefault: false,
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const rawUser = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
        if (rawUser) {
          const user = JSON.parse(rawUser);
          if (user && (user._id || user.id)) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    const onAuth = () => {
      try {
        const rawUser = localStorage.getItem('euser');
        if (rawUser) {
          const user = JSON.parse(rawUser);
          setIsAuthenticated(!!(user && (user._id || user.id)));
          if (user?.email) setForm(f => ({ ...f, email: user.email }));
        } else {
          setIsAuthenticated(false);
        }
      } catch {}
    };
    try { window.addEventListener('euser-auth', onAuth); } catch {}
    return () => { try { window.removeEventListener('euser-auth', onAuth); } catch {} };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Load addresses from API + form data from localStorage
  useEffect(() => {
    if (!isAuthenticated) return; // Don't load data if not authenticated
    
    const loadData = async () => {
      try {
        // Load saved addresses from backend
        const token = typeof window !== 'undefined' ? localStorage.getItem('euser_token') : null;
        if (token) {
          const res = await fetch(`${API_BASE_URL}/euser/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.success && Array.isArray(data.addresses)) {
            setAddresses(data.addresses);
          }
      }
      
        // Load saved form data from localStorage (for notes, etc.)
        const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
      let savedForm = {};
      if (raw) {
        savedForm = JSON.parse(raw);
      }
      
        // Always override email with user email
      const rawUser = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
      if (rawUser) {
        const user = JSON.parse(rawUser);
          if (user?.email) savedForm.email = user.email;
        }

      setForm((f) => ({ ...f, ...savedForm }));
    } catch (err) {
    }
    };

    loadData();
  }, [isAuthenticated]);

  // When addresses change, auto-select default/first but don't auto-collapse;
  // user will confirm with "DELIVER HERE".
  useEffect(() => {
    if (addresses.length === 0) {
      setSelectedAddressIndex(null);
      setIsChangingAddress(true);
      return;
    }
    setSelectedAddressIndex((prev) => {
      if (typeof prev === 'number' && addresses[prev]) return prev;
      const preferredIndex = addresses.findIndex((a) => a.isDefault);
      return preferredIndex !== -1 ? preferredIndex : 0;
    });
  }, [addresses]);

  // Save to localStorage when form changes (but don't overwrite email from user)
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const rawUser = localStorage.getItem('euser');
        const user = rawUser ? JSON.parse(rawUser) : null;
        const userEmail = user?.email || '';
        const formToSave = { ...form };
        if (userEmail) formToSave.email = userEmail; // Always use user's email
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formToSave));
      }
    } catch {}
  }, [form]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (Number(it.price || it.salePrice || 0) * (it.quantity || 1)), 0);
  }, [items]);

  // Calculate total savings from discounts
  const totalSavings = useMemo(() => {
    return items.reduce((total, item) => {
      const quantity = item.quantity || 1;
      const originalPrice = Number(item.originalPrice || item.mrp || item.price || 0);
      const currentPrice = Number(item.price || item.salePrice || 0);
      
      // Only calculate savings if there's a discount (original price > current price)
      if (originalPrice > currentPrice) {
        const savingsPerItem = originalPrice - currentPrice;
        return total + (savingsPerItem * quantity);
      }
      return total;
    }, 0);
  }, [items]);

  const computeDeliveryFee = (amount) => {
    const a = Number(amount || 0);
    if (a >= 15000) return 0;
    if (a >= 2000 && a <= 14999) return 350;
    if (a >= 600 && a <= 1999) return 150;
    if (a >= 100 && a <= 599) return 70;
    return 70; // default small orders
  };

  const getUserEmail = () => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
      if (!raw) return '';
      const u = JSON.parse(raw);
      return u?.email || '';
    } catch {
      return '';
    }
  };

  const platformFee = 7;
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const discountAmount = appliedCoupon?.discount || 0;
  const netAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shipping = computeDeliveryFee(netAfterDiscount);
  const grandTotal = Math.max(0, netAfterDiscount + shipping + platformFee);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateNewAddress = (key) => (e) => setNewAddress((a) => ({ ...a, [key]: e.target.value }));

  // Address management functions
  const addAddress = async () => {
    if (addresses.length >= 5) {
      alert('Maximum 5 addresses allowed');
      return;
    }
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('euser_token') : null;
      if (!token) {
        alert('Please login again');
        return;
      }

      const payload = { ...newAddress, email: form.email };
      const res = await fetch(`${API_BASE_URL}/euser/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to add address');

      setAddresses(data.addresses);

      const newIndex = data.addresses.length - 1;
      setSelectedAddressIndex(newIndex);
      setIsChangingAddress(false);

    setNewAddress({
      firstName: "",
      lastName: "",
      country: "India",
      street: "",
      city: "",
      state: "",
      pin: "",
      phone: "",
      type: "HOME",
      landmark: "",
      isDefault: false,
    });
    setShowAddForm(false);
    } catch (err) {
      alert(err.message || 'Failed to add address');
    }
  };

  const editAddress = (index) => {
    const address = addresses[index];
    if (address) {
      setNewAddress({ ...address });
      setEditingAddressIndex(index);
      setShowAddForm(true);
    }
  };

  const updateAddress = async () => {
    if (editingAddressIndex === null || editingAddressIndex === undefined) return;
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('euser_token') : null;
      if (!token) {
        alert('Please login again');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/euser/addresses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ index: editingAddressIndex, address: { ...newAddress, email: form.email } }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update address');

      setAddresses(data.addresses);
    setShowAddForm(false);
      setEditingAddressIndex(null);
    } catch (err) {
      alert(err.message || 'Failed to update address');
    }
  };

  const deleteAddress = async (index) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('euser_token') : null;
      if (!token) {
        alert('Please login again');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/euser/addresses`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ index }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete address');

      setAddresses(data.addresses);
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(null);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const selectAddress = (index) => {
    setSelectedAddressIndex(index);
    // Don't change isChangingAddress here - keep showing address list with DELIVER HERE button
    const address = addresses[index];
    if (address) {
      setForm(prev => ({ ...prev, ...address, email: prev.email }));
      try {
        const formToSave = { ...form, ...address };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formToSave));
      } catch {}
    }
  };

  const cancelAddEdit = () => {
    setShowAddForm(false);
    setEditingAddressIndex(null);
    setNewAddress({
      firstName: "",
      lastName: "",
      country: "India",
      street: "",
      city: "",
      state: "",
      pin: "",
      phone: "",
      type: "HOME",
      landmark: "",
      isDefault: false,
    });
  };

  // Quantity update functions
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
  };

  const removeItem = (itemId) => {
  };

  const changeAddress = () => {
    // Just reopen the list with current selection; don't clear selected address
    setIsChangingAddress(true);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
      const user = raw ? JSON.parse(raw) : null;
      const userId = user?._id || user?.id;
      const emailFromUser = user?.email || '';

      // Get selected address details
      const selectedAddress = typeof selectedAddressIndex === 'number' ? addresses[selectedAddressIndex] : null;
      
      const payload = {
        userId,
        items: (items || []).map((it) => ({
          productId: it._id || it.id,
          name: it.name || it.title,
          price: Number(it.price || it.salePrice || 0),
          quantity: it.quantity || 1,
          thumbnail: it.thumbnail || it.image || it.img || null,
        })),
        totals: { subtotal, shipping, grandTotal },
        address: { 
          ...form, 
          email: form.email || emailFromUser,
          id: selectedAddress?.id || null, // Store address ID for tracking
          addressType: selectedAddress?.type || 'home'
        },
        coupon: appliedCoupon ? { code: appliedCoupon.code, discount: appliedCoupon.discount } : undefined,
      };

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Order failed');
      alert('Order created successfully');
    } catch (err) {
      alert(err?.message || 'Order failed');
    }
  };

  const isAddressComplete = (addr) => {
    if (!addr) return false;
    const emailCandidate = form.email || addr.email || getUserEmail();
    const required = [
      addr.firstName,
      addr.lastName,
      addr.street,
      addr.city,
      addr.state,
      addr.pin,
      addr.phone,
      emailCandidate,
    ];
    return required.every((v) => !!String(v || '').trim());
  };

  const proceedToPayment = () => {
    // Prevent double click
    if (typeof window !== 'undefined') {
      if (window.__checkout_navigating__) return;
      window.__checkout_navigating__ = true;
      setTimeout(() => { try { delete window.__checkout_navigating__; } catch {} }, 5000);
    }
        const selected = typeof selectedAddressIndex === 'number' ? addresses[selectedAddressIndex] : null;
    if (!selected) {
      alert('Please select a delivery address first');
      return;
    }
    if (!isAddressComplete(selected)) {
      alert('Please fill complete address (name, street, city, state, PIN, phone)');
      return;
    }

    const raw = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
    const user = raw ? JSON.parse(raw) : null;
    const userId = user?._id || user?.id;
    const emailFromUser = user?.email || form.email || '';

    const clientOrderId = `co_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const payload = {
      clientOrderId,
      userId,
      items: (items || []).map((it) => ({
        productId: it._id || it.id,
        name: it.name || it.title,
        price: Number(it.price || it.salePrice || 0),
        quantity: it.quantity || 1,
        thumbnail: it.thumbnail || it.image || it.img || null,
      })),
      totals: { subtotal, shipping, platformFee, grandTotal },
      paymentMethod: 'prepaid',
      address: {
        ...selected,
        email: form.email || emailFromUser,
      },
      coupon: appliedCoupon ? { code: appliedCoupon.code, discount: appliedCoupon.discount } : undefined,
    };

    try {
      localStorage.setItem('pending_order_payload', JSON.stringify(payload));
    } catch {}

    router.push('/payment');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen mt-4 bg-white py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen mt-4 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="uppercase tracking-widest text-gray-500 mb-3 text-sm md:text-2xl flex items-center justify-center text-center">
          <Link href="/cart" className="hover:underline">Shopping Cart</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">Checkout Details</span>
          <span className="mx-2">›</span>
          <span className="text-gray-400">Order Complete</span>
        </nav>

        <div className="text-sm text-gray-600 mb-1">
          Have a coupon? <span className="text-black cursor-pointer">Click here to enter your code</span>
        </div>
        <div className="h-[2px] bg-gray-200 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing form */}
          <form onSubmit={placeOrder} className="lg:col-span-2">
            {/* LOGIN Section */}
            <div className={`${isAuthenticated ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-blue-600 text-white'} p-4 rounded mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">1 LOGIN</span>
                  {isAuthenticated && <span className="text-green-600">✓</span>}
                </div>
                {!isAuthenticated && (
                <button type="button" onClick={() => router.push('/login')} className="text-sm underline">CHANGE</button>
                )}
              </div>
              <div className="mt-2 text-sm">
                {isAuthenticated
                  ? (form.email ? `${form.firstName || 'User'} ${form.lastName || ''} ${form.phone ? '+91'+form.phone : ''}` : 'Logged in')
                  : 'Please login first'}
              </div>
            </div>

            {/* DELIVERY ADDRESS Section */}
            {/* DELIVERY ADDRESS Section - Always show header */}
            <div className="bg-blue-600 text-white p-4 rounded mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">2 DELIVERY ADDRESS</span>
                  {selectedAddressIndex !== null && !isChangingAddress && <span className="text-green-300">✓</span>}
                </div>
                {selectedAddressIndex !== null && !isChangingAddress && (
                  <button 
                    type="button"
                    onClick={changeAddress}
                    className="text-sm underline"
                  >
                    CHANGE
                  </button>
                )}
              </div>
              {/* Show selected address details when address is selected and not changing */}
              {selectedAddressIndex !== null && !isChangingAddress && (
                <div className="mt-2 text-sm">
                  {(() => {
                    const address = addresses[selectedAddressIndex];
                    return address ? `${address.firstName} ${address.lastName}, ${address.street}, ${address.city}, ${address.state} - ${address.pin}` : '';
                  })()}
                </div>
              )}
            </div>

            {/* Address List - Always show initially, hide only when address is selected and not changing */}
            {isChangingAddress && (
              <div className="space-y-3 mb-4">
                {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 w-full ${
                    selectedAddressIndex === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  {/* Card layout */}
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressIndex === index}
                      onChange={() => selectAddress(index)}
                      className="mt-1"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-semibold text-sm sm:text-base">
                          {address.firstName} {address.lastName}
                        </span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-[10px] sm:text-xs font-medium">
                          {address.type}
                        </span>
                        {address.isDefault && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[10px] sm:text-xs font-semibold">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-1 break-words">
                        +91{address.phone}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 leading-snug break-words">
                        {address.street}, {address.city}, {address.state} - {address.pin}
                      </div>
                      {address.landmark && (
                        <div className="text-[11px] sm:text-xs text-gray-500 mt-1">
                          <span className="font-medium">Landmark:</span> {address.landmark}
                        </div>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex sm:flex-col md:flex-row gap-2 self-stretch sm:self-auto">
                      <button
                        type="button"
                        onClick={() => editAddress(index)}
                        className="text-blue-600 text-xs sm:text-sm underline"
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteAddress(index)}
                        className="text-red-600 text-xs sm:text-sm underline"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                  {selectedAddressIndex === index && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAddressIndex(index);
                          setIsChangingAddress(false);
                        }}
                        className="bg-orange-500 text-white px-6 py-2 rounded font-semibold"
                      >
                        DELIVER HERE
                      </button>
                    </div>
                  )}
                </div>
                ))}

              {/* No addresses message */}
              {addresses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">No addresses found. Please add an address to continue.</p>
                </div>
              )}

              {/* Add New Address Button */}
              {addresses.length < 6 && (
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 text-blue-600 text-sm underline"
                >
                  <span className="text-lg">+</span>
                  Add a new address
                </button>
              )}
              </div>
            )}

            {/* Add/Edit Address Form */}
            {showAddForm && (
              <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                <h3 className="font-semibold mb-4">
                  {editingAddressIndex !== null ? 'Edit Address' : 'Add New Address'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">First name *</label>
                    <input 
                      value={newAddress.firstName} 
                      onChange={updateNewAddress("firstName")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Last name *</label>
                    <input 
                      value={newAddress.lastName} 
                      onChange={updateNewAddress("lastName")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm" 
                      required 
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-gray-600 mb-1">Street address *</label>
                  <input 
                    value={newAddress.street} 
                    onChange={updateNewAddress("street")} 
                    placeholder="House number and street name" 
                    className="w-full border border-gray-300 px-3 py-2 text-sm" 
                    required 
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">City *</label>
                    <input 
                      value={newAddress.city} 
                      onChange={updateNewAddress("city")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">State *</label>
                    <input 
                      value={newAddress.state} 
                      onChange={updateNewAddress("state")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">PIN *</label>
                    <input 
                      value={newAddress.pin} 
                      onChange={updateNewAddress("pin")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm" 
                      required 
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Phone *</label>
                    <input 
                      value={newAddress.phone} 
                      onChange={updateNewAddress("phone")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Address Type *</label>
                    <select 
                      value={newAddress.type} 
                      onChange={updateNewAddress("type")} 
                      className="w-full border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="HOME">HOME</option>
                      <option value="WORK">WORK</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs text-gray-600 mb-1">Landmark (optional)</label>
                  <input 
                    value={newAddress.landmark} 
                    onChange={updateNewAddress("landmark")} 
                    placeholder="e.g., Near Metro Station, Behind Mall, etc."
                    className="w-full border border-gray-300 px-3 py-2 text-sm" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Help delivery person find your location easily</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                  <label htmlFor="isDefault" className="text-sm text-gray-600">
                    Set as default address
                  </label>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={editingAddressIndex !== null ? updateAddress : addAddress}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    {editingAddressIndex !== null ? 'UPDATE ADDRESS' : 'ADD ADDRESS'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelAddEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded text-sm"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            {/* ORDER SUMMARY Section - Always show header, but content only when address selected */}
            <div className={`${selectedAddressIndex !== null && !isChangingAddress ? 'opacity-100' : 'opacity-50 pointer-events-none'} bg-blue-600 text-white p-4 rounded mb-4`} >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">3 ORDER SUMMARY</span>
                {selectedAddressIndex !== null && !isChangingAddress && <span className="text-green-300">✓</span>}
              </div>
            </div>

            {/* Order Items Display - Only show when address is selected and not changing */}
            {selectedAddressIndex !== null && !isChangingAddress && (
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={item.id || index} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                        <Image
                          src={item.thumbnail || item.image || item.img || '/placeholder-image.jpg'}
                          alt={item.name || item.title}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {item.name || item.title || 'Product'}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">Pack of {item.quantity || 1}</p>
                        
                        {/* Store Info */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-600">Store: Kushwaha Hardware</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Assured</span>
                        </div>
                        
                        {/* Delivery Info */}
                        <p className="text-xs text-green-600 mb-2">Delivery by {new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                        
                        {/* Price Details */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{((item.price || item.salePrice || 0) * (item.quantity || 1)).toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{((item.originalPrice || 0) * (item.quantity || 1)).toLocaleString()}
                            </span>
                          )}
                          {item.discount && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                              {item.discount}% Off
                            </span>
                          )}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id || index, (item.quantity || 1) - 1)}
                            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-sm hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity || 1}</span>
                          <button 
                            type="button"
                            onClick={() => updateQuantity(item.id || index, (item.quantity || 1) + 1)}
                            className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center text-sm hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button 
                          type="button"
                          onClick={() => removeItem(item.id || index)}
                          className="text-red-600 text-xs underline mt-2 hover:text-red-800"
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Order Confirmation Email */}
                <div className="text-sm text-gray-600 mb-4">
                  Order confirmation email will be sent to {form.email || 'your email'}
                </div>
                
                {/* Totals (mirrors PRICE DETAILS) */}
                <div className="border rounded-lg p-4 bg-white shadow-sm mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Charges</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">{currency(subtotal)}</span></div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between"><span>Coupon Discount</span><span className="font-semibold text-green-600">- {currency(discountAmount)}</span></div>
                    )}
                    <div className="flex justify-between"><span>Delivery Fee</span><span className="font-semibold">{currency(shipping)}</span></div>
                    <div className="flex justify-between"><span>Platform Fee</span><span className="font-semibold">{currency(platformFee)}</span></div>
                    <div className="border-t pt-2 flex justify-between font-bold text-base"><span>Total Payable</span><span>{currency(grandTotal)}</span></div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={proceedToPayment}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded font-semibold text-lg"
                >
                  CONTINUE
                </button>
              </div>
            )}

            
          </form>

          {/* Summary */}
          <aside className="bg-white p-3 sm:p-5 border border-gray-300 h-fit shadow-[inset_0_0_0_2px_#f3c34b] w-full">
            <h3 className="text-gray-900 font-semibold mb-3 sm:mb-4 tracking-wide text-base sm:text-lg">
              PRICE DETAILS
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">{currency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-2">
                  <span>Platform Fee</span>
                  <svg 
                    className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    onClick={() => setShowPlatformFeePopup(true)}
                  >
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-semibold">{currency(platformFee)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center">
                  <span>Coupon Discount</span>
                  <span className="font-semibold text-green-600">- {currency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Delivery Fee</span>
                <span className="font-semibold">{currency(shipping)}</span>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3">
                <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                  <span>Total Payable</span>
                  <span>{currency(grandTotal)}</span>
                </div>
              </div>

              {/* Coupon Apply */}
              <div className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={couponCode}
                    onChange={(e)=>{ setCouponCode(e.target.value); setCouponError(""); }}
                    placeholder="Enter coupon code"
                    className="flex-1 border px-3 py-2 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!couponCode.trim()) return;
                      try {
                        const raw = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
                        const user = raw ? JSON.parse(raw) : null;
                        const userId = user?._id || user?.id;

                        const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            code: couponCode, 
                            orderAmount: subtotal,
                            userId,
                            items: items.map(it => ({
                              productId: it._id || it.id,
                              price: Number(it.price || it.salePrice || 0),
                              quantity: it.quantity || 1
                            }))
                          })
                        });
                        const data = await res.json();
                        if (!res.ok || !data.success) throw new Error(data.message || 'Invalid coupon');
                        setAppliedCoupon({ 
                          code: data.data.code, 
                          discount: data.data.discount,
                          caption: data.data.caption
                        });
                        setCouponError("");
                      } catch (e) {
                        setAppliedCoupon(null);
                        setCouponError(e.message || 'Invalid coupon');
                      }
                    }}
                    className="px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded w-full sm:w-auto"
                  >Apply</button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2">
                    <div className="text-green-600 text-xs sm:text-sm">
                      Applied {appliedCoupon.code}: -{currency(appliedCoupon.discount)}
                    </div>
                    {appliedCoupon.caption && (
                      <div className="text-xs text-amber-600 italic mt-1">
                        {appliedCoupon.caption}
                      </div>
                    )}
                  </div>
                )}
                {couponError && (
                  <div className="text-red-600 text-xs sm:text-sm mt-2">
                    {couponError}
                  </div>
                )}
              </div>

              {totalSavings > 0 && (
                <div className="text-green-600 text-xs sm:text-sm font-medium">
                  Your Total Savings on this order {currency(totalSavings)}
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 text-[11px] sm:text-xs mt-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mt-4 leading-relaxed">
              By continuing with the order, you confirm that you are above 18 years of age, and you agree to the{" "}
              <span className="text-blue-600 underline cursor-pointer">Terms of Use</span> and{" "}
              <span className="text-blue-600 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </aside>
        </div>
      </div>

      {/* Platform Fee Popup */}
      {showPlatformFeePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPlatformFeePopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Popup Content */}
            <div className="pr-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Fee</h3>
              <p className="text-gray-700 leading-relaxed">
                A non-refundable fee is charged to help keep the platform running smoothly and support app improvements.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



