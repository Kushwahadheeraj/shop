"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Plus, FolderPlus, Eye, X, Trash2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/components/AuthContext";
import API_BASE_URL from "@/lib/apiConfig";

const apiFetch = async (url, options = {}) => {
  const resp = await fetch(url, options);
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.message || "Request failed");
  return data;
};

const FILE_BASE = API_BASE_URL.replace(/\/api$/, "");

const normalizeFiles = (files = []) =>
  files.map((f) => {
    const rawUrl = f.url || "";
    const fullUrl = rawUrl.startsWith("http") ? rawUrl : `${FILE_BASE}${rawUrl}`;
    return {
      ...f,
      id: f._id || f.url || f.originalName,
      name: f.originalName || f.name || "File",
      type: f.mimeType || f.type || "",
      url: fullUrl,
    };
  });

const normalizeShop = (shop) => {
  if (!shop) return shop;
  return {
    ...shop,
    id: shop._id || shop.id,
    files: normalizeFiles(shop.files),
  };
};

export default function ShopManagementPage() {
  const { token } = useAuth();
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [newShopName, setNewShopName] = useState("");
  const [newShopPhone, setNewShopPhone] = useState("");
  const [newShopAddress, setNewShopAddress] = useState("");
  const [filesByShop, setFilesByShop] = useState({});
  const [preview, setPreview] = useState(null); // { url, type, name }
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState(null);

  const selectedShop = useMemo(() => shops.find((s) => s._id === selectedShopId), [shops, selectedShopId]);

  const loadShops = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiFetch("/api/shop-management", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const list = Array.isArray(data?.data) ? data.data.map(normalizeShop) : [];
      setShops(list);
      if (list.length && !selectedShopId) setSelectedShopId(list[0]._id);
      const map = {};
      list.forEach((s) => {
        map[s._id] = s.files || [];
      });
      setFilesByShop(map);
    } catch (err) {
      console.error("Load shops failed:", err);
      alert("Shops load नहीं हो सके. कृपया दुबारा प्रयास करें.");
    } finally {
      setLoading(false);
    }
  }, [token, selectedShopId]);

  useEffect(() => {
    loadShops();
  }, [loadShops]);

  const resetForm = () => {
    setNewShopName("");
    setNewShopPhone("");
    setNewShopAddress("");
    setEditingShop(null);
  };

  const handleAddShop = () => {
    if (!token) {
      alert("Login required");
      return;
    }
    if (!newShopName.trim()) return;
    const payload = { name: newShopName.trim(), phone: newShopPhone.trim(), address: newShopAddress.trim() };

    const isEdit = Boolean(editingShop);
    const url = isEdit ? `/api/shop-management/${editingShop._id}` : "/api/shop-management";
    const method = isEdit ? "PUT" : "POST";

    apiFetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        const shop = normalizeShop(res?.data);
        if (!shop?._id) return;
        if (isEdit) {
          setShops((prev) => prev.map((s) => (s._id === shop._id ? shop : s)));
          setSelectedShopId(shop._id);
          setFilesByShop((prev) => ({ ...prev, [shop._id]: shop.files || [] }));
        } else {
          setShops((prev) => [shop, ...prev]);
          setSelectedShopId(shop._id);
          setFilesByShop((prev) => ({ ...prev, [shop._id]: shop.files || [] }));
        }
        resetForm();
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Create/update shop failed:", err);
        alert("Shop नहीं बन सका. कृपया फिर प्रयास करें.");
      });
  };

  const handleDeleteShop = (shopId) => {
    if (!token) return;
    if (!window.confirm("इस shop को हटाना है?")) return;
    apiFetch(`/api/shop-management/${shopId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setShops((prev) => prev.filter((s) => s._id !== shopId));
        setFilesByShop((prev) => {
          const next = { ...prev };
          delete next[shopId];
          return next;
        });
        if (selectedShopId === shopId) setSelectedShopId(null);
      })
      .catch((err) => {
        console.error("Delete shop failed:", err);
        alert("Shop delete नहीं हुआ.");
      });
  };

  const handleFileAdd = (event) => {
    const files = event.target.files;
    if (!files || !selectedShopId) return;
    if (!token) {
      alert("Login required");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));

    apiFetch(`/api/shop-management/${selectedShopId}/files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
      .then((res) => {
        const shop = normalizeShop(res?.data);
        setFilesByShop((prev) => ({ ...prev, [selectedShopId]: shop?.files || [] }));
      })
      .catch((err) => {
        console.error("Upload failed:", err);
        alert("Upload नहीं हुआ. कृपया दोबारा प्रयास करें.");
      });

    event.target.value = "";
  };

  const handleFileDelete = (file) => {
    if (!token || !selectedShopId) return;
    if (!window.confirm("इस file को हटाना है?")) return;
    const fileId = file._id || file.id;
    if (!fileId) return;
    apiFetch(`/api/shop-management/${selectedShopId}/files/${fileId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const shop = normalizeShop(res?.data);
        setFilesByShop((prev) => ({ ...prev, [selectedShopId]: shop?.files || [] }));
      })
      .catch((err) => {
        console.error("Delete file failed:", err);
        alert("File delete नहीं हो सका.");
      });
  };

  const filesForSelectedShop = filesByShop[selectedShopId] || [];

  const openPreview = (file) => setPreview(file);
  const closePreview = () => setPreview(null);

  const renderPreview = () => {
    if (!preview) return null;
    const isImage = preview.type.startsWith("image/");
    const isPdf = preview.type === "application/pdf" || preview.name?.toLowerCase().endsWith(".pdf");
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="font-semibold text-slate-800 truncate">{preview.name}</div>
            <button
              onClick={closePreview}
              className="p-2 rounded hover:bg-slate-100 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-slate-50 p-4">
            {isImage && (
              <div className="relative w-full min-h-[400px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-auto max-h-[70vh] object-contain bg-white rounded"
                />
              </div>
            )}
            {isPdf && (
              <iframe
                title={preview.name}
                src={preview.url}
                className="w-full h-[70vh] bg-white rounded border"
              />
            )}
            {!isImage && !isPdf && (
              <div className="text-sm text-slate-600">
                Preview not available. File type: {preview.type || "Unknown"}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Hero/Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-5 sm:p-6 lg:p-7 text-white shadow-xl border border-amber-300/40">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="bg-white/15 p-2.5 rounded-xl">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                  Shop Management
                </h1>
              </div>
              <p className="text-sm sm:text-base text-amber-50/90 max-w-2xl">
                दुकानों को जोड़ें, अपडेट करें और उनके PDF/Images को एक ही जगह प्रबंधित करें।
              </p>
            </div>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm sm:text-base font-bold bg-gradient-to-r from-amber-100 via-white to-amber-50 text-amber-700 rounded-xl hover:from-white hover:to-white transition-all duration-200 shadow-lg shadow-amber-400/40"
              >
                <Plus className="w-4 h-4" />
                Shop Add
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left: shops list */}
          <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col">
            <div className="font-semibold text-slate-700 mb-3">Shops</div>
            <div className="flex-1 overflow-auto space-y-2">
              {shops.map((shop) => (
                <div
                  key={shop._id}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    shop._id === selectedShopId
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <button className="flex-1 text-left" onClick={() => setSelectedShopId(shop._id)}>
                    <div className="font-medium">{shop.name}</div>
                    {shop.phone ? <div className="text-xs text-slate-500">{shop.phone}</div> : null}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => {
                        setEditingShop(shop);
                        setNewShopName(shop.name || "");
                        setNewShopPhone(shop.phone || "");
                        setNewShopAddress(shop.address || "");
                        setShowForm(true);
                      }}
                      className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteShop(shop._id)}
                      className="text-xs px-2 py-1 rounded bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {shops.length === 0 && (
                <div className="text-sm text-slate-500">No shops yet. Add your first shop.</div>
              )}
            </div>
          </div>

          {/* Right: files grid */}
          <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col min-h-[420px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="text-lg font-semibold text-slate-800">
                {selectedShop ? selectedShop.name : "Select a shop"}
              </div>
              <label className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 cursor-pointer shadow-sm shadow-amber-300/40 w-full sm:w-auto">
                <FolderPlus className="w-4 h-4" />
                Add PDF/Image
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileAdd}
                  disabled={!selectedShop}
                />
              </label>
            </div>

            {filesForSelectedShop.length === 0 ? (
              <div className="flex-1 grid place-items-center text-slate-500 text-sm">
                No files yet. Add PDF or images for this shop.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filesForSelectedShop.map((file) => {
                  const isImage = file.type?.startsWith("image/");
                  const isPdf = file.type === "application/pdf" || file.name?.toLowerCase().endsWith(".pdf");
                  return (
                    <div
                      key={file.id || file._id || file.url}
                      className="border rounded-lg p-2 bg-slate-50 flex flex-col gap-2 hover:shadow-sm"
                    >
                      <div className="text-xs font-semibold text-slate-700 truncate">
                        {file.name}
                      </div>
                      <div className="text-[11px] text-slate-500 uppercase">
                        {isPdf ? "PDF" : isImage ? "Image" : "File"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openPreview(file)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded hover:from-amber-600 hover:to-orange-600 flex-1"
                        >
                          <Eye className="w-3 h-3" />
                          
                        </button>
                        <button
                          onClick={() => handleFileDelete(file)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100 rounded hover:bg-rose-100 whitespace-nowrap"
                        >
                          <Trash2 className="w-3 h-3" />
                          
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add / Edit shop modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-slate-800">
                {editingShop ? "Edit shop" : "Add shop"}
              </div>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="p-2 rounded hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-600 mb-1">Shop name</div>
                <input
                  value={newShopName}
                  onChange={(e) => setNewShopName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Shop name"
                />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Phone</div>
                <input
                  value={newShopPhone}
                  onChange={(e) => setNewShopPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Phone"
                />
              </div>
              <div>
                <div className="text-sm text-slate-600 mb-1">Address</div>
                <textarea
                  value={newShopAddress}
                  onChange={(e) => setNewShopAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Address"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShop}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-300/50"
              >
                {editingShop ? "Save changes" : "Add shop"}
              </button>
            </div>
          </div>
        </div>
      )}

      {renderPreview()}
    </div>
  );
}

