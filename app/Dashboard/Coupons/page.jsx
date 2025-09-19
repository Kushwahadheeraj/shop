"use client";
import React, { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

export default function CouponsPage() {
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    startsAt: "",
    endsAt: "",
    usageLimit: 0,
  });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/coupons`);
      const data = await res.json();
      setList(data.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    setForm((f) => ({ ...f, code: `KHW-${seed}` }));
  };

  const createCoupon = async () => {
    if (!form.code) { alert('Generate a coupon code first'); return; }
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscountAmount: Number(form.maxDiscountAmount),
        usageLimit: Number(form.usageLimit),
        createdByEmail: 'seller@kushwahahardware.com',
      };
      const res = await fetch(`${API_BASE_URL}/coupons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create');
      setForm((f) => ({ ...f, code: "" }));
      fetchCoupons();
      alert('Coupon created');
    } catch (e) {
      alert(e.message || 'Failed to create coupon');
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Coupons</h1>
        <p className="text-gray-500 text-sm">Generate and manage discount coupons</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <div className="flex gap-2">
              <input value={form.code} onChange={update('code')} className="flex-1 px-3 py-2 border rounded" placeholder="e.g., KHW-123ABC" />
              <button onClick={generateCode} className="px-3 py-2 bg-gray-800 text-white rounded">Generate</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.discountType} onChange={update('discountType')} className="w-full px-3 py-2 border rounded">
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input type="number" value={form.discountValue} onChange={update('discountValue')} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
            <input type="number" value={form.minOrderAmount} onChange={update('minOrderAmount')} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
            <input type="number" value={form.maxDiscountAmount} onChange={update('maxDiscountAmount')} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (0 = unlimited)</label>
            <input type="number" value={form.usageLimit} onChange={update('usageLimit')} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Starts At</label>
            <input type="datetime-local" value={form.startsAt} onChange={update('startsAt')} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ends At</label>
            <input type="datetime-local" value={form.endsAt} onChange={update('endsAt')} className="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={createCoupon} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Coupon</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : list.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No coupons</td></tr>
              ) : (
                list.map((c) => (
                  <tr key={c._id}>
                    <td className="px-6 py-4 text-sm font-semibold">{c.code}</td>
                    <td className="px-6 py-4 text-sm">{c.discountType}</td>
                    <td className="px-6 py-4 text-sm">{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                    <td className="px-6 py-4 text-sm">₹{c.minOrderAmount || 0}</td>
                    <td className="px-6 py-4 text-sm">₹{c.maxDiscountAmount || 0}</td>
                    <td className="px-6 py-4 text-sm">{c.usageCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500">Created {new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


