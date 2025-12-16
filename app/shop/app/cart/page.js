'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCart() || { items: [], total: 0 };
  const hasItems = Array.isArray(items) && items.length > 0;
  const router = useRouter();

  const handleCheckout = () => {
    const rawUser = typeof window !== 'undefined' ? localStorage.getItem('euser') : null;
    if (!rawUser) {
      router.push('/login');
      return;
    }
    
    try {
      const user = JSON.parse(rawUser);
      if (!user || !(user._id || user.id)) {
        router.push('/login');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }
    
    router.push('/checkout');
  };

  const handleCheckoutClick = () => {
    if (!hasItems) return;
    handleCheckout();
  };

  const calcDiscount = (it) => {
    const qty = it.quantity || 1;
    if (typeof it.originalPrice === 'number' && it.originalPrice > (it.price || 0)) {
      return (Number(it.originalPrice) - Number(it.price || 0)) * qty;
    }
    return 0;
  };

  const totalDiscount = Array.isArray(items) ? items.reduce((s, it) => s + calcDiscount(it), 0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-36 mb-16">
      <h1 className="text-2xl font-bold tracking-wide mb-6">SHOPPING CART</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 border rounded-md overflow-hidden">
          {/* Header hidden on small screens */}
          <div className="hidden sm:grid grid-cols-12 bg-gray-50 text-xs font-semibold text-gray-600 px-4 py-3">
            <div className="col-span-6">PRODUCT</div>
            <div className="col-span-2 text-right">PRICE</div>
            <div className="col-span-2 text-center">QUANTITY</div>
            <div className="col-span-2 text-right">SUBTOTAL</div>
          </div>
          <div>
            {items.length === 0 && (
              <div className="p-6 text-sm text-gray-500">Your cart is empty.</div>
            )}
            {items.map((it, idx) => (
              <div
                key={`${it._id}-${idx}`}
                className="border-t px-4 py-4 grid grid-cols-1 sm:grid-cols-12 gap-3"
              >
                <div className="flex items-center gap-3 sm:col-span-6">
                  <button onClick={() => removeItem(it._id)} className="w-6 h-6 rounded-full border text-gray-400 hover:text-gray-700 hover:border-gray-700">×</button>
                  <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                    {it.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.thumbnail} alt={it.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{it.name}</p>
                    {calcDiscount(it) > 0 && (
                      <p className="text-xs text-gray-500">You save ₹{calcDiscount(it).toLocaleString('en-IN')}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end sm:col-span-2 text-sm">
                  <span className="sm:hidden text-xs text-gray-500">Price</span>
                  <span>₹{Number(it.price || 0).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between sm:justify-center sm:col-span-2">
                  <span className="sm:hidden text-xs text-gray-500">Qty</span>
                  <div className="flex items-center border rounded">
                    <button className="px-2 py-1 text-gray-600" onClick={() => updateQuantity(it._id, (it.quantity || 1) - 1)}>-</button>
                    <span className="px-3 text-sm">{it.quantity || 1}</span>
                    <button className="px-2 py-1 text-gray-600" onClick={() => updateQuantity(it._id, (it.quantity || 1) + 1)}>+</button>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end sm:col-span-2 font-semibold">
                  <span className="sm:hidden text-xs text-gray-500">Subtotal</span>
                  <span>₹{(Number(it.price || 0) * (it.quantity || 1)).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3">
            <Link href="/Shop" className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded-md hover:bg-gray-50">⟵ CONTINUE SHOPPING</Link>
          </div>
        </div>

        {/* Summary */}
        <div className="border rounded-md p-4 h-fit">
          <h2 className="text-sm font-bold mb-4">CART TOTALS</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-semibold">₹{Number(total).toLocaleString()}</span></div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-gray-700"><span className="">Discount</span><span className="font-semibold">- ₹{totalDiscount.toLocaleString('en-IN')}</span></div>
            )}
            <div className="pt-3 border-t">
              <div className="text-gray-600 text-xs">Shipping</div>
              <div className="text-xs text-gray-500 mt-1">Shipping Charges: ₹0.00</div>
              <div className="text-xs text-gray-500">Change address</div>
            </div>
            <div className="flex justify-between pt-3 border-t"><span className="text-gray-600">Total</span><span className="font-bold">₹{Number(total).toLocaleString()}</span></div>
          </div>
          <button
            onClick={handleCheckoutClick}
            disabled={!hasItems}
            className={`w-full mt-4 font-semibold py-2 rounded-md ${
              hasItems
                ? 'bg-gray-900 hover:bg-black text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            PROCEED TO CHECKOUT
          </button>
          {/* <div className="mt-4">
            <div className="flex items-center gap-2 text-sm font-semibold"><span>Coupon</span></div>
            <div className="flex gap-2 mt-2">
              <input className="flex-1 border rounded-md px-3 py-2 text-sm" placeholder="Coupon code" />
              <button className="px-4 py-2 bg-gray-100 border rounded-md text-sm">Apply coupon</button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
