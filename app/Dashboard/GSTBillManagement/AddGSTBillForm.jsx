import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Plus, Trash2, Calculator, Calendar, Edit, Upload, ChevronDown, RefreshCw, Pen, Paperclip, FileText, StickyNote, Info, Phone, Settings, Users, Package, DollarSign, Mail, Printer, Download, Eye, Clock, CheckCircle, AlertCircle, Search } from 'lucide-react';
import ClientManagement from './components/ClientManagement';
import ShopFormModal from './components/ShopFormModal';
import ProductCatalog from './components/ProductCatalog';

const AddGSTBillForm = ({ onClose, onSave, shops }) => {
  const GST_STATE_CODES = [
    { name: 'Jammu & Kashmir', code: '01' },
    { name: 'Himachal Pradesh', code: '02' },
    { name: 'Punjab', code: '03' },
    { name: 'Chandigarh', code: '04' },
    { name: 'Uttarakhand', code: '05' },
    { name: 'Haryana', code: '06' },
    { name: 'Delhi', code: '07' },
    { name: 'Rajasthan', code: '08' },
    { name: 'Uttar Pradesh', code: '09' },
    { name: 'Bihar', code: '10' },
    { name: 'Sikkim', code: '11' },
    { name: 'Arunachal Pradesh', code: '12' },
    { name: 'Nagaland', code: '13' },
    { name: 'Manipur', code: '14' },
    { name: 'Mizoram', code: '15' },
    { name: 'Tripura', code: '16' },
    { name: 'Meghalaya', code: '17' },
    { name: 'Assam', code: '18' },
    { name: 'West Bengal', code: '19' },
    { name: 'Jharkhand', code: '20' },
    { name: 'Odisha', code: '21' },
    { name: 'Chhattisgarh', code: '22' },
    { name: 'Madhya Pradesh', code: '23' },
    { name: 'Gujarat', code: '24' },
    { name: 'Daman & Diu', code: '25' },
    { name: 'Dadra & Nagar Haveli', code: '26' },
    { name: 'Maharashtra', code: '27' },
    { name: 'Andhra Pradesh (Old)', code: '28' },
    { name: 'Karnataka', code: '29' },
    { name: 'Goa', code: '30' },
    { name: 'Lakshadweep', code: '31' },
    { name: 'Kerala', code: '32' },
    { name: 'Tamil Nadu', code: '33' },
    { name: 'Puducherry', code: '34' },
    { name: 'Andaman & Nicobar Islands', code: '35' },
    { name: 'Telangana', code: '36' },
    { name: 'Andhra Pradesh (Newly Added)', code: '37' },
    { name: 'Ladakh (Newly Added)', code: '38' },
    { name: 'Others Territory', code: '97' },
    { name: 'Center Jurisdiction', code: '99' }
  ];
  const QUANTITY_UNITS = ['pcs', 'kg', 'g', 'liter', 'ml', 'dozen', 'box', 'meter', 'cm', 'foot', 'set', 'bundle'];
  const [formData, setFormData] = useState({
    shopId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerGST: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    items: [{
      name: '',
      hsnSac: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 1,
      gstRate: 0,
      amount: 1,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 1
    }],
    notes: '',
    terms: '',
    currency: 'INR',
    showShippingDetails: false,
    showTotalInWords: false,
    hideTotals: false,
    summarizeTotalQuantity: false,
    addMoreFields: false,
    showHSNSummary: true,
    hidePlaceOfSupply: true,
    showOriginalImages: false,
    showThumbnails: false,
    showDescriptionFullWidth: false,
    hideSubtotalForGroups: false,
    showSKU: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showClientManagement, setShowClientManagement] = useState(false);
  const [showProductCatalog, setShowProductCatalog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [invoiceStatus, setInvoiceStatus] = useState('Draft');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [gstShops, setGstShops] = useState([]);
  const [selectedGSTShop, setSelectedGSTShop] = useState(null);
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);
  const [showHSNModal, setShowHSNModal] = useState(false);
  const [hsnForRow, setHsnForRow] = useState(null);
  const [hsnList, setHsnList] = useState([]);
  const [hsnQuery, setHsnQuery] = useState('');
  const [hsnPage, setHsnPage] = useState(1);
  const [hsnPageSize, setHsnPageSize] = useState(50);

  const filteredHSN = useMemo(() => {
    const q = (hsnQuery || '').toLowerCase().trim();
    const res = (!q ? hsnList : hsnList.filter((x) =>
      String(x.code || x.hsn || '').toLowerCase().includes(q) ||
      String(x.description || x.desc || '').toLowerCase().includes(q)
    ));
    return res;
  }, [hsnQuery, hsnList]);

  const displayedHSN = useMemo(() => {
    const start = (hsnPage - 1) * hsnPageSize;
    return filteredHSN.slice(start, start + hsnPageSize);
  }, [filteredHSN, hsnPage, hsnPageSize]);

  const openHSNModal = async (rowIndex) => {
    setHsnForRow(rowIndex);
    try {
      if (!hsnList.length) {
        const res = await fetch('/api/hsn-codes');
        const data = await res.json();
        // accept either {data: [...]} or array
        const list = Array.isArray(data) ? data : (data.data || data.items || []);
        // normalize to {code, description}
        const normalized = list.map((x) => ({
          code: x.code || x.hsn || x.HSN || '',
          description: x.description || x.desc || x.name || ''
        }));
        setHsnList(normalized);
      }
    } catch {}
    setShowHSNModal(true);
  };
  const [showTaxConfig, setShowTaxConfig] = useState(false);
  const [taxType, setTaxType] = useState('GST (India)');
  const [placeOfSupply, setPlaceOfSupply] = useState('Uttar Pradesh');
  const [gstType, setGstType] = useState('CGST_SGST'); // 'IGST' or 'CGST_SGST'
  const [reverseCharge, setReverseCharge] = useState(false);
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' | 'percent'
  const [discountValue, setDiscountValue] = useState(0);
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [signatureLabel, setSignatureLabel] = useState('Authorised Signatory');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isSignatureCollapsed, setIsSignatureCollapsed] = useState(false);
  const [headerExtraFields, setHeaderExtraFields] = useState([]); // {id,label,value}
  const [showDueDate, setShowDueDate] = useState(true);
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tempSignature, setTempSignature] = useState('');
  const onSignatureUpload = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result?.toString() || '';
      setSignatureDataUrl(data);
      setTempSignature(data);
    };
    reader.readAsDataURL(file);
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => setIsDrawing(false);
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL('image/png');
    setSignatureDataUrl(data);
    setTempSignature(data);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const r = await fetch('/api/gst-shops', { headers: { 'Authorization': `Bearer ${token}` } });
        const d = await r.json();
        if (d?.success) {
          setGstShops(d.data);
          // Auto-select default if available, otherwise keep previous selection
          const def = d.data.find(x=>x.isDefault);
          if (def) { setSelectedGSTShop(def); handleInputChange('shopId', def._id); }
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const r = await fetch('/api/clients', { headers: { 'Authorization': `Bearer ${token}` } });
        const d = await r.json();
        if (d?.success) setClients(d.data?.clients || d.data || []);
      } catch {}
    })();
  }, []);

  const getClientAddress = (c) => {
    if (!c) return '';
    const addr = c.address && c.address.trim() ? c.address : `${c.street || ''}${c.street ? ', ' : ''}${c.city || ''}${c.city ? ', ' : ''}${c.stateName || ''}${c.stateName ? ', ' : ''}${c.country || ''}${c.pincode ? `, ${c.pincode}` : ''}${c.stateCode ? ` (code-${c.stateCode})` : ''}`;
    return addr.trim();
  };

  // Invoice number helpers (prefix KH&TH/MM-YY/ + user sequence)
  const [invoicePrefixCode, setInvoicePrefixCode] = useState('KH&TH');
  const [invoicePeriod, setInvoicePeriod] = useState(() => {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}-${yy}`;
  });
  useEffect(() => {
    // Keep period in sync with invoice date by default
    const d = formData.invoiceDate ? new Date(formData.invoiceDate) : new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    setInvoicePeriod(`${mm}-${yy}`);
  }, [formData.invoiceDate]);
  const invoicePrefix = useMemo(() => `${invoicePrefixCode}/${invoicePeriod}/`, [invoicePrefixCode, invoicePeriod]);
  const currentSeq = useMemo(() => {
    const raw = (formData.invoiceNumber || '').startsWith(invoicePrefix)
      ? (formData.invoiceNumber || '').slice(invoicePrefix.length)
      : (formData.invoiceNumber || '');
    return raw.replace(/[^0-9]/g, '');
  }, [formData.invoiceNumber, invoicePrefix]);
  const prevInvoiceDisplay = useMemo(() => {
    if (!currentSeq) return '';
    const n = Math.max(0, (parseInt(currentSeq, 10) || 0) - 1);
    const pad = Math.max(currentSeq.length, 4);
    return `${invoicePrefix}${String(n).padStart(pad, '0')}`;
  }, [currentSeq, invoicePrefix]);
  const [shopForm, setShopForm] = useState({
    name: '',
    gstin: '',
    pan: '',
    country: 'India',
    state: '',
    stateCode: '',
    city: '',
    pincode: '',
    street: '',
    alias: '',
    email: '',
    phone: '',
    showEmailInInvoice: false,
    showPhoneInInvoice: false,
    customFields: []
  });

  const setShop = (k, v) => setShopForm(prev => ({ ...prev, [k]: v }));

  const addShopCustomField = () => setShop('customFields', [...shopForm.customFields, { id: Date.now(), label: '', value: '' }]);
  const updateShopCustomField = (id, key, value) => setShop('customFields', shopForm.customFields.map(cf => cf.id === id ? { ...cf, [key]: value } : cf));
  const removeShopCustomField = (id) => setShop('customFields', shopForm.customFields.filter(cf => cf.id !== id));

  const saveShop = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: shopForm.name, address: `${shopForm.street}, ${shopForm.city}, ${shopForm.state}, ${shopForm.country} - ${shopForm.pincode}` })
      });
      await res.json();
      setShowAddShopModal(false);
      setShowShopDropdown(false);
      alert('Business added. Please refresh shops list.');
    } catch (e) {
      console.error(e);
      alert('Failed to add business');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Calculate amounts for this item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? (parseFloat(value) || 0) : (parseFloat(newItems[index].quantity) || 0);
      const unitPrice = field === 'unitPrice' ? (parseFloat(value) || 0) : (parseFloat(newItems[index].unitPrice) || 0);
      const amount = quantity * unitPrice;
      const gstRate = parseFloat(newItems[index].gstRate) || 0;
      const gstAmount = amount * gstRate / 100;
      const cgst = gstType === 'CGST_SGST' ? gstAmount / 2 : 0;
      const sgst = gstType === 'CGST_SGST' ? gstAmount / 2 : 0;
      const igst = gstType === 'IGST' ? gstAmount : 0;
      const total = amount + gstAmount;
      
      newItems[index].amount = amount;
      newItems[index].cgst = cgst;
      newItems[index].sgst = sgst;
      newItems[index].igst = igst;
      newItems[index].total = total;
    }

    if (field === 'gstRate') {
      const gstRate = parseFloat(value) || 0;
      const amount = newItems[index].amount || 0;
      const gstAmount = amount * gstRate / 100;
      const cgst = gstType === 'CGST_SGST' ? gstAmount / 2 : 0;
      const sgst = gstType === 'CGST_SGST' ? gstAmount / 2 : 0;
      const igst = gstType === 'IGST' ? gstAmount : 0;
      const total = amount + gstAmount;
      
      newItems[index].cgst = cgst;
      newItems[index].sgst = sgst;
      newItems[index].igst = igst;
      newItems[index].total = total;
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));

    // Clear per-item errors when user edits
    if (errors[`item_${index}_name`] && field === 'name') {
      setErrors(prev => ({ ...prev, [`item_${index}_name`]: '' }));
    }
    if (errors[`item_${index}_quantity`] && field === 'quantity') {
      setErrors(prev => ({ ...prev, [`item_${index}_quantity`]: '' }));
    }
    if (errors[`item_${index}_unitPrice`] && field === 'unitPrice') {
      setErrors(prev => ({ ...prev, [`item_${index}_unitPrice`]: '' }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        hsnSac: '',
        quantity: 1,
        unit: 'pcs',
        unitPrice: 1,
        gstRate: 0,
        amount: 1,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 1
      }]
    }));
  };

  const addItemFromCatalog = (product) => {
    const newItem = {
      name: product.name,
      hsnSac: product.hsnSac || '',
      quantity: 1,
      unit: product.unit || 'pcs',
      unitPrice: product.unitPrice,
      gstRate: product.gstRate,
      amount: product.unitPrice,
      cgst: gstType==='CGST_SGST' ? (product.unitPrice * product.gstRate / 100) / 2 : 0,
      sgst: gstType==='CGST_SGST' ? (product.unitPrice * product.gstRate / 100) / 2 : 0,
      igst: gstType==='IGST' ? (product.unitPrice * product.gstRate / 100) : 0,
      total: product.unitPrice + (product.unitPrice * product.gstRate / 100)
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    setShowProductCatalog(false);
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      customerName: client.name,
      customerEmail: client.email,
      customerPhone: client.phone,
      customerAddress: client.address,
      customerGST: client.gstin
    }));
    setShowClientManagement(false);
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalCGST = formData.items.reduce((sum, item) => sum + (item.cgst || 0), 0);
    const totalSGST = formData.items.reduce((sum, item) => sum + (item.sgst || 0), 0);
    const totalIGST = formData.items.reduce((sum, item) => sum + (item.igst || 0), 0);
    const totalGST = totalCGST + totalSGST + totalIGST;
    const computedDiscount = discountType === 'percent'
      ? (subtotal * (parseFloat(discountValue) || 0)) / 100
      : (parseFloat(discountValue) || 0);
    const otherCharges = parseFloat(additionalCharges) || 0;
    const grandTotal = Math.max(0, subtotal - computedDiscount) + totalGST + otherCharges;

    return {
      subtotal: Math.round((subtotal + Number.EPSILON) * 100) / 100,
      totalCGST: Math.round((totalCGST + Number.EPSILON) * 100) / 100,
      totalSGST: Math.round((totalSGST + Number.EPSILON) * 100) / 100,
      totalIGST: Math.round((totalIGST + Number.EPSILON) * 100) / 100,
      totalGST: Math.round((totalGST + Number.EPSILON) * 100) / 100,
      discount: Math.round((computedDiscount + Number.EPSILON) * 100) / 100,
      otherCharges: Math.round((otherCharges + Number.EPSILON) * 100) / 100,
      grandTotal: Math.round((grandTotal + Number.EPSILON) * 100) / 100
    };
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shopId) {
      newErrors.shopId = 'Please select a shop';
    }

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required';
    }

    // Validate items
    if (!formData.items || formData.items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item_${index}_name`] = 'Item name is required';
      }
      if ((parseFloat(item.quantity) || 0) <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if ((parseFloat(item.unitPrice) || 0) < 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price cannot be negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const totals = calculateTotals();
      const billData = {
        ...formData,
        netAmount: totals.subtotal,
        gstAmount: totals.totalGST,
        grandTotal: totals.grandTotal,
        shopName: shops.find(s => s._id === formData.shopId)?.name || ''
      };
      
      await onSave(billData);
      onClose();
    } catch (error) {
      console.error('Error saving GST bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Convert number to words in Indian numbering system (Rupees only)
  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const toWordsBelowThousand = (n) => {
      let str = '';
      if (n > 99) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n = n % 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      } else if (n > 0) {
        str += a[n];
      }
      return str.trim();
    };
    if (num === 0) return 'Zero';
    let n = Math.floor(Math.abs(num));
    const parts = [];
    const units = [
      { d: 10000000, l: 'Crore' },
      { d: 100000, l: 'Lakh' },
      { d: 1000, l: 'Thousand' },
      { d: 100, l: 'Hundred' }
    ];
    for (const u of units) {
      if (n >= u.d) {
        const q = Math.floor(n / u.d);
        parts.push((u.d === 100 ? a[q] : toWordsBelowThousand(q)) + ' ' + u.l);
        n = n % u.d;
      }
    }
    if (n > 0) parts.push(toWordsBelowThousand(n));
    return parts.join(' ').trim();
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        {/* Header */}
        <div className="p-6 border-b bg-white">
          {/* Centered GST Invoice Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-dashed border-gray-300 pb-1">GST Invoice</h1>
              <Edit className="h-4 w-4 text-gray-500 cursor-pointer" />
            </div>
            {!isEditingSubtitle && !formData.subtitle && (
              <button type="button" onClick={()=>setIsEditingSubtitle(true)} className="flex items-center justify-center space-x-1 text-purple-600 cursor-pointer mt-2 mx-auto">
                <Plus className="h-3 w-3 text-orange-500" />
                <span className="text-sm">Add Subtitle</span>
              </button>
            )}
            {(isEditingSubtitle || formData.subtitle) && (
              <div className="mt-2 flex items-center justify-center space-x-2">
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e)=>handleInputChange('subtitle', e.target.value)}
                  placeholder="Enter subtitle"
                  className="px-3 py-1 border-b border-purple-500 focus:outline-none text-sm"
                />
                <button type="button" onClick={()=>setIsEditingSubtitle(false)} className="text-sm text-gray-500">Done</button>
              </div>
            )}
          </div>

          {/* Invoice Details in Column Layout with Logo */}
          <div className="flex items-start justify-between">
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
                {/* Left: Invoice No */}
                <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 pb-1">Invoice No*</label>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={invoicePrefixCode}
                      onChange={(e)=>setInvoicePrefixCode(e.target.value.toUpperCase())}
                      className="w-20 text-sm text-gray-900 border-b border-purple-500 pb-1 focus:outline-none uppercase"
                    />
                    <span className="text-sm text-gray-900">/</span>
                    <input
                      type="text"
                      value={invoicePeriod}
                      onChange={(e)=>setInvoicePeriod(e.target.value)}
                      placeholder="MM-YY"
                      className="w-16 text-sm text-gray-900 border-b border-purple-500 pb-1 focus:outline-none"
                    />
                    <span className="text-sm text-gray-900">/</span>
                    <input
                      type="text"
                      value={currentSeq}
                      onChange={(e)=>{
                        const digits = e.target.value.replace(/[^0-9]/g,'');
                        const padded = digits.padStart(Math.max(4, digits.length), '0');
                        handleInputChange('invoiceNumber', `${invoicePrefix}${padded}`);
                      }}
                      placeholder="0001"
                      className="w-20 text-sm text-gray-900 border-b border-purple-500 pb-1 focus:outline-none"
                    />
                  </div>
                  {prevInvoiceDisplay ? (
                    <span className="text-xs text-gray-500 mt-1">Last No: {prevInvoiceDisplay}</span>
                  ) : null}
                  {errors.invoiceNumber && <span className="text-xs text-red-600 mt-1">{errors.invoiceNumber}</span>}
                </div>
              </div>
                {/* Right: Dates stack */}
                <div className="flex flex-col space-y-4 justify-self-end w-auto">
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 pb-1">Invoice Date*</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={formData.invoiceDate}
                        onChange={(e)=>handleInputChange('invoiceDate', e.target.value)}
                        className="text-sm text-gray-900 border-b border-purple-500 pb-1 focus:outline-none"
                      />
                      <Calendar className="h-3 w-3 text-gray-400" />
                    </div>
                    {errors.invoiceDate && <span className="text-xs text-red-600">{errors.invoiceDate}</span>}
                  </div>
                  {showDueDate ? (
                    <div className="flex items-center space-x-3">
                      <label className="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 pb-1">Due Date</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e)=>handleInputChange('dueDate', e.target.value)}
                          className="text-sm text-gray-900 border-b border-purple-500 pb-1 focus:outline-none"
                        />
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <button type="button" onClick={()=>setShowDueDate(false)} className="text-gray-400 hover:text-gray-600">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={()=>setShowDueDate(true)} className="text-sm text-purple-600 inline-flex items-center space-x-2">
                      <Plus className="h-3 w-3 text-orange-500" />
                      <span>Add Due Date</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Add More Fields - inline under the row */}
              <div className="mt-3">
                <button type="button" onClick={()=>setHeaderExtraFields(prev=>[...prev,{id:Date.now(),label:'',value:''}])} className="text-sm text-purple-600 inline-flex items-center space-x-2">
                  <Plus className="h-3 w-3 text-orange-500" />
                  <span>Add More Fields</span>
                </button>
                {headerExtraFields.length>0 && (
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {headerExtraFields.map(f=> (
                      <div key={f.id} className="flex items-center space-x-3">
                        <input
                          value={f.label}
                          onChange={(e)=>setHeaderExtraFields(prev=>prev.map(x=>x.id===f.id?{...x,label:e.target.value}:x))}
                          placeholder="Label"
                          className="w-28 text-sm text-gray-700 border-b border-dashed border-gray-300 pb-1 focus:outline-none"
                        />
                        <input
                          value={f.value}
                          onChange={(e)=>setHeaderExtraFields(prev=>prev.map(x=>x.id===f.id?{...x,value:e.target.value}:x))}
                          placeholder="Value"
                          className="flex-1 text-sm text-gray-900 border-b border-purple-500 pb-1 focus:outline-none"
                        />
                        <button type="button" onClick={()=>setHeaderExtraFields(prev=>prev.filter(x=>x.id!==f.id))} className="text-gray-400 hover:text-gray-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          <div className="flex items-center space-x-4"></div>
        </div>

          
                  </div>
                  
        {/* Configure Tax Modal */}
        {showTaxConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Configure Tax</h3>
                <button onClick={()=>setShowTaxConfig(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-4 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Tax Type*</label>
                  <select className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500" value={taxType} onChange={(e)=>setTaxType(e.target.value)}>
                    <option>GST (India)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">2. Place of Supply*</label>
                  <select className="w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500" value={placeOfSupply} onChange={(e)=>setPlaceOfSupply(e.target.value)}>
                    {GST_STATE_CODES.map(s=> <option key={s.code} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">3. GST Type*</label>
                  <div className="flex items-center space-x-8">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="gstType" checked={gstType==='IGST'} onChange={()=>setGstType('IGST')} />
                      <span>IGST</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="gstType" checked={gstType==='CGST_SGST'} onChange={()=>setGstType('CGST_SGST')} />
                      <span>CGST & SGST</span>
                    </label>
                  </div>
                  <button type="button" className="text-sm text-purple-600 mt-3">+ Add Cess</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">4. Other Options</label>
                  <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
                    <input type="checkbox" checked={reverseCharge} onChange={(e)=>setReverseCharge(e.target.checked)} />
                    <span>Is Reverse Charge Applicable?</span>
                  </label>
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <button type="button" onClick={()=>setShowTaxConfig(false)} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
                  <button type="button" onClick={()=>{ setShowTaxConfig(false); setFormData(prev=>({ ...prev, items: prev.items.map(it=>{ const amount = (parseFloat(it.quantity)||0) * (parseFloat(it.unitPrice)||0); const rate = parseFloat(it.gstRate)||0; const gstAmt = amount*rate/100; return { ...it, amount, cgst: gstType==='CGST_SGST'?gstAmt/2:0, sgst: gstType==='CGST_SGST'?gstAmt/2:0, igst: gstType==='IGST'?gstAmt:0, total: amount+gstAmt }; }) })); }} className="px-4 py-2 bg-purple-600 text-white rounded-md">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
                  
        <form onSubmit={handleSubmit} className="p-6">
          {/* Main Content */}
          <div className="mb-8">

            {/* Billed By and Billed To Sections Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Billed By Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Billed By</h3>
                  <span className="text-sm text-gray-600 ml-2">Your Details</span>
                  <div className="border-b border-dashed border-gray-300 mt-2"></div>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowShopDropdown(v => !v)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg flex items-center justify-between text-left focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">{(selectedGSTShop?.name || 'K').slice(0,1)}</div>
                        <span className="font-medium text-gray-800">{selectedGSTShop?.name || 'Select Business'}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showShopDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showShopDropdown && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                        {gstShops.map(shop => (
                          <button
                            type="button"
                            key={shop._id}
                            onClick={() => { setSelectedGSTShop(shop); handleInputChange('shopId', shop._id); setShowShopDropdown(false); }}
                            className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">{shop.name.slice(0,1)}</div>
                            <span className="text-gray-900">{shop.name}</span>
                          </button>
                        ))}
                        <div className="px-4 py-3 border-t">
                          <button type="button" onClick={()=>{ setIsEditingShop(false); setShowAddShopModal(true); }} className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">Add New Business</button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Business details</span>
                      <div className="flex items-center space-x-1 text-purple-600 text-sm cursor-pointer">
                        <Edit className="h-3 w-3" />
                        <button type="button" onClick={()=>{ if(!selectedGSTShop) return; setIsEditingShop(true); setShowAddShopModal(true); }}>
                          Edit
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Business Name:</strong> {selectedGSTShop?.name || '-'}</p>
                      <p><strong>Address:</strong> {selectedGSTShop ? `${selectedGSTShop.street || ''}${selectedGSTShop.street ? ', ' : ''}${selectedGSTShop.city || ''}${selectedGSTShop.city ? ', ' : ''}${selectedGSTShop.stateName || ''}${selectedGSTShop.stateName ? ', ' : ''}${selectedGSTShop.country || ''}${selectedGSTShop.pincode ? `, ${selectedGSTShop.pincode}` : ''}${selectedGSTShop.stateCode ? ` (code-${selectedGSTShop.stateCode})` : ''}` : '-'}</p>
                      {selectedGSTShop?.gstin ? (<p><strong>GSTIN:</strong> {selectedGSTShop.gstin}</p>) : null}
                      {selectedGSTShop?.pan ? (<p><strong>PAN:</strong> {selectedGSTShop.pan}</p>) : null}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shippingDetails"
                      checked={formData.showShippingDetails}
                      onChange={(e) => handleInputChange('showShippingDetails', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="shippingDetails" className="text-sm text-gray-700">Add Shipping Details</label>
                </div>
              </div>
            </div>

              {/* Billed To Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Billed To</h3>
                  <span className="text-sm text-gray-600 ml-2">Client's Details</span>
                  <div className="border-b border-dashed border-gray-300 mt-2"></div>
                </div>
                <div className="space-y-4">
                  {/* Client select dropdown */}
                  <div className="relative">
                          <button
                            type="button"
                      onClick={() => setShowClientDropdown(v => !v)}
                      className="w-full h-12 px-4 border border-gray-300 rounded-lg flex items-center justify-between text-left focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                      <span className="text-gray-800">{selectedClient?.name || 'Select a Client'}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
                          </button>
                    {showClientDropdown && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
                        {clients.map(c => (
                          <button
                            type="button"
                            key={c._id}
                            onClick={() => { 
                              const addr = c.address && c.address.trim() ? c.address : `${c.street || ''}${c.street ? ', ' : ''}${c.city || ''}${c.city ? ', ' : ''}${c.stateName || ''}${c.stateName ? ', ' : ''}${c.country || ''}${c.pincode ? `, ${c.pincode}` : ''}${c.stateCode ? ` (code-${c.stateCode})` : ''}`;
                              setSelectedClient(c);
                              setFormData(prev => ({
                                ...prev,
                                customerName: c.name || '',
                                customerEmail: c.email || '',
                                customerPhone: c.phone || '',
                                customerAddress: addr,
                                customerGST: c.gstin || ''
                              }));
                              setShowClientDropdown(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left"
                          >
                            <span className="text-gray-900">{c.name}</span>
                            <span className="text-xs text-gray-500">{c.phone || c.email || ''}</span>
                          </button>
                        ))}
                        </div>
                    )}
                      </div>

                  {/* When no client selected show message box like image */}
                  {!selectedClient && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                      <p className="text-gray-600 mb-3">Select Client/Business from the list</p>
                      <p className="text-gray-500 text-sm mb-5">OR</p>
                    <button
                      type="button"
                          onClick={() => setShowClientManagement(true)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
                        >
                        <Plus className="h-4 w-4" />
                        <span>Add New Client</span>
                        </button>
                    </div>
                  )}

                  {/* When client selected show details card */}
                  {selectedClient && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Business details</span>
                        <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowClientManagement(true)}
                            className="text-purple-600 hover:text-purple-700 text-sm flex items-center space-x-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedClient(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                    </button>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="grid grid-cols-[140px_1fr] gap-y-2 items-start">
                          <span className="text-gray-600">Business Name</span>
                          <span className="text-purple-700 font-medium cursor-pointer">{selectedClient.name || '-'}</span>
                          <span className="text-gray-600">Address</span>
                          <span>{selectedClient.stateName || selectedClient.country || selectedClient.address ? `${selectedClient.stateName || ''}${selectedClient.stateName ? ', ' : ''}${selectedClient.country || ''}${selectedClient.stateCode ? ` - ${selectedClient.stateCode}` : ''}` : '-'}</span>
                          <span className="text-gray-600">GSTIN</span>
                          <span>{selectedClient.gstin || '-'}</span>
                          <span className="text-gray-600">PAN</span>
                          <span>{selectedClient.pan || '-'}</span>
                        </div>
                  </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Currency and Format Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency & Format</h3>
                <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Currency*</label>
                  <div className="flex items-center space-x-3">
                  <button type="button" onClick={()=>setShowTaxConfig(true)} className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <span className="text-purple-600 font-bold">%</span>
                      <span>Configure GST</span>
                    </button>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option>Indian Rupee (INR, ₹)</option>
                    </select>
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <span className="text-purple-600 font-bold">123</span>
                      <span>Number and Currency Format</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
                        <div className="w-1 h-1 bg-purple-600 rounded-sm"></div>
                        <div className="w-1 h-1 bg-purple-600 rounded-sm"></div>
                        <div className="w-1 h-1 bg-purple-600 rounded-sm"></div>
                        <div className="w-1 h-1 bg-purple-600 rounded-sm"></div>
                  </div>
                      <span>Edit Columns/Formulas</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <div className="bg-purple-600 text-white p-4 rounded-t-lg">
              <div className={`grid ${gstType==='IGST' ? 'grid-cols-10' : 'grid-cols-11'} gap-4 text-sm font-medium`}>
                <div className="col-span-2">Item</div>
                <div>HSN/SAC</div>
                <div>GST Rate</div>
                <div>Quantity</div>
                <div>Unit</div>
                <div>Rate</div>
                <div>Amount</div>
                {gstType==='IGST' ? (<div>IGST</div>) : (<><div>CGST</div><div>SGST</div></>)}
                <div>Total</div>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-b-lg">
              {formData.items.map((item, index) => {
                const isExpanded = expandedItemIndex === index;
                return (
                  <div key={index} className={`grid ${isExpanded ? 'grid-cols-1' : (gstType==='IGST' ? 'grid-cols-10' : 'grid-cols-11')} gap-4 p-4 border-b border-gray-200 last:border-b-0`}>
                    <div className={`${isExpanded ? 'col-span-1' : 'col-span-2'}`}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        onFocus={() => setExpandedItemIndex(index)}
                        onBlur={() => setExpandedItemIndex(null)}
                      placeholder="Name/SKU Id (Required)"
                        className={`w-full ${isExpanded ? 'h-12 px-3' : 'px-2'} py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500`}
                    />
                  </div>
                    {isExpanded ? null : (
                      <>
                  <div>
                          <div className="relative">
                    <input
                      type="text"
                      value={item.hsnSac}
                      onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)}
                              placeholder="#"
                              className="w-full pr-8 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-400"
                    />
                            <button type="button" onClick={()=>openHSNModal(index)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                              <Search className="h-4 w-4" />
                            </button>
                          </div>
                  </div>
                  <div>
                          <select
                      value={item.gstRate}
                      onChange={(e) => handleItemChange(index, 'gstRate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value={0}>0%</option>
                            <option value={3}>3%</option>
                            <option value={5}>5%</option>
                            <option value={12}>12%</option>
                            <option value={18}>18%</option>
                            <option value={28}>28%</option>
                          </select>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                        <div>
                          <select
                            value={item.unit || 'pcs'}
                            onChange={(e)=>handleItemChange(index, 'unit', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          >
                            {QUANTITY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                  <div>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formatCurrency(item.amount)}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                  </div>
                        {gstType==='IGST' ? (
                  <div>
                            <input type="text" value={formatCurrency(item.igst)} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50" />
                  </div>
                        ) : (
                          <>
                  <div>
                              <input type="text" value={formatCurrency(item.cgst)} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50" />
                  </div>
                            <div>
                              <input type="text" value={formatCurrency(item.sgst)} readOnly className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50" />
                            </div>
                          </>
                        )}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={formatCurrency(item.total)}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                      </>
                    )}
                </div>
                );
              })}
              
              {/* Add Item Row */}
              <div className="p-4 border-t-2 border-dashed border-gray-300">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Line</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Totals and Options */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Additional Options */}
            <div className="space-y-4">
           <div className="bg-white w-60 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Payment Status</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={paymentStatus}
                      onChange={(e) => setPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Status</label>
                    <select
                      value={invoiceStatus}
                      onChange={(e) => setInvoiceStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Sent">Sent</option>
                      <option value="Viewed">Viewed</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      className="text-purple-600"
                    />
                    <label htmlFor="recurring" className="text-sm text-gray-700">Recurring Invoice</label>
                  </div>
                  </div>
                </div>
              </div>

            {/* Right Column - Totals and Payment Status */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>
                  {gstType==='IGST' ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IGST</span>
                      <span className="font-medium">{formatCurrency(totals.totalIGST)}</span>
              </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">SGST</span>
                        <span className="font-medium">{formatCurrency(totals.totalSGST)}</span>
            </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CGST</span>
                        <span className="font-medium">{formatCurrency(totals.totalCGST)}</span>
          </div>
                    </>
                  )}
                  <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-sm">
                    <div className="text-gray-600">Discount</div>
                    <div className="flex items-center space-x-2">
                      <input type="number" value={discountValue} onChange={(e)=>setDiscountValue(e.target.value)} className="w-24 h-8 px-2 border rounded" />
                      <select value={discountType} onChange={(e)=>setDiscountType(e.target.value)} className="h-8 px-2 border rounded text-xs">
                        <option value="fixed">Fixed</option>
                        <option value="percent">%</option>
                </select>
              </div>
              </div>
                  <div className="grid grid-cols-[1fr_auto] gap-2 items-center text-sm">
                    <div className="text-gray-600">Additional Charges</div>
                    <input type="number" value={additionalCharges} onChange={(e)=>setAdditionalCharges(e.target.value)} className="w-24 h-8 px-2 border rounded" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total (INR)</span>
                    <span className="font-semibold">{formatCurrency(totals.grandTotal)}</span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="text-xs text-gray-600">Total (in words)</div>
                    <div className="text-sm text-purple-700 font-medium">{numberToWords(Math.round(totals.grandTotal))} Rupees Only</div>
                  </div>
              </div>
            </div>
            
              {/* Signature */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Signature</h4>
                  <button type="button" onClick={()=>setIsSignatureCollapsed(v=>!v)} className="text-gray-500 hover:text-gray-700">
                    <ChevronDown className={`h-4 w-4 transition-transform ${isSignatureCollapsed ? '-rotate-90' : ''}`} />
                  </button>
              </div>
                {!isSignatureCollapsed && (
                <div className="space-y-3">
                  <label className="block">
                    <input type="file" accept="image/*" className="hidden" onChange={(e)=>onSignatureUpload(e.target.files?.[0])} />
                    <div className="h-32 border-2 border-dashed rounded flex flex-col items-center justify-center text-sm text-gray-700 cursor-pointer hover:bg-purple-50">
                      {signatureDataUrl ? (
                        <img src={signatureDataUrl} alt="Signature" className="max-h-28 object-contain" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-purple-600 mb-1" />
                          <span>Upload</span>
                        </>
                      )}
              </div>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className="px-3 py-2 border-2 border-dashed rounded text-sm text-gray-700 cursor-pointer inline-flex items-center justify-center space-x-2">
                      <Upload className="h-4 w-4 text-purple-600" />
                      <span>Upload Signature</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e)=>onSignatureUpload(e.target.files?.[0])} />
                    </label>
                    <button type="button" onClick={()=>setShowSignatureModal(true)} className="px-3 py-2 border-2 border-dashed rounded text-sm text-gray-700 inline-flex items-center justify-center space-x-2">
                      <Pen className="h-4 w-4 text-purple-600" />
                      <span>Use Signature Pad</span>
                    </button>
              </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Add signature label</label>
                    <input value={signatureLabel} onChange={(e)=>setSignatureLabel(e.target.value)} className="w-full h-9 px-3 border rounded" />
              </div>
              </div>
                )}
              </div>

              {/* Payment Status */}
             

             
              </div>
            </div>

          

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4"> </div>
             
            
          
            <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Save As Draft
              </button>
            <button
              type="submit"
              disabled={loading}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 font-medium shadow-sm flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Save & Continue</span>
                  </>
                )}
            </button>
            </div>
          </div>
        </form>

        {/* Client Management Modal */}
        {showClientManagement && (
          <ClientManagement
            onClose={() => setShowClientManagement(false)}
            onSelectClient={handleClientSelect}
            selectedClientId={selectedClient?.id}
          />
        )}

        {/* Product Catalog Modal */}
        {showProductCatalog && (
          <ProductCatalog
            onClose={() => setShowProductCatalog(false)}
            onSelectProduct={addItemFromCatalog}
            selectedProductId={selectedProduct?.id}
          />
        )}

        {/* HSN Modal */}
        {showHSNModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-purple-700 text-white">
                <h3 className="text-lg font-semibold">HSN/SAC List</h3>
                <button onClick={()=>setShowHSNModal(false)} className="p-1 text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Select HSN/SAC to apply</label>
                  <div className="relative">
                    <input value={hsnQuery} onChange={(e)=>setHsnQuery(e.target.value)} placeholder="Search items" className="w-full h-10 px-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500" />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div>Showing {(hsnPage-1)*hsnPageSize+1} to {Math.min(hsnPage*hsnPageSize, filteredHSN.length)} items of {filteredHSN.length} items</div>
                  <div className="flex items-center space-x-2">
                    <button type="button" disabled={hsnPage===1} onClick={()=>setHsnPage(p=>Math.max(1,p-1))} className="px-2 py-1 border rounded disabled:opacity-40">{'<'}
                    </button>
                    <span className="px-2 py-1 border rounded bg-white">{hsnPage}</span>
                    <button type="button" disabled={hsnPage*hsnPageSize>=filteredHSN.length} onClick={()=>setHsnPage(p=>p+1)} className="px-2 py-1 border rounded disabled:opacity-40">{'>'}
                    </button>
                    <select value={hsnPageSize} onChange={(e)=>{setHsnPageSize(parseInt(e.target.value)||50); setHsnPage(1);}} className="ml-2 h-8 px-2 border rounded">
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                </div>
                <div className="border rounded-md overflow-auto max-h-[60vh]">
                  <div className="grid grid-cols-[160px_1fr] px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 border-b">
                    <div>HSN Code</div>
                    <div>Description</div>
                  </div>
                  <div>
                    {displayedHSN.map((row, i) => (
                      <button key={i} type="button" onClick={()=>{ if(hsnForRow!=null){ handleItemChange(hsnForRow, 'hsnSac', row.code); } setShowHSNModal(false); }} className="w-full grid grid-cols-[160px_1fr] px-4 py-3 text-left hover:bg-purple-50 border-b">
                        <div className="font-mono text-sm text-gray-800">{row.code}</div>
                        <div className="text-sm text-gray-700">{row.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signature Modal */}
        {showSignatureModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Signature Pad</h3>
                <button onClick={()=>setShowSignatureModal(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
              </div>
              <div className="p-4">
                <div className="border rounded p-2">
                  <canvas ref={canvasRef} width={560} height={200}
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                    onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                    className="w-full h-48 bg-white rounded" />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">Draw your signature. Click Save to use.</div>
                    <div className="flex space-x-2">
                      <button type="button" onClick={clearCanvas} className="px-3 py-1 border rounded text-sm">Clear</button>
                      <button type="button" onClick={()=>{ saveCanvas(); setShowSignatureModal(false); }} className="px-3 py-1 bg-purple-600 text-white rounded text-sm">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Business Modal (componentized) */}
        <ShopFormModal
          isOpen={showAddShopModal}
          mode={isEditingShop ? 'edit' : 'add'}
          initialShop={isEditingShop ? selectedGSTShop : undefined}
          onClose={()=>setShowAddShopModal(false)}
          onSaved={(res)=>{ setShowAddShopModal(false); setShowShopDropdown(false); (async()=>{ try{ const token=localStorage.getItem('token'); const r=await fetch('/api/gst-shops',{ headers:{ 'Authorization':`Bearer ${token}` }}); const d=await r.json(); if(d?.success){ setGstShops(d.data); if(!isEditingShop){ const last = d.data[d.data.length-1]; setSelectedGSTShop(last); handleInputChange('shopId', last?._id); } else if (selectedGSTShop){ const updated = d.data.find(x=>x._id===selectedGSTShop._id); setSelectedGSTShop(updated||selectedGSTShop); } } }catch{}})(); }}
        />
      </div>
    </div>
  );
};

export default AddGSTBillForm;
