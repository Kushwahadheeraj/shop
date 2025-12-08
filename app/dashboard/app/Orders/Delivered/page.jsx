"use client";
import React, { useEffect, useMemo, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

export default function DeliveredOrdersPage() {
  const [q, setQ] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useMemo(() => {
    const url = new URLSearchParams();
    url.set("status", "delivered");
    if (q) url.set("q", q);
    url.set("limit", "200");
    return url.toString();
  }, [q]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders?${params}`);
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      setOrders(data.data || []);
      setError("");
    } catch (e) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Delivered Orders</h1>
        <p className="text-gray-500 text-sm">All completed deliveries</p>
        <div className="mt-3">
          <a href="/Orders" className="inline-flex items-center px-3 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-800">Back to active orders</a>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Name, email or phone" className="w-full md:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No delivered orders</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>#{o._id.slice(-6)}</div>
                      <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>{[o.address?.firstName, o.address?.lastName].filter(Boolean).join(' ') || o.userId?.name || o.userId?.username || o.userId?.email || '-'}</div>
                      <div className="text-xs text-gray-500">{o.address?.phone || o.userId?.phone || ''}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{o.totals?.grandTotal?.toFixed(2) ?? '0.00'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(o.updatedAt || o.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {error && <div className="p-3 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}


