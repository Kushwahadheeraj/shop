"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Trash2, FileText, Wand2, Sparkles, Loader2, Clock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../components/AuthContext";
import InvoiceTemplates from "./components/InvoiceTemplates";

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
      const response = await fetch("/api/shops", {
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
      console.error("Failed to load shops", error);
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
      const response = await fetch(`/api/invoices?${params.toString()}`, { headers });
      const data = await response.json().catch(() => ({}));
      const list = data?.data || [];
      setBillHistory(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to fetch invoice history", error);
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
        const response = await fetch(`/api/invoices/${id}`, { headers });
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
        console.error("Failed to load invoice", error);
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
      const url = currentBillId ? `/api/invoices/${currentBillId}` : `/api/invoices`;
      const method = currentBillId ? "PUT" : "POST";
      
      console.log("Saving invoice:", { url, method, payloadKeys: Object.keys(payload) });
      
      let response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: JSON.stringify(payload)
        });
      } catch (fetchError) {
        console.error("Network error:", fetchError);
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
        console.error("Failed to parse response:", parseError);
        console.error("Response text:", responseText);
        console.error("Response status:", response.status);
        throw new Error(`Server response is not valid JSON. Status: ${response.status}`);
      }
      
      if (!response.ok || data?.success === false) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}` || "Failed to save invoice";
        // Log error details separately to avoid Next.js console interception issues
        console.error("API Error - Status:", response.status);
        console.error("API Error - Status Text:", response.statusText);
        console.error("API Error - Response Text:", responseText);
        console.error("API Error - Parsed Data:", JSON.stringify(data, null, 2));
        console.error("API Error - Payload Keys:", payload ? Object.keys(payload) : []);
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
      console.error("Failed to save invoice");
      console.error("Error name:", error?.name);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);
      console.error("Error string:", error?.toString());
      
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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 via-sky-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Sparkles className="w-7 h-7" />
              Quick Invoice Creator
            </h1>
            <p className="text-sm text-blue-100 mt-2">
              तुरंत बिल बनाइये — दुकान के नाम से या सीधे ग्राहक के नाम से, आइटम जोड़ें और QR से पेमेंट दिखाएँ।
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTemplatePickerOpen(true)}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              type="button"
            >
              <Wand2 className="w-4 h-4" />
              Choose Template
            </button>
            <button
              onClick={handleNewInvoice}
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
              type="button"
            >
              <RefreshCw className="w-4 h-4" />
              New Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceMeta.invoiceNumber}
                  onChange={(e) => setInvoiceMeta((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  issuerType === "shop"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setIssuerType("shop")}
                type="button"
              >
                दुकान से बिल काटें
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  issuerType === "custom"
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="font-semibold text-gray-700">{currentShop.name}</div>
                    <div>{formatShopAddress(currentShop)}</div>
                    {(currentShop.contact?.phone || currentShop.contact?.email) && (
                      <div className="mt-1 space-y-1">
                        {currentShop.contact?.phone && <div>📞 {currentShop.contact.phone}</div>}
                        {currentShop.contact?.email && <div>✉️ {currentShop.contact.email}</div>}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="yourshop@example.com"
                  />
                </div>
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="customer@example.com"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              <button
                onClick={addNewItem}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const lineTotal =
                  Math.round(((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0) + Number.EPSILON) * 100) /
                  100;
                return (
                  <div
                    key={`item-${index}`}
                    className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4 items-center"
                  >
                    <div>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder="Item name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <select
                        value={item.unit || "pc"}
                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      >
                        {UNIT_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                        placeholder="Rate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700 font-medium">
                        ₹{lineTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:text-red-700 rounded-lg p-2"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Notes (प्रिंट पर दिखेगा)
            </label>
            <textarea
              rows={3}
              value={invoiceMeta.notes}
              onChange={(e) => setInvoiceMeta((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Thank you for shopping with us!"
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount</span>
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
                    className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  />
                  <select
                    value={pricingAdjustments.discountType}
                    onChange={(e) =>
                      setPricingAdjustments((prev) => ({
                        ...prev,
                        discountType: e.target.value
                      }))
                    }
                    className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="amount">₹</option>
                    <option value="percent">%</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Paid (Optional)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={pricingAdjustments.paidAmount === 0 ? '' : pricingAdjustments.paidAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string, convert to 0 if empty
                    setPricingAdjustments((prev) => ({ 
                      ...prev, 
                      paidAmount: value === '' ? '' : (Number(value) || 0)
                    }));
                  }}
                  onBlur={(e) => {
                    // Convert empty to 0 on blur
                    if (e.target.value === '') {
                      setPricingAdjustments((prev) => ({ ...prev, paidAmount: 0 }));
                    }
                  }}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Balance</span>
                  <span className="text-rose-600 font-semibold">
                    ₹{balanceAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Actions</h2>
            <button
              onClick={handleSaveAndPreview}
              disabled={!preparedBill || saving}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="button"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {saving ? "Saving..." : "Save & Preview Invoice"}
            </button>
            <p className="text-xs text-gray-500">
              Preview पेज से आप प्रिंट, PDF डाउनलोड और इनवॉइस एडिट कर सकते हैं।
            </p>
          </section>

          <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              <button
                onClick={fetchBillHistory}
                className="text-xs text-blue-600 hover:underline"
                type="button"
              >
                Refresh
              </button>
            </div>
            {historyLoading ? (
              <div className="flex items-center justify-center py-8 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : billHistory.length === 0 ? (
              <p className="text-sm text-gray-500">
                अभी तक कोई सेव्ड इनवॉइस नहीं है। एक नया बिल बनाएँ और सेव करें।
              </p>
            ) : (
              <div className="space-y-3">
                {billHistory.slice(0, 10).map((bill) => {
                  const total =
                    bill.pricing?.totalAmount ??
                    bill.totalAmount ??
                    bill.pricing?.subtotal ??
                    0;
                  return (
                    <div
                      key={bill._id}
                      className={`border rounded-lg p-3 transition-colors ${
                        currentBillId === bill._id
                          ? "border-blue-400 bg-blue-50/60"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <button
                        onClick={() =>
                          router.push(`/Dashboard/InvoiceGenerator?id=${bill._id}`)
                        }
                        className="w-full text-left"
                        type="button"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900">
                            {bill.billNumber || bill.invoiceNumber || "Invoice"}
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {formatDisplayDate(
                              bill.billDate || bill.invoiceDate || bill.createdAt
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                          <span>{bill.customerName || "Customer"}</span>
                          <span className="font-medium text-gray-700">
                            ₹{Number(total || 0).toFixed(2)}
                          </span>
                        </div>
                      </button>
                      <div className="flex items-center justify-between mt-2">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {(bill.payment?.status || "pending").toUpperCase()}
                        </span>
                        <button
                          onClick={() =>
                            router.push(`/Dashboard/InvoiceGenerator/${bill._id}`)
                          }
                          className="text-xs text-blue-600 hover:underline"
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

