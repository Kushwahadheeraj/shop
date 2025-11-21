"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Printer,
  FileDown,
  Plus,
  Wand2
} from "lucide-react";
import InvoiceTemplateRenderer from "../components/InvoiceTemplateRenderer";
import InvoiceTemplates from "../components/InvoiceTemplates";
import API_BASE_URL from "@/lib/apiConfig";

const normalizeInvoice = (bill) => {
  if (!bill) return null;
  const invoiceDate = bill.invoiceDate || bill.billDate || bill.createdAt || new Date().toISOString();
  const dueDate = bill.dueDate || null;
  const pricing = bill.pricing || {};
  const payment = bill.payment || {};
  const items = Array.isArray(bill.items)
    ? bill.items.map((item) => ({
        name: item.name || "",
        quantity: item.quantity ?? item.qty ?? 0,
        unitPrice: item.unitPrice ?? item.rate ?? 0,
        amount:
          item.amount ??
          Math.round(((item.quantity ?? 0) * (item.unitPrice ?? 0) + Number.EPSILON) * 100) / 100
      }))
    : [];
  return {
    ...bill,
    invoiceNumber: bill.invoiceNumber || bill.billNumber,
    billNumber: bill.billNumber || bill.invoiceNumber,
    invoiceDate,
    dueDate,
    pricing: {
      subtotal: pricing.subtotal ?? 0,
      discount: pricing.discount ?? 0,
      totalAmount: pricing.totalAmount ?? pricing.subtotal ?? 0
    },
    payment: {
      paidAmount: payment.paidAmount ?? 0,
      remainingAmount: payment.remainingAmount ?? 0,
      method: payment.method || "cash",
      status: payment.status || "pending"
    },
    items,
    shopName: bill.shopName || bill.shop?.name || "",
    shopAddress: bill.shopAddress || "",
    shopPhone: bill.shopPhone || "",
    shopEmail: bill.shopEmail || "",
    customerName: bill.customerName || "",
    customerAddress: bill.customerAddress || "",
    customerPhone: bill.customerPhone || "",
    customerEmail: bill.customerEmail || ""
  };
};

const InvoicePreviewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await fetch(`${API_BASE_URL}/invoices/${id}`, { headers });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || data?.success === false) {
          throw new Error(data?.message || "Unable to load invoice");
        }
        const rawBill = data?.data?.bill || data?.bill || data?.data || data;
        const normalized = normalizeInvoice(rawBill);
        setBill(normalized);
        const templateId =
          normalized?.templateId || normalized?.metadata?.templateId || "default";
        setSelectedTemplate({ id: templateId });
      } catch (err) {
        // console.error(err);
        setError(err.message || "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const templateForRenderer = useMemo(
    () => ({ id: selectedTemplate?.id || "default" }),
    [selectedTemplate]
  );

  const handleEdit = () => {
    router.push(`/Dashboard/InvoiceGenerator?id=${id}`);
  };

  const handleNewInvoice = () => {
    router.push("/Dashboard/InvoiceGenerator");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplatePicker(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center text-slate-500 gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-sm">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white border border-red-200 text-red-600 px-6 py-4 rounded-xl shadow">
          <p className="font-semibold mb-3">Invoice unavailable</p>
          <p className="text-sm mb-4">{error || "Invoice not found."}</p>
          <div className="flex items-center gap-3 text-sm">
            <button
              onClick={() => router.push("/Dashboard/InvoiceGenerator")}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              type="button"
            >
              <Plus className="w-4 h-4" />
              Create New Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            margin: 0 !important;
            size: A4;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html,
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          /* Hide specific elements */
          nav,
          header,
          aside,
          .no-print,
          button,
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
          }
          /* Universal hide, then show invoice */
          * {
            visibility: hidden !important;
          }
          /* Show only invoice and all its descendants */
          .invoice-print-only,
          .invoice-print-only * {
            visibility: visible !important;
          }
          /* Show only invoice in print with border on each page */
          .invoice-print-only {
            position: relative !important;
            margin: 0 auto !important;
            margin-top: 0 !important;
            padding: 0 !important;
            padding-top: 0 !important;
            width: 210mm !important;
            max-width: 210mm !important;
            background: transparent !important;
            box-sizing: border-box !important;
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            page-break-inside: auto !important;
            display: block !important;
          }
          /* Template wrapper styling - remove border, ensure proper spacing and page breaks */
          .invoice-print-only > * {
            border: none !important;
            outline: none !important;
            background: white !important;
            margin: 0 auto !important;
            padding-top: 0 !important;
            padding-left: 1cm !important;
            padding-right: 1cm !important;
            padding-bottom: 0.5cm !important;
            page-break-inside: auto;
          }
          .invoice-print-only table {
            page-break-inside: auto;
          }
          .invoice-print-only tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          /* Ensure Amount in Words and Terms sections are visible and can break across pages */
          .invoice-print-only section {
            visibility: visible !important;
            opacity: 1 !important;
          }
          /* Invoice content styling for print */
          .invoice-print-only * {
            opacity: 1 !important;
            visibility: visible !important;
          }
          /* Remove shadows but keep borders for print */
          .invoice-print-only .shadow-xl,
          .invoice-print-only .shadow-2xl,
          .invoice-print-only .shadow {
            box-shadow: none !important;
          }
          .invoice-print-only .rounded-3xl,
          .invoice-print-only .rounded-2xl,
          .invoice-print-only .rounded-xl {
            border-radius: 0 !important;
          }
          .invoice-print-only .bg-slate-100 {
            background: white !important;
          }
          /* Remove max-width constraints in print */
          .invoice-print-only .max-w-5xl,
          .invoice-print-only .max-w-4xl {
            max-width: 100% !important;
            width: 100% !important;
          }
          /* Ensure proper font rendering in print */
          .invoice-print-only {
            font-family: Arial, sans-serif !important;
            color: #000 !important;
          }
          /* Ensure QR code renders properly */
          .invoice-print-only svg {
            display: block !important;
            visibility: visible !important;
          }
          /* Ensure emerald colors print as dark green/black */
          .invoice-print-only .text-emerald-500,
          .invoice-print-only .text-emerald-600,
          .invoice-print-only .text-emerald-400 {
            color: #059669 !important;
          }
          .invoice-print-only .border-emerald-400 {
            border-color: #059669 !important;
          }
          /* Prevent totals section from being cut off */
          .invoice-print-only section[class*="break-inside-avoid"] {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            orphans: 3 !important;
            widows: 3 !important;
          }
          /* Align totals section right padding with table's last column padding */
          .invoice-print-only section[class*="break-inside-avoid"] > div {
            padding-right: 0 !important;
          }
          .invoice-print-only section[class*="break-inside-avoid"] > div > div {
            padding-right: 0.5rem !important;
            margin-right: 0 !important;
          }
          /* Match table cell padding in print */
          .invoice-print-only table td:last-child,
          .invoice-print-only table th:last-child {
            padding-right: 0.5rem !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-100">
        {/* Navigation - Hidden in print */}
        <div className="no-print max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => router.push("/Dashboard/InvoiceGenerator")}
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Invoice Creator
            </button>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowTemplatePicker(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                type="button"
              >
                <Wand2 className="w-4 h-4" />
                Change Template
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                type="button"
              >
                <Edit className="w-4 h-4" />
                Edit Invoice
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                type="button"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                type="button"
              >
                <FileDown className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={handleNewInvoice}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                type="button"
              >
                <Plus className="w-4 h-4" />
                New Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Invoice - Visible in print and on screen */}
        <div className="invoice-print-only px-4 pb-10 max-w-5xl mx-auto print:px-0 print:pb-0 print:max-w-full">
          <InvoiceTemplateRenderer bill={bill} template={templateForRenderer} />
        </div>

        {showTemplatePicker && (
          <div className="no-print">
            <InvoiceTemplates
              onClose={() => setShowTemplatePicker(false)}
              onSelectTemplate={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InvoicePreviewPage;

