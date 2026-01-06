"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, Trash2, Pencil, RefreshCw, Check } from "lucide-react";
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliesToAll, setAppliesToAll] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetails, setSelectedDetails] = useState([]);

  // 🔹 Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resCoupons, resProducts] = await Promise.all([
        fetch(`${API_BASE_URL}/coupons`),
        fetch(`${API_BASE_URL}/products`)
      ]);
      
      const dataCoupons = await resCoupons.json();
      const dataProducts = await resProducts.json();
      
      setList(dataCoupons.data || []);
      // Handle array response from products endpoint
      setProducts(Array.isArray(dataProducts) ? dataProducts : (dataProducts.data || []));
    } catch (e) {
      console.error("Failed to load data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Search Products
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/search?q=${term}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Search failed", e);
      }
    } else if (term.length === 0) {
      // Reload initial random list
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : (data.data || []));
    }
  };

  // 🔹 Form Handlers
  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const toggleProduct = (product) => {
    const productId = product._id;
    
    // Update selectedDetails
    setSelectedDetails(prev => {
      const existsInDetails = prev.some(p => p._id === productId);
      if (existsInDetails) {
        return prev.filter(p => p._id !== productId);
      } else {
        return [...prev, product];
      }
    });

    // Update form
    setForm(prev => {
      const current = prev.applicableProducts || [];
      const exists = current.includes(productId);
      
      if (exists) {
        return { ...prev, applicableProducts: current.filter(id => id !== productId) };
      } else {
        return { ...prev, applicableProducts: [...current, productId] };
      }
    });
  };

  const handleAppliesToAllChange = (e) => {
    const isAll = e.target.checked;
    setAppliesToAll(isAll);
    if (isAll) {
      setForm(f => ({ ...f, applicableProducts: [] }));
      setSelectedDetails([]);
    }
  };

  const generateCode = () => {
    const seed = Math.random().toString(36).slice(2, 8).toUpperCase();
    setForm((f) => ({ ...f, code: `KHW-${seed}` }));
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
    setAppliesToAll(true);
    setSelectedDetails([]);
  };

  // 🔹 Submit (Create / Update)
  const submitCoupon = async () => {
    if (!form.code) return alert("Code is required");
    if (!appliesToAll && form.applicableProducts.length === 0) {
      return alert("Please select at least one product or check 'Applies to All'");
    }

    const method = form._id ? "PUT" : "POST";
    const url = form._id
      ? `${API_BASE_URL}/coupons/${form._id}`
      : `${API_BASE_URL}/coupons`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountValue: Number(form.discountValue),
          minOrderAmount: Number(form.minOrderAmount),
          maxDiscountAmount: Number(form.maxDiscountAmount),
          usageLimit: Number(form.usageLimit),
          // If appliesToAll is true, ensure applicableProducts is empty
          applicableProducts: appliesToAll ? [] : form.applicableProducts,
          createdByEmail: "seller@kushwahahardware.com", // TODO: Get from auth
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(form._id ? "Coupon Updated" : "Coupon Created");
        resetForm();
        fetchData();
      } else {
        alert(data.message || "Failed");
      }
    } catch (e) {
      alert(e.message);
    }
  };

  // 🔹 Edit Setup
  const editCoupon = async (c) => {
    setForm({
      ...c,
      startsAt: c.startsAt ? c.startsAt.slice(0, 16) : "",
      endsAt: c.endsAt ? c.endsAt.slice(0, 16) : "",
      applicableProducts: c.applicableProducts || [],
    });
    setAppliesToAll(!c.applicableProducts || c.applicableProducts.length === 0);
    
    // Fetch details for selected products
    if (c.applicableProducts && c.applicableProducts.length > 0) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: c.applicableProducts })
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setSelectedDetails(data);
        }
      } catch (e) {
        console.error("Failed to fetch selected product details", e);
      }
    } else {
      setSelectedDetails([]);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Delete
  const deleteCoupon = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    await fetch(`${API_BASE_URL}/coupons/${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 rounded-lg text-white shadow-lg mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Coupon Management</h1>
            <p className="text-amber-100 text-sm">Create, edit and track discounts</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 🔹 Form Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              {form._id ? <Pencil className="w-4 h-4"/> : <Sparkles className="w-4 h-4"/>}
              {form._id ? "Edit Coupon" : "Create New Coupon"}
            </h2>
            
            <div className="space-y-4">
              {/* Code */}
              <div>
                <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                <div className="flex gap-2 mt-1">
                  <input
                    value={form.code}
                    onChange={update("code")}
                    className="flex-1 border rounded px-3 py-2 uppercase font-mono"
                    placeholder="SUMMER2024"
                  />
                  <button
                    onClick={generateCode}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-gray-600 transition"
                    title="Generate Random Code"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="text-sm font-medium text-gray-700">Caption (Public)</label>
                <input
                  value={form.caption}
                  onChange={update("caption")}
                  className="w-full border rounded px-3 py-2 mt-1"
                  placeholder="e.g., Get 50% off on all shoes!"
                />
                <p className="text-xs text-gray-400 mt-1">This text will be shown to customers in the shop.</p>
              </div>

              {/* Discount Type */}
              <div>
                <label className="text-sm font-medium text-gray-700">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={update("discountType")}
                  className="w-full border rounded px-3 py-2 mt-1 bg-white"
                >
                  <option value="percent">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="random_upto">Random Up To (₹)</option>
                </select>
                {form.discountType === 'random_upto' && (
                  <p className="text-xs text-amber-600 mt-1">
                    Customer gets a random discount between ₹1 and roughly half of the value provided.
                  </p>
                )}
              </div>

              {/* Value */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {form.discountType === 'percent' ? 'Percentage Value' : 'Discount Amount (₹)'}
                </label>
                <input
                  type="number"
                  value={form.discountValue}
                  onChange={update("discountValue")}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>

              {/* Product Applicability */}
              <div className="border-t pt-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input 
                    type="checkbox" 
                    checked={appliesToAll} 
                    onChange={handleAppliesToAllChange}
                    className="rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium">Applies to All Products</span>
                </label>
                
                {!appliesToAll && (
                  <div className="bg-gray-50 p-3 rounded border">
                    <input 
                      type="text" 
                      placeholder="Search products by name..." 
                      value={searchTerm}
                      onChange={handleSearch}
                      className="w-full border rounded px-3 py-2 text-sm mb-3"
                    />

                    {selectedDetails.length > 0 && (
                       <div className="mb-3 flex flex-wrap gap-2">
                          {selectedDetails.map(p => (
                             <span key={p._id} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                                <span className="max-w-[150px] truncate">{p.name}</span>
                                <button onClick={() => toggleProduct(p)} className="hover:text-red-600 font-bold">×</button>
                             </span>
                          ))}
                       </div>
                    )}

                    <div className="border rounded max-h-60 overflow-y-auto bg-white">
                       {products.length === 0 ? (
                         <p className="text-gray-500 p-4 text-center text-sm">No products found</p>
                       ) : (
                         products.map(p => {
                           const isSelected = form.applicableProducts.includes(p._id);
                           const img = p.image || p.thumbnail || (p.images && p.images[0]) || null;
                           return (
                             <label key={p._id} className={`flex items-center gap-3 p-2 hover:bg-gray-50 border-b last:border-0 cursor-pointer ${isSelected ? 'bg-amber-50' : ''}`}>
                               <input 
                                 type="checkbox"
                                 checked={isSelected}
                                 onChange={() => toggleProduct(p)}
                                 className="rounded text-amber-500"
                               />
                               {img ? (
                                 <img src={img} alt="" className="w-8 h-8 object-cover rounded bg-gray-100" />
                               ) : (
                                 <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">Img</div>
                               )}
                               <div className="flex-1 min-w-0">
                                 <div className="text-sm font-medium truncate" title={p.name}>{p.name}</div>
                                 <div className="text-xs text-gray-500">₹{p.price || p.mrp || p.salePrice || 0}</div>
                               </div>
                             </label>
                           );
                         })
                       )}
                    </div>
                  </div>
                )}
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Min Order (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={update("minOrderAmount")}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={update("maxDiscountAmount")}
                    className="w-full border rounded px-3 py-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Usage Limit (Total)</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={update("usageLimit")}
                  placeholder="0 for unlimited"
                  className="w-full border rounded px-3 py-2 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Total number of times this coupon can be used by anyone.</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-sm font-medium text-gray-700">Starts</label>
                    <input type="datetime-local" value={form.startsAt} onChange={update("startsAt")} className="w-full border rounded px-2 py-2 text-xs" />
                 </div>
                 <div>
                    <label className="text-sm font-medium text-gray-700">Ends</label>
                    <input type="datetime-local" value={form.endsAt} onChange={update("endsAt")} className="w-full border rounded px-2 py-2 text-xs" />
                 </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={submitCoupon}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded font-medium hover:shadow-lg transition"
                >
                  {form._id ? "Update Coupon" : "Create Coupon"}
                </button>
                {form._id && (
                  <button onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* 🔹 List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Info</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limits</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading coupons...</td></tr>
                  ) : list.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No coupons found. Create one!</td></tr>
                  ) : (
                    list.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800">{c.code}</span>
                            {c.caption && <span className="text-xs text-amber-600 italic">{c.caption}</span>}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {c.discountType === 'percent' && `${c.discountValue}% Off`}
                            {c.discountType === 'flat' && `₹${c.discountValue} Flat`}
                            {c.discountType === 'random_upto' && `Up to ₹${c.discountValue} Random`}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                           {c.applicableProducts && c.applicableProducts.length > 0 ? (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                               Specific Products
                             </span>
                           ) : (
                             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                               All Products
                             </span>
                           )}
                           <div className="text-xs text-gray-400 mt-1">
                             Min: ₹{c.minOrderAmount}
                           </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                           {c.startsAt && <div>Start: {new Date(c.startsAt).toLocaleDateString()}</div>}
                           {c.endsAt && <div>End: {new Date(c.endsAt).toLocaleDateString()}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-1">
                            <span className={`font-bold ${c.usageLimit > 0 && c.usageCount >= c.usageLimit ? 'text-red-500' : 'text-gray-700'}`}>
                              {c.usageCount}
                            </span>
                            <span className="text-gray-400">/ {c.usageLimit || '∞'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => editCoupon(c)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteCoupon(c._id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
