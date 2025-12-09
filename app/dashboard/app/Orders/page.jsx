"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

const datePresetToRange = (preset) => {
  const now = new Date();
  const start = new Date(now);
  switch (preset) {
    case "1d": start.setDate(now.getDate() - 1); break;
    case "3d": start.setDate(now.getDate() - 3); break;
    case "1w": start.setDate(now.getDate() - 7); break;
    case "15d": start.setDate(now.getDate() - 15); break;
    case "30d": start.setDate(now.getDate() - 30); break;
    case "6m": start.setMonth(now.getMonth() - 6); break;
    case "1y": start.setFullYear(now.getFullYear() - 1); break;
    default: return { from: "", to: "" };
  }
  return { from: start.toISOString(), to: now.toISOString() };
};

export default function OrdersPage() {
  const [q, setQ] = useState("");
  const [preset, setPreset] = useState("");
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const printRef = useRef(null);

  const getCustomerName = (order) => {
    const nameFromAddress = [order?.address?.firstName, order?.address?.lastName].filter(Boolean).join(' ');
    if (nameFromAddress) return nameFromAddress;
    return order?.userId?.name || order?.userId?.username || order?.userId?.email || '-';
  };

  const getCustomerPhone = (order) => {
    return order?.address?.phone || order?.userId?.phone || '';
  };

  const getCustomerEmail = (order) => {
    return order?.address?.email || order?.userId?.email || '';
  };

  const params = useMemo(() => {
    const url = new URLSearchParams();
    if (q) url.set("q", q);
    if (status) url.set("status", status);
    if (preset) {
      const { from, to } = datePresetToRange(preset);
      if (from) url.set("from", from);
      if (to) url.set("to", to);
    }
    url.set("limit", "200");
    return url.toString();
  }, [q, status, preset]);

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

  const openOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      const data = await res.json();
      setSelected(data.data);
    } catch {}
  };

  const addTracking = async (orderId, newStatus, note) => {
    if (!newStatus) return;
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note })
      });
      if (res.ok) {
        const data = await res.json();
        setSelected(data.data);
        fetchOrders();
      }
    } catch {}
  };

  const printInvoice = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '', 'height=800,width=800');
    win.document.write('<html><head><title>Invoice</title>');
    win.document.write('<style>body{font-family: Arial;} .container{max-width:800px;margin:0 auto;padding:16px;} .title{text-align:center;font-size:20px;font-weight:700;margin-bottom:8px;} .subtitle{text-align:center;color:#555;margin-bottom:16px;} table{width:100%;border-collapse:collapse;margin-top:12px;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background:#f5f5f5;} .totals{margin-top:12px;text-align:right;} .meta{font-size:12px;color:#555;} .center{text-align:center}</style>');
    win.document.write('</head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Orders</h1>
            </div>
            <p className="text-xs sm:text-sm text-amber-50">View orders, update tracking, and print invoice</p>
          </div>
          <a href="/Orders/Delivered" className="inline-flex items-center justify-center px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md text-xs sm:text-sm transition-all whitespace-nowrap">All delivered orders</a>
        </div>
      </div>

      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Search</label>
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Name, email or phone" className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500">
              <option value="">All</option>
              <option value="created">Created</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Date range</label>
            <select value={preset} onChange={(e)=>setPreset(e.target.value)} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500">
              <option value="">All time</option>
              <option value="1d">Last 1 day</option>
              <option value="3d">Last 3 days</option>
              <option value="1w">Last 1 week</option>
              <option value="15d">Last 15 days</option>
              <option value="30d">Last 30 days</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last 1 year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={fetchOrders} className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium">Refresh</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Orders list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={5} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">Loading...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">No orders found</td></tr>
                ) : (
                  orders.filter((o) => o.status !== 'delivered').map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        <div className="break-words">#{o._id.slice(-6)}</div>
                        <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900">
                        <div className="break-words">{getCustomerName(o)}</div>
                        <div className="text-xs text-gray-500 break-words">{getCustomerPhone(o)}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-900 whitespace-nowrap">₹{o.totals?.grandTotal?.toFixed(2) ?? '0.00'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{o.status}</span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                        <button className="text-amber-600 hover:text-amber-800 text-xs sm:text-sm font-medium" onClick={()=>openOrder(o._id)}>View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {error && <div className="p-3 text-xs sm:text-sm text-red-600">{error}</div>}
        </div>

        {/* Details + Invoice + Tracking */}
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          {!selected ? (
            <div className="text-gray-500 text-center py-12 sm:py-16 text-sm sm:text-base">Select an order to view details</div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-base sm:text-lg font-semibold break-words">Order #{selected._id?.slice(-6)}</div>
                  <div className="text-xs text-gray-500">Placed on {new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <button onClick={printInvoice} className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md text-xs sm:text-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium w-full sm:w-auto">Print Invoice</button>
              </div>

              {/* Printable invoice content */}
              <div ref={printRef} className="hidden print:block">
                <div className="container">
                  <div className="title">Kushwaha Hardware</div>
                  <div className="subtitle">Invoice</div>
                  <div className="meta">Payment Method: {selected.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (Online)'}</div>
                  <div className="meta">Invoice ID: #{selected._id?.slice(-6)} | Date: {new Date(selected.createdAt).toLocaleString()}</div>
                  <hr />
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
                    <div>
                      <div><strong>Customer:</strong> {getCustomerName(selected)}</div>
                      <div className="meta">{[selected.address?.street, selected.address?.city, selected.address?.state, selected.address?.pin].filter(Boolean).join(', ')}</div>
                    </div>
                    <div className="meta">
                      <div><strong>Phone:</strong> {getCustomerPhone(selected)}</div>
                      <div><strong>Email:</strong> {getCustomerEmail(selected)}</div>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items?.map((it, idx) => (
                        <tr key={idx}>
                          <td>{it.name}</td>
                          <td>{it.quantity}</td>
                          <td>₹{(it.price ?? 0).toFixed(2)}</td>
                          <td>₹{((it.price ?? 0) * (it.quantity ?? 1)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="totals">
                    <div>Subtotal: ₹{selected.totals?.subtotal?.toFixed(2) ?? '0.00'}</div>
                    <div>Delivery Fee: ₹{selected.totals?.shipping?.toFixed(2) ?? '0.00'}</div>
                    <div>Platform Fee: ₹{selected.totals?.platformFee?.toFixed(2) ?? '0.00'}</div>
                    <div><strong>Grand Total: ₹{selected.totals?.grandTotal?.toFixed(2) ?? '0.00'}</strong></div>
                  </div>
                  <div className="center meta" style={{marginTop:12}}>Thank you for shopping with Kushwaha Hardware</div>
                </div>
              </div>

              {/* On-screen details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="border rounded-md p-2 sm:p-3">
                  <div className="font-medium mb-2 text-sm sm:text-base">Customer</div>
                  <div className="text-xs sm:text-sm break-words">{getCustomerName(selected)}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">{[selected.address?.street, selected.address?.city, selected.address?.state, selected.address?.pin].filter(Boolean).join(', ')}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">{getCustomerPhone(selected)}{getCustomerEmail(selected) ? ` • ${getCustomerEmail(selected)}` : ''}</div>
                </div>
                <div className="border rounded-md p-2 sm:p-3">
                  <div className="font-medium mb-2 text-sm sm:text-base">Order Summary</div>
                  <div className="text-xs text-gray-600 mb-1">Payment Method: <span className="font-medium">{selected.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Prepaid (Online)'}</span></div>
                  <div className="text-xs sm:text-sm">Subtotal: ₹{selected.totals?.subtotal?.toFixed(2) ?? '0.00'}</div>
                  <div className="text-xs sm:text-sm">Delivery Fee: ₹{selected.totals?.shipping?.toFixed(2) ?? '0.00'}</div>
                  <div className="text-xs sm:text-sm">Platform Fee: ₹{selected.totals?.platformFee?.toFixed(2) ?? '0.00'}</div>
                  <div className="text-xs sm:text-sm font-semibold">Grand Total: ₹{selected.totals?.grandTotal?.toFixed(2) ?? '0.00'}</div>
                </div>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <table className="w-full border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-2 border text-xs sm:text-sm">Product</th>
                      <th className="text-left p-2 border text-xs sm:text-sm">Qty</th>
                      <th className="text-left p-2 border text-xs sm:text-sm">Price</th>
                      <th className="text-left p-2 border text-xs sm:text-sm">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 border text-xs sm:text-sm break-words">{it.name}</td>
                        <td className="p-2 border text-xs sm:text-sm">{it.quantity}</td>
                        <td className="p-2 border text-xs sm:text-sm whitespace-nowrap">₹{(it.price ?? 0).toFixed(2)}</td>
                        <td className="p-2 border text-xs sm:text-sm whitespace-nowrap">₹{((it.price ?? 0) * (it.quantity ?? 1)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tracking update */}
              <div className="border rounded-md p-2 sm:p-3">
                <div className="font-medium mb-2 text-sm sm:text-base">Tracking Updates</div>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {(selected.tracking || []).slice().reverse().map((t, idx) => (
                    <div key={idx} className="text-xs sm:text-sm text-gray-700 break-words">
                      <span className="font-medium">{t.status}</span>
                      {t.note ? <span> - {t.note}</span> : null}
                      <span className="text-gray-500"> ({new Date(t.at).toLocaleString()})</span>
                    </div>
                  ))}
                  {(!selected.tracking || selected.tracking.length === 0) && (
                    <div className="text-xs sm:text-sm text-gray-500">No tracking updates yet.</div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3">
                  <select id="st" className="px-2 py-2 text-xs sm:text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" defaultValue="">
                    <option value="" disabled>Choose status</option>
                    <option value="processing">Processing</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <input id="note" placeholder="Optional note" className="px-2 py-2 text-xs sm:text-sm border border-gray-300 rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
                  <button
                    onClick={() => {
                      const s = document.getElementById('st').value;
                      const n = document.getElementById('note').value;
                      addTracking(selected._id, s, n);
                      document.getElementById('note').value='';
                    }}
                    className="px-3 py-2 text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium md:col-span-3"
                  >Add Update</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


