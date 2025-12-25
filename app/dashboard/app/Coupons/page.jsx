// "use client";
// import React, { useEffect, useMemo, useState } from "react";
// import { Sparkles } from "lucide-react";
// import API_BASE_URL from "@/lib/apiConfig";

// export default function CouponsPage() {
//   const [form, setForm] = useState({
//     code: "",
//     discountType: "percent",
//     discountValue: 10,
//     minOrderAmount: 0,
//     maxDiscountAmount: 0,
//     startsAt: "",
//     endsAt: "",
//     usageLimit: 0,
//   });
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const fetchCoupons = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}/coupons`);
//       const data = await res.json();
//       setList(data.data || []);
//     } catch (e) {
//       setError(e.message || 'Failed to load coupons');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateCode = () => {
//     const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
//     setForm((f) => ({ ...f, code: `KHW-${seed}` }));
//   };

//   const createCoupon = async () => {
//     if (!form.code) { alert('Generate a coupon code first'); return; }
//     try {
//       const payload = {
//         ...form,
//         discountValue: Number(form.discountValue),
//         minOrderAmount: Number(form.minOrderAmount),
//         maxDiscountAmount: Number(form.maxDiscountAmount),
//         usageLimit: Number(form.usageLimit),
//         createdByEmail: 'seller@kushwahahardware.com',
//       };
//       const res = await fetch(`${API_BASE_URL}/coupons`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
//       const data = await res.json();
//       if (!res.ok || !data.success) throw new Error(data.message || 'Failed to create');
//       setForm((f) => ({ ...f, code: "" }));
//       fetchCoupons();
//       alert('Coupon created');
//     } catch (e) {
//       alert(e.message || 'Failed to create coupon');
//     }
//   };

//   useEffect(() => { fetchCoupons(); }, []);

//   return (
//     <div className="max-w-5xl mx-auto p-4 sm:p-6">
//       {/* Hero Header */}
//       <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
//         <div className="flex items-center gap-2 sm:gap-3 mb-2">
//           <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
//           <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Coupons</h1>
//         </div>
//         <p className="text-xs sm:text-sm text-amber-50">Generate and manage discount coupons</p>
//       </div>

//       <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6 overflow-hidden">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
//           <div className="md:col-span-1">
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Code</label>
//             <div className="flex gap-2 w-full">
//               <input value={form.code} onChange={update('code')} className="flex-1 min-w-0 px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 h-10" placeholder="e.g., KHW-123ABC" />
//               <button onClick={generateCode} className="px-2 sm:px-3 md:px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded text-xs sm:text-sm whitespace-nowrap hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm h-10 font-medium flex-shrink-0">Generate</button>
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Type</label>
//             <select value={form.discountType} onChange={update('discountType')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500">
//               <option value="percent">Percent (%)</option>
//               <option value="flat">Flat (₹)</option>
//             </select>
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Value</label>
//             <input type="number" value={form.discountValue} onChange={update('discountValue')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
//             <input type="number" value={form.minOrderAmount} onChange={update('minOrderAmount')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
//             <input type="number" value={form.maxDiscountAmount} onChange={update('maxDiscountAmount')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Usage Limit (0 = unlimited)</label>
//             <input type="number" value={form.usageLimit} onChange={update('usageLimit')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Starts At</label>
//             <input type="datetime-local" value={form.startsAt} onChange={update('startsAt')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
//           </div>
//           <div>
//             <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Ends At</label>
//             <input type="datetime-local" value={form.endsAt} onChange={update('endsAt')} className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500" />
//           </div>
//         </div>
//         <div className="mt-3 sm:mt-4">
//           <button onClick={createCoupon} className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg w-full sm:w-auto font-medium">Create Coupon</button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Discount</th>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
//                 <th className="px-3 sm:px-6 py-2 sm:py-3"></th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr><td colSpan={7} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">Loading...</td></tr>
//               ) : list.length === 0 ? (
//                 <tr><td colSpan={7} className="px-3 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">No coupons</td></tr>
//               ) : (
//                 list.map((c) => (
//                   <tr key={c._id}>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold break-words">{c.code}</td>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">{c.discountType}</td>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{c.discountType === 'percent' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">₹{c.minOrderAmount || 0}</td>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">₹{c.maxDiscountAmount || 0}</td>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap">{c.usageCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
//                     <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs text-gray-500 whitespace-nowrap">Created {new Date(c.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, Trash2, Pencil } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function CouponsPage() {
  const [form, setForm] = useState({
    _id: null,
    code: "",
    caption: "",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    startsAt: "",
    endsAt: "",
    applicableProducts: [],
  });

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // 🔹 Fetch Coupons
  const fetchCoupons = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE_URL}/coupons`);
    const data = await res.json();
    setList(data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // 🔹 Generate Code
  const generateCode = () => {
    const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    setForm((f) => ({ ...f, code: `KHW-${seed}` }));
  };

  // 🔹 Create / Update Coupon
  const submitCoupon = async () => {
    const method = form._id ? "PUT" : "POST";
    const url = form._id
      ? `${API_BASE_URL}/coupons/${form._id}`
      : `${API_BASE_URL}/coupons`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxDiscountAmount: Number(form.maxDiscountAmount),
        usageLimit: Number(form.usageLimit),
        createdByEmail: "seller@kushwahahardware.com",
      }),
    });

    resetForm();
    fetchCoupons();
  };

  // 🔹 Edit Coupon
  const editCoupon = (c) => {
    setForm({
      ...c,
      startsAt: c.startsAt?.slice(0, 16),
      endsAt: c.endsAt?.slice(0, 16),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Delete Coupon
  const deleteCoupon = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`${API_BASE_URL}/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  const resetForm = () => {
    setForm({
      _id: null,
      code: "",
      caption: "",
      discountType: "percent",
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      startsAt: "",
      endsAt: "",
      applicableProducts: [],
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-lg text-white shadow mb-6">
        <div className="flex items-center gap-2">
          <Sparkles />
          <h1 className="text-2xl font-bold">Coupon Dashboard</h1>
        </div>
        <p className="text-sm text-amber-100">
          Create, edit and track coupon usage
        </p>
      </div>

      {/* Form */}
      <div className="bg-white p-5 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Coupon Code</label>
            <div className="flex gap-2">
              <input
                value={form.code}
                onChange={update("code")}
                className="w-full border rounded px-3 py-2"
              />
              <button
                onClick={generateCode}
                className="bg-amber-500 text-white px-3 rounded"
              >
                Gen
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Caption</label>
            <input
              value={form.caption}
              onChange={update("caption")}
              placeholder="Flat 10% OFF on Pipes"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Discount Type</label>
            <select
              value={form.discountType}
              onChange={update("discountType")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Discount Value</label>
            <input
              type="number"
              value={form.discountValue}
              onChange={update("discountValue")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Min Order</label>
            <input
              type="number"
              value={form.minOrderAmount}
              onChange={update("minOrderAmount")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Max Discount</label>
            <input
              type="number"
              value={form.maxDiscountAmount}
              onChange={update("maxDiscountAmount")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Usage Limit</label>
            <input
              type="number"
              value={form.usageLimit}
              onChange={update("usageLimit")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Starts At</label>
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={update("startsAt")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ends At</label>
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={update("endsAt")}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={submitCoupon}
            className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded"
          >
            {form._id ? "Update Coupon" : "Create Coupon"}
          </button>
          {form._id && (
            <button onClick={resetForm} className="text-gray-600">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3">Caption</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Usage</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              list.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3 font-semibold">{c.code}</td>
                  <td className="p-3">{c.caption || "-"}</td>
                  <td className="p-3">
                    {c.discountType === "percent"
                      ? `${c.discountValue}%`
                      : `₹${c.discountValue}`}
                  </td>
                  <td className="p-3">
                    {c.usageCount || 0}
                    {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  </td>
                  <td className="p-3 flex gap-3 justify-center">
                    <button onClick={() => editCoupon(c)}>
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => deleteCoupon(c._id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
