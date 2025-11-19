"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Trash2, FileText, Wand2, Sparkles, Loader2, Clock, History, FileEdit } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import InvoiceTemplates from "./components/InvoiceTemplates";
import API_BASE_URL from "@/lib/apiConfig";

const UNIT_OPTIONS = [
  { value: "pc", label: "Pc" },
  { value: "kg", label: "Kg" },
  { value: "g", label: "Gram" },
  { value: "mg", label: "Mg" },
  { value: "ltr", label: "Litre" },
  { value: "ml", label: "Ml" },
  { value: "cm", label: "Cm" },
  { value: "m", label: "Meter" },
  { value: "box", label: "Box" },
  { value: "dozen", label: "Dozen" }
];

const createEmptyItem = () => ({
  name: "",
  quantity: 1,
  unitPrice: 0,
  unit: "pc"
});

const todayISO = () => new Date().toISOString().split("T")[0];
const generateInvoiceNumber = () => `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;

const clampCurrency = (value, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
};

const formatShopAddress = (shop) => {
  if (!shop) return "";
  const { street, address, city, stateName, state, pincode, location } = shop;
  const parts = [
    street || address,
    city || location?.city,
    stateName || state || location?.state,
    pincode || location?.pincode
  ];
  return parts.filter(Boolean).join(", ");
};

const formatDisplayDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const InvoiceGeneratorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();

  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [currentBillId, setCurrentBillId] = useState(null);
  const [issuerType, setIssuerType] = useState("shop"); // 'shop' | 'custom'
  const [selectedShopId, setSelectedShopId] = useState("");
  const [issuerDetails, setIssuerDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: ""
  });
  const [invoiceMeta, setInvoiceMeta] = useState({
    invoiceNumber: generateInvoiceNumber(),
    invoiceDate: todayISO(),
    dueDate: "",
    notes: ""
  });
  const [pricingAdjustments, setPricingAdjustments] = useState({
    discountValue: 0,
    discountType: "amount",
    paidAmount: 0
  });
  const [items, setItems] = useState([createEmptyItem()]);
  const [isTemplatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [billHistory, setBillHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // 'form' or 'history'
  const invoiceIdParam = searchParams?.get("id");

  const currentShop = useMemo(
    () => shops.find((shop) => shop?._id === selectedShopId),
    [selectedShopId, shops]
  );

  const resetForm = useCallback(() => {
    setCurrentBillId(null);
    setIssuerType("shop");
    setSelectedShopId(shops[0]?._id || "");
    setIssuerDetails({ name: "", address: "", phone: "", email: "" });
    setCustomerDetails({ name: "", address: "", phone: "", email: "" });
    setInvoiceMeta({
      invoiceNumber: generateInvoiceNumber(),
      invoiceDate: todayISO(),
      dueDate: "",
      notes: ""
    });
    setPricingAdjustments({ discountValue: 0, discountType: "amount", paidAmount: 0 });
    setItems([createEmptyItem()]);
    setSelectedTemplate(null);
  }, [shops]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0;
        const rate = parseFloat(item.unitPrice) || 0;
        return sum + qty * rate;
      }, 0),
    [items]
  );

  const discountAmount = useMemo(() => {
    if (pricingAdjustments.discountType === "percent") {
      const percent = clampCurrency(pricingAdjustments.discountValue, 0, 100);
      return Math.round(((subtotal * percent) / 100 + Number.EPSILON) * 100) / 100;
    }
    return clampCurrency(pricingAdjustments.discountValue, 0, subtotal);
  }, [pricingAdjustments.discountType, pricingAdjustments.discountValue, subtotal]);

  const totalAmount = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount]);

  const paidAmount = useMemo(() => {
    const value = pricingAdjustments.paidAmount;
    // Allow empty string or 0, treat empty as 0
    if (value === '' || value === null || value === undefined) {
      return 0;
    }
    return clampCurrency(Number(value) || 0, 0, totalAmount);
  }, [pricingAdjustments.paidAmount, totalAmount]);

  const balanceAmount = useMemo(() => Math.max(0, totalAmount - paidAmount), [totalAmount, paidAmount]);

  const preparedBill = useMemo(() => {
    const sanitizedItems = items
      .map((item) => ({
        name: (item.name || "").trim(),
        quantity: clampCurrency(item.quantity, 0, 99999),
        unitPrice: clampCurrency(item.unitPrice, 0, 999999),
        unit: item.unit || "pc"
      }))
      .filter((item) => item.name && item.quantity > 0);

    if (sanitizedItems.length === 0) {
      return null;
    }

    const itemsWithAmount = sanitizedItems.map((item) => ({
      ...item,
      amount: Math.round((item.quantity * item.unitPrice + Number.EPSILON) * 100) / 100
    }));

    const issuer = issuerType === "shop" ? currentShop : issuerDetails;
    const issuerName =
      issuerType === "shop"
        ? issuer?.name || "Shop"
        : issuerDetails.name || "Business / Owner Name";
    const issuerAddress =
      issuerType === "shop"
        ? formatShopAddress(issuer)
        : issuerDetails.address || "";
    const issuerPhone =
      issuerType === "shop"
        ? issuer?.contact?.phone || issuer?.phone || ""
        : issuerDetails.phone || "";
    const issuerEmail =
      issuerType === "shop"
        ? issuer?.contact?.email || issuer?.email || ""
        : issuerDetails.email || "";

    const customerName =
      customerDetails.name ||
      (issuerType === "shop" ? "Valued Customer" : issuer?.name || "Customer");

    return {
      billNumber: invoiceMeta.invoiceNumber,
      invoiceNumber: invoiceMeta.invoiceNumber,
      invoiceDate: invoiceMeta.invoiceDate,
      dueDate: invoiceMeta.dueDate || null,
      notes: invoiceMeta.notes,
      shopName: issuerName,
      shopAddress: issuerAddress,
      shopPhone: issuerPhone,
      shopEmail: issuerEmail,
      customerName,
      customerAddress: customerDetails.address || "",
      customerPhone: customerDetails.phone || "",
      customerEmail: customerDetails.email || "",
      items: itemsWithAmount,
      pricing: {
        subtotal: Math.round((subtotal + Number.EPSILON) * 100) / 100,
        discount: Math.round((discountAmount + Number.EPSILON) * 100) / 100,
        totalAmount: Math.round((totalAmount + Number.EPSILON) * 100) / 100
      },
      payment: {
        paidAmount: Math.round((paidAmount + Number.EPSILON) * 100) / 100,
        remainingAmount: Math.round((balanceAmount + Number.EPSILON) * 100) / 100,
        method: "cash",
        status:
          paidAmount >= totalAmount ? "paid" : paidAmount > 0 ? "partial" : "pending"
      },
      templateId: selectedTemplate?.id || "default",
      issuerType
    };
  }, [
    items,
    issuerType,
    currentShop,
    issuerDetails,
    customerDetails,
    invoiceMeta,
    subtotal,
    discountAmount,
    totalAmount,
    paidAmount,
    balanceAmount
  ]);

  const fetchShops = useCallback(async () => {
    try {
      setShopsLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await fetch(`${API_BASE_URL}/shops`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json().catch(() => ({}));
      const list = data?.data?.shops || data?.data || [];
      if (Array.isArray(list)) {
        setShops(list);
        if (issuerType === "shop" && list.length && !selectedShopId) {
          setSelectedShopId(list[0]._id);
        }
      }
    } catch (error) {
      // console.error("Failed to load shops", error);
    } finally {
      setShopsLoading(false);
    }
  }, [issuerType, selectedShopId]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated()) {
        router.push("/login/seller");
      } else if (!isSeller()) {
        router.push("/");
      }
    }
  }, [authLoading, isAuthenticated, isSeller, router]);

  const handleItemChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addNewItem = () => {
    setItems((prev) => [...prev, createEmptyItem()]);
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const buildPayload = useCallback(() => {
    if (!preparedBill) return null;
    const payload = {
      invoiceNumber: preparedBill.invoiceNumber,
      billDate: preparedBill.invoiceDate,
      dueDate: preparedBill.dueDate,
      notes: invoiceMeta.notes,
      items: preparedBill.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        unit: item.unit || "pc"
      })),
      pricing: preparedBill.pricing,
      payment: preparedBill.payment,
      customerName: preparedBill.customerName,
      customerAddress: preparedBill.customerAddress,
      customerPhone: preparedBill.customerPhone,
      customerEmail: preparedBill.customerEmail,
      shopName: preparedBill.shopName,
      shopAddress: preparedBill.shopAddress,
      shopPhone: preparedBill.shopPhone,
      shopEmail: preparedBill.shopEmail,
      templateId: preparedBill.templateId
    };
    if (issuerType === "shop" && selectedShopId) {
      payload.shopId = selectedShopId;
    }
    return payload;
  }, [preparedBill, invoiceMeta.notes, issuerType, selectedShopId]);

  const fetchBillHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const params = new URLSearchParams({ limit: "25", sort: "desc" });
      const response = await fetch(`${API_BASE_URL}/invoices?${params.toString()}`, { headers });
      const data = await response.json().catch(() => ({}));
      const list = data?.data || [];
      setBillHistory(Array.isArray(list) ? list : []);
    } catch (error) {
      // console.error("Failed to fetch invoice history", error);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const loadInvoiceById = useCallback(
    async (id) => {
      if (!id) return;
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, { headers });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load invoice");
        }
        const bill = data?.data?.bill || data?.bill || data?.data || data;
        if (!bill) throw new Error("Invoice not found");
        setCurrentBillId(bill._id || id);
        const invoiceDateSource = bill.invoiceDate || bill.billDate || bill.createdAt;
        setInvoiceMeta({
          invoiceNumber: bill.billNumber || bill.invoiceNumber || generateInvoiceNumber(),
          invoiceDate: invoiceDateSource
            ? new Date(invoiceDateSource).toISOString().split("T")[0]
            : todayISO(),
          dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split("T")[0] : "",
          notes: bill.notes || bill.description || ""
        });
        const mappedItems =
          Array.isArray(bill.items) && bill.items.length
            ? bill.items.map((item) => ({
                name: item.name || "",
                quantity: item.quantity ?? item.qty ?? 0,
                unitPrice: item.unitPrice ?? item.rate ?? 0,
                unit: item.unit || "pc"
              }))
            : [createEmptyItem()];
        setItems(mappedItems);
        setPricingAdjustments({
          discountValue: bill.pricing?.discount || 0,
          discountType: "amount",
          paidAmount: bill.payment?.paidAmount || 0
        });
        setCustomerDetails({
          name: bill.customerName || "",
          address: bill.customerAddress || "",
          phone: bill.customerPhone || "",
          email: bill.customerEmail || ""
        });
        const resolvedShopId =
          (typeof bill.shopId === "object" ? bill.shopId?._id : bill.shopId) ||
          shops.find((shop) => shop.name === bill.shopName)?._id ||
          "";
        if (resolvedShopId) {
          setIssuerType("shop");
          setSelectedShopId(resolvedShopId);
          setIssuerDetails({ name: "", address: "", phone: "", email: "" });
        } else {
          setIssuerType("custom");
          setIssuerDetails({
            name: bill.shopName || "",
            address: bill.shopAddress || "",
            phone: bill.shopPhone || "",
            email: bill.shopEmail || ""
          });
        }
        if (bill.templateId || bill.metadata?.templateId) {
          setSelectedTemplate({ id: bill.templateId || bill.metadata?.templateId });
        } else {
          setSelectedTemplate(null);
        }
      } catch (error) {
        // console.error("Failed to load invoice", error);
        alert(error.message || "Failed to load invoice");
      }
    },
    [shops]
  );

  const handleSaveAndPreview = useCallback(async () => {
    if (!preparedBill) {
      alert("कम से कम एक वैध आइटम जोड़ें।");
      return;
    }
    const payload = buildPayload();
    if (!payload) {
      alert("इनवॉइस डेटा अधूरा है।");
      return;
    }
    // Validate required fields
    if (!payload.items || !Array.isArray(payload.items) || payload.items.length === 0) {
      alert("कम से कम एक आइटम जोड़ें।");
      return;
    }
    if (!payload.shopName && !payload.shopId) {
      alert("कृपया दुकान का नाम या दुकान चुनें।");
      return;
    }
    try {
      setSaving(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        throw new Error("Authentication token not found. Please login again.");
      }
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
      const url = currentBillId ? `${API_BASE_URL}/invoices/${currentBillId}` : `${API_BASE_URL}/invoices`;
      const method = currentBillId ? "PUT" : "POST";
      
      // console.log("Saving invoice:", { url, method, payloadKeys: Object.keys(payload) });
      
      let response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(payload)
        });
      } catch (fetchError) {
        // console.error("Network error:", fetchError);
        throw new Error(`Network error: ${fetchError.message}. Please check your internet connection.`);
      }
      
      let data;
      let responseText = '';
      try {
        responseText = await response.text();
        if (responseText) {
          data = JSON.parse(responseText);
        } else {
          data = { success: false, message: 'Empty response from server' };
        }
      } catch (parseError) {
        // console.error("Failed to parse response:", parseError);
        // console.error("Response text:", responseText);
        // console.error("Response status:", response.status);
        throw new Error(`Server response is not valid JSON. Status: ${response.status}`);
      }
      
      if (!response.ok || data?.success === false) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}` || "Failed to save invoice";
        // Log error details separately to avoid Next.js console interception issues
        // console.error("API Error - Status:", response.status);
        // console.error("API Error - Status Text:", response.statusText);
        // console.error("API Error - Response Text:", responseText);
        // console.error("API Error - Parsed Data:", JSON.stringify(data, null, 2));
        // console.error("API Error - Payload Keys:", payload ? Object.keys(payload) : []);
        throw new Error(errorMessage);
      }
      const savedBill = data?.data?.bill || data?.bill || data?.data || payload;
      const newId = savedBill?._id || currentBillId;
      if (savedBill?.templateId) {
        setSelectedTemplate({ id: savedBill.templateId });
      }
      if (newId) {
        setCurrentBillId(newId);
        fetchBillHistory();
        router.push(`/Dashboard/InvoiceGenerator/${newId}`);
      } else {
        router.push("/Dashboard/InvoiceGenerator");
      }
    } catch (error) {
      // Log error details separately to avoid Next.js console interception issues
      // console.error("Failed to save invoice");
      // console.error("Error name:", error?.name);
      // console.error("Error message:", error?.message);
      // console.error("Error stack:", error?.stack);
      // console.error("Error string:", error?.toString());
      
      const errorMessage = error?.message || error?.toString() || "Failed to save invoice. Please check your connection and try again.";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  }, [preparedBill, buildPayload, currentBillId, fetchBillHistory, router]);

  const handleNewInvoice = useCallback(() => {
    resetForm();
    router.push("/Dashboard/InvoiceGenerator");
  }, [resetForm, router]);

useEffect(() => {
  if (!authLoading && isAuthenticated()) {
    fetchBillHistory();
  }
}, [authLoading, fetchBillHistory, isAuthenticated]);

useEffect(() => {
  if (invoiceIdParam) {
    loadInvoiceById(invoiceIdParam);
  } else {
    resetForm();
  }
}, [invoiceIdParam, loadInvoiceById, resetForm]);

  if (authLoading || (!isAuthenticated() && !authLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated() || !isSeller()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Professional Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                Professional Invoice Generator
              </h1>
              <p className="text-sm sm:text-base text-emerald-50/90 mt-2 max-w-2xl">
                तुरंत बिल बनाइये — दुकान के नाम से या सीधे ग्राहक के नाम से, आइटम जोड़ें और QR से पेमेंट दिखाएँ।
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setTemplatePickerOpen(true)}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
                type="button"
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">Choose Template</span>
                <span className="sm:hidden">Template</span>
              </button>
              <button
                onClick={handleNewInvoice}
                className="inline-flex items-center gap-2 bg-white text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                type="button"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-2 shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "form"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
            >
              <FileEdit className="w-4 h-4" />
              <span className="hidden sm:inline">Invoice Form</span>
              <span className="sm:hidden">Form</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                if (billHistory.length === 0) {
                  fetchBillHistory();
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              type="button"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Invoice History</span>
              <span className="sm:hidden">History</span>
            </button>
          </div>
        </div>

        {activeTab === "form" ? (
          <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Invoice Details Section - Full Width */}
            <section className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Invoice Details</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceMeta.invoiceNumber}
                    onChange={(e) => setInvoiceMeta((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:bg-gray-50 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Bill Date
                  </label>
                  <input
                    type="date"
                    value={invoiceMeta.invoiceDate}
                    onChange={(e) => setInvoiceMeta((prev) => ({ ...prev, invoiceDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:bg-gray-50 font-medium text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={invoiceMeta.dueDate}
                    onChange={(e) => setInvoiceMeta((prev) => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white hover:bg-gray-50 font-medium text-gray-900"
                  />
                </div>
              </div>
            </section>

            {/* Bill From and Customer Details - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bill From Section */}
              <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bill From</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  issuerType === "shop"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300"
                }`}
                onClick={() => setIssuerType("shop")}
                type="button"
              >
                दुकान से बिल काटें
              </button>
              <button
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  issuerType === "custom"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300"
                }`}
                onClick={() => setIssuerType("custom")}
                type="button"
              >
                ग्राहक / कस्टम नाम से बिल काटें
              </button>
            </div>

            {issuerType === "shop" ? (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-600">
                  Select Shop
                </label>
                <select
                  value={selectedShopId}
                  onChange={(e) => setSelectedShopId(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                >
                  <option value="">
                    {shopsLoading
                      ? "Loading shops..."
                      : shops.length
                      ? "Select shop"
                      : "No shops found"}
                  </option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
                {currentShop && (
                  <div className="text-sm text-gray-600 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 shadow-sm">
                    <div className="font-bold text-gray-900 mb-1 text-base">{currentShop.name}</div>
                    <div className="text-gray-700 mb-2">{formatShopAddress(currentShop)}</div>
                    {(currentShop.contact?.phone || currentShop.contact?.email) && (
                      <div className="mt-2 space-y-1 pt-2 border-t border-emerald-200">
                        {currentShop.contact?.phone && <div className="flex items-center gap-2">📞 <span className="font-medium">{currentShop.contact.phone}</span></div>}
                        {currentShop.contact?.email && <div className="flex items-center gap-2">✉️ <span className="font-medium">{currentShop.contact.email}</span></div>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Issuer / Business Name
                  </label>
                  <input
                    type="text"
                    value={issuerDetails.name}
                    onChange={(e) =>
                      setIssuerDetails((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                    placeholder="उदाहरण: Sharma Traders"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={issuerDetails.phone}
                    onChange={(e) =>
                      setIssuerDetails((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                    placeholder="+91-"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={issuerDetails.address}
                    onChange={(e) =>
                      setIssuerDetails((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                    placeholder="पूरा पता"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={issuerDetails.email}
                    onChange={(e) =>
                      setIssuerDetails((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                    placeholder="yourshop@example.com"
                  />
                </div>
              </div>
            )}
              </section>

              {/* Customer Details Section */}
              <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Customer Details</h2>
                </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerDetails.name}
                  onChange={(e) =>
                    setCustomerDetails((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                  placeholder="ग्राहक का नाम (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={customerDetails.phone}
                  onChange={(e) =>
                    setCustomerDetails((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                  placeholder="+91-"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={customerDetails.address}
                  onChange={(e) =>
                    setCustomerDetails((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                  placeholder="डिलीवरी/ग्राहक पता"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(e) =>
                    setCustomerDetails((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900"
                  placeholder="customer@example.com"
                />
              </div>
              </div>
              </section>
            </div>

            {/* Items Section - Full Width */}
            <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Items</h2>
              </div>
              <button
                onClick={addNewItem}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const lineTotal =
                  Math.round(((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0) + Number.EPSILON) * 100) /
                  100;
                return (
                  <div
                    key={`item-${index}`}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white border-2 border-gray-200 rounded-xl p-4 items-center hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder="Item name"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white font-medium text-gray-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        placeholder="Qty"
                        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white font-medium text-gray-900 text-center"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <select
                        value={item.unit || "pc"}
                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                        className="w-full px-2 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white font-medium text-gray-900 text-sm"
                      >
                        {UNIT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                        placeholder="Rate"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50 hover:bg-white font-medium text-gray-900 text-right"
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-start">
                      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border-2 border-emerald-200 px-4 py-2 rounded-lg w-full">
                        <p className="text-sm font-bold text-emerald-700 text-right">
                          ₹{lineTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-1 flex justify-end">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </section>

            {/* Notes Section - Full Width */}
            <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
              <label className="block text-sm font-bold text-gray-900">
                Notes (प्रिंट पर दिखेगा)
              </label>
            </div>
            <textarea
              rows={3}
              value={invoiceMeta.notes}
              onChange={(e) => setInvoiceMeta((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-gray-50/50 hover:bg-white font-medium text-gray-900 resize-none"
              placeholder="Thank you for shopping with us!"
            />
            </section>

            {/* Summary Section - Full Width at Bottom */}
            <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Summary</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Subtotal</span>
                    <span className="text-base font-bold text-gray-900">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Discount</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={pricingAdjustments.discountValue}
                        onChange={(e) =>
                          setPricingAdjustments((prev) => ({
                            ...prev,
                            discountValue: e.target.value
                          }))
                        }
                        className="w-20 sm:w-24 px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right font-medium bg-white"
                      />
                      <select
                        value={pricingAdjustments.discountType}
                        onChange={(e) =>
                          setPricingAdjustments((prev) => ({
                            ...prev,
                            discountType: e.target.value
                          }))
                        }
                        className="px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold bg-white"
                      >
                        <option value="amount">₹</option>
                        <option value="percent">%</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3 py-2 border-b border-gray-200">
                    <span className="text-sm font-semibold text-gray-700">Paid (Optional)</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={pricingAdjustments.paidAmount === 0 ? '' : pricingAdjustments.paidAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPricingAdjustments((prev) => ({ 
                          ...prev, 
                          paidAmount: value === '' ? '' : (Number(value) || 0)
                        }));
                      }}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          setPricingAdjustments((prev) => ({ ...prev, paidAmount: 0 }));
                        }
                      }}
                      className="w-20 sm:w-24 px-3 py-1.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right font-medium bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-2xl font-extrabold text-white">₹{totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/30">
                      <span className="text-sm font-semibold text-emerald-50">Balance</span>
                      <span className="text-lg font-bold text-white">
                        ₹{balanceAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveAndPreview}
                    disabled={!preparedBill || saving}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100"
                    type="button"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                    {saving ? "Saving..." : "Save & Preview Invoice"}
                  </button>
                  <p className="text-xs text-gray-600 text-center bg-white/50 rounded-lg p-2">
                    Preview पेज से आप प्रिंट, PDF डाउनलोड और इनवॉइस एडिट कर सकते हैं।
                  </p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* History Tab */
          <div className="space-y-6">
            <section className="bg-white border-2 border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Invoice History</h2>
                </div>
                <button
                  onClick={fetchBillHistory}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                  type="button"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
              {historyLoading ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : billHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 font-medium">
                    अभी तक कोई सेव्ड इनवॉइस नहीं है। एक नया बिल बनाएँ और सेव करें।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {billHistory.map((bill) => {
                    const total =
                      bill.pricing?.totalAmount ??
                      bill.totalAmount ??
                      bill.pricing?.subtotal ??
                      0;
                    return (
                      <div
                        key={bill._id}
                        className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                          currentBillId === bill._id
                            ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md ring-2 ring-emerald-200"
                            : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 hover:shadow-md"
                        }`}
                        onClick={() => {
                          setActiveTab("form");
                          router.push(`/Dashboard/InvoiceGenerator?id=${bill._id}`);
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {bill.billNumber || bill.invoiceNumber || "Invoice"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {formatDisplayDate(
                                bill.billDate || bill.invoiceDate || bill.createdAt
                              )}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            bill.payment?.status === "paid" 
                              ? "bg-green-100 text-green-700"
                              : bill.payment?.status === "partial"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {bill.payment?.status || "pending"}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-semibold text-gray-900">
                              {bill.customerName || "Customer"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span className="font-bold text-emerald-700 text-base">
                              ₹{Number(total || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTab("form");
                              router.push(`/Dashboard/InvoiceGenerator?id=${bill._id}`);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/Dashboard/InvoiceGenerator/${bill._id}`);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
                            type="button"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {isTemplatePickerOpen && (
        <InvoiceTemplates
          onClose={() => setTemplatePickerOpen(false)}
          onSelectTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
        />
      )}
    </div>
  );
};

export default InvoiceGeneratorPage;

