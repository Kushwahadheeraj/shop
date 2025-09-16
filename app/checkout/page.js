"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import API_BASE_URL from "@/lib/apiConfig";

const STORAGE_KEY = "euser_checkout_address";

function currency(amount) {
  const n = Number(amount || 0);
  return `₹${n.toLocaleString()}`;
}

export default function CheckoutPage() {
  const { items = [], total = 0 } = useCart() || { items: [], total: 0 };

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

  // Load from localStorage once and prefill email from logged-in user
  useEffect(() => {
    try {
      console.log('=== CHECKOUT EMAIL DEBUG ===');
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      // First load saved form data
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      let savedForm = {};
      if (raw) {
        savedForm = JSON.parse(raw);
        console.log('Saved form data:', savedForm);
      }
      
      // Always load user data and override email (force user's email)
      const rawUser = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
      console.log('Raw euser data:', rawUser);
      
      if (rawUser) {
        const user = JSON.parse(rawUser);
        console.log('Parsed user:', user);
        if (user?.email) {
          savedForm.email = user.email; // Always use user's email
          console.log('✅ Email set to:', user.email);
        } else {
          console.log('❌ No email found in user object');
        }
      } else {
        console.log('❌ No euser found in localStorage - User needs to login first');
        console.log('Please login using the login/register button in the header');
      }
      
      console.log('Final form data being set:', savedForm);
      setForm((f) => ({ ...f, ...savedForm }));
    } catch (err) {
      console.error('Failed to load form data:', err);
    }
  }, []);

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

  const shipping = 0;
  const grandTotal = subtotal + shipping;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
      const user = raw ? JSON.parse(raw) : null;
      const userId = user?._id || user?.id;
      const emailFromUser = user?.email || '';

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
        address: { ...form, email: form.email || emailFromUser },
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

  return (
    <div className="min-h-screen mt-36 bg-white py-6">
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
            <h2 className="text-gray-900 font-semibold mb-4 tracking-wide">BILLING DETAILS</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-gray-600 mb-1">First name *</label>
                <input value={form.firstName} onChange={update("firstName")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Last name *</label>
                <input value={form.lastName} onChange={update("lastName")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs text-gray-600 mb-1">Country / Region *</label>
              <input value={form.country} onChange={update("country")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
            </div>

            <div className="mt-4">
              <label className="block text-xs text-gray-600 mb-1">Street address *</label>
              <input value={form.street} onChange={update("street")} placeholder="House number and street name" className="w-full border border-gray-300 px-3 py-2 text-sm" required />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Town / City *</label>
                <input value={form.city} onChange={update("city")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">State *</label>
                <input value={form.state} onChange={update("state")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">PIN *</label>
                <input value={form.pin} onChange={update("pin")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Phone *</label>
                <input value={form.phone} onChange={update("phone")} className="w-full border border-gray-300 px-3 py-2 text-sm" required />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Email address *</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={form.email} 
                    readOnly 
                    className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-100 cursor-not-allowed" 
                    // placeholder="Will be filled automatically from your account"
                    required 
                  />
                  {form.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                  )}
                </div>
                {form.email ? (
                  <p className="text-xs text-green-600 mt-1">✓ Pre-filled from your account: {form.email}</p>
                ) : (
                  <p className="text-xs text-red-600 mt-1">⚠️ Please login first to auto-fill your email</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs text-gray-600 mb-1">Order notes (optional)</label>
              <textarea value={form.notes} onChange={update("notes")} rows={4} className="w-full border border-gray-300 px-3 py-2 text-sm" placeholder="Notes about your order, e.g. special notes for delivery." />
            </div>

            
          </form>

          {/* Summary */}
          <aside className="bg-white p-4 sm:p-5 border border-gray-300 h-fit shadow-[inset_0_0_0_2px_#f3c34b]">
            <h3 className="text-gray-900 font-semibold mb-2 tracking-wide">YOUR ORDER</h3>
            <div className="space-y-0 text-sm">
              <div className="flex justify-between text-gray-500 border-b pb-2 uppercase text-xs">
                <span>PRODUCT</span>
                <span>SUBTOTAL</span>
              </div>
              {items.map((it) => (
                <div key={(it._id || it.id || it.name) + String(it.variant || "")} className="flex justify-between text-gray-700 border-b py-2">
                  <span className="truncate max-w-[65%]">{(it.name || it.title || "Item")} × {it.quantity || 1}</span>
                  <span className="font-semibold">{currency((it.price || it.salePrice || 0) * (it.quantity || 1))}</span>
                </div>
              ))}

              <div className="flex justify-between text-gray-700 border-t pt-2">
                <span>Subtotal</span>
                <span className="font-semibold">{currency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700 border-b pb-2">
                <span>Shipping</span>
                <span className="text-xs text-gray-600">Shipping Charges: {shipping === 0 ? currency(0) : currency(shipping)}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-semibold border-t pt-2">
                <span>Total</span>
                <span>{currency(grandTotal)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Sorry, it seems that there are no available payment methods for your state. Please contact us if you require assistance or wish to make alternate arrangements.
            </p>
            <button onClick={placeOrder} className="mt-4 bg-black text-white px-4 py-2 text-sm w-full">PLACE ORDER</button>
            <p className="text-[11px] text-gray-600 mt-4">
              Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <span className="underline">privacy policy</span>.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}



