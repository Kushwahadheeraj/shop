import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Calculator, Calendar, Edit, Upload, ChevronDown, RefreshCw, Pen, Paperclip, FileText, StickyNote, Info, Phone, Settings, Users, Package, DollarSign, Mail, Printer, Download, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
      hsnSac: '0',
      quantity: 1,
      unitPrice: 1,
      gstRate: 0,
      amount: 1,
      cgst: 0,
      sgst: 0,
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
      const cgst = (amount * gstRate / 100) / 2;
      const sgst = (amount * gstRate / 100) / 2;
      const total = amount + (amount * gstRate / 100);
      
      newItems[index].amount = amount;
      newItems[index].cgst = cgst;
      newItems[index].sgst = sgst;
      newItems[index].total = total;
    }

    if (field === 'gstRate') {
      const gstRate = parseFloat(value) || 0;
      const amount = newItems[index].amount || 0;
      const cgst = (amount * gstRate / 100) / 2;
      const sgst = (amount * gstRate / 100) / 2;
      const total = amount + (amount * gstRate / 100);
      
      newItems[index].cgst = cgst;
      newItems[index].sgst = sgst;
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
        hsnSac: '0',
        quantity: 1,
        unitPrice: 1,
        gstRate: 0,
        amount: 1,
        cgst: 0,
        sgst: 0,
        total: 1
      }]
    }));
  };

  const addItemFromCatalog = (product) => {
    const newItem = {
      name: product.name,
      hsnSac: product.hsnSac,
      quantity: 1,
      unitPrice: product.unitPrice,
      gstRate: product.gstRate,
      amount: product.unitPrice,
      cgst: (product.unitPrice * product.gstRate / 100) / 2,
      sgst: (product.unitPrice * product.gstRate / 100) / 2,
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
    const totalGST = totalCGST + totalSGST;
    const grandTotal = subtotal + totalGST;

    return {
      subtotal: Math.round((subtotal + Number.EPSILON) * 100) / 100,
      totalCGST: Math.round((totalCGST + Number.EPSILON) * 100) / 100,
      totalSGST: Math.round((totalSGST + Number.EPSILON) * 100) / 100,
      totalGST: Math.round((totalGST + Number.EPSILON) * 100) / 100,
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

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b bg-white">
          {/* Centered GST Invoice Title */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-dashed border-gray-300 pb-1">GST Invoice</h1>
              <Edit className="h-4 w-4 text-gray-500 cursor-pointer" />
            </div>
            <div className="flex items-center justify-center space-x-1 text-purple-600 cursor-pointer mt-2">
              <Plus className="h-3 w-3 text-orange-500" />
              <span className="text-sm">Add Subtitle</span>
            </div>
          </div>

          {/* Invoice Details in Column Layout with Logo */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 pb-1">Invoice No*</label>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900 border-b border-purple-500 pb-1">1328</span>
                  <span className="text-xs text-gray-500 mt-1">Last No: 1327 (Sep 20, 2025)</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 pb-1">Invoice Date*</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900 border-b border-purple-500 pb-1">Sep 21, 2025</span>
                  <Calendar className="h-3 w-3 text-gray-400" />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700 border-b border-dashed border-gray-300 pb-1">Due Date</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-900 border-b border-purple-500 pb-1">Oct 06, 2025</span>
                  <div className="flex space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <Settings className="h-3 w-3 text-gray-400 cursor-pointer" />
                    <X className="h-3 w-3 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

          <div className="flex items-center space-x-4">
              <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 text-center min-w-[200px]">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Upload className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Add Business Logo</p>
                <p className="text-xs text-gray-500">Resolution up to 1080x1080px.</p>
                <p className="text-xs text-gray-500">PNG or JPEG file.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

          <div className="flex items-center justify-center space-x-1 text-purple-600 cursor-pointer text-sm mt-4">
            <Plus className="h-3 w-3 text-purple-600" />
            <span>Add More Fields</span>
                    </div>
                  </div>
                  
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
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
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
              <div className="grid grid-cols-9 gap-4 text-sm font-medium">
                <div>Item</div>
                <div>HSN/SAC</div>
                <div>GST Rate</div>
                <div>Quantity</div>
                <div>Rate</div>
                <div>Amount</div>
                <div>CGST</div>
                <div>SGST</div>
                <div>Total</div>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-b-lg">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-9 gap-4 p-4 border-b border-gray-200 last:border-b-0">
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Name/SKU Id (Required)"
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={item.hsnSac}
                      onChange={(e) => handleItemChange(index, 'hsnSac', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
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
                  <div>
                    <input
                      type="text"
                      value={formatCurrency(item.cgst)}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={formatCurrency(item.sgst)}
                      readOnly
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-50"
                    />
                  </div>
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
                </div>
              ))}
              
              {/* Add Item Row */}
              <div className="p-4 border-t-2 border-dashed border-gray-300">
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="cursor-pointer hover:text-purple-600">Add Description</span>
                  <span className="cursor-pointer hover:text-purple-600">Add Thumbnail</span>
                  <span className="cursor-pointer hover:text-purple-600">Duplicate</span>
                  <select className="px-2 py-1 border border-gray-300 rounded hover:border-purple-500">
                    <option>Product</option>
                  </select>
                  <span className="cursor-pointer hover:text-purple-600">Select Sales Ledger</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add New Line</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProductCatalog(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Package className="h-4 w-4" />
                    <span>Add from Catalog</span>
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <span>Add New Group</span>
                    <span className="text-orange-500">🔥</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Totals and Options */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Additional Options */}
            {/* <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addMoreFields"
                  checked={formData.addMoreFields}
                  onChange={(e) => handleInputChange('addMoreFields', e.target.checked)}
                  className="text-purple-600"
                />
                <label htmlFor="addMoreFields" className="text-sm text-gray-700">Add More Fields</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showTotalInWords"
                  checked={formData.showTotalInWords}
                  onChange={(e) => handleInputChange('showTotalInWords', e.target.checked)}
                  className="text-purple-600"
                />
                <label htmlFor="showTotalInWords" className="text-sm text-gray-700">Show Total in Words</label>
              </div>
              <div className="flex space-x-2">
                <button type="button" className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <Pen className="h-4 w-4" />
                  <span>Add Signature</span>
                </button>
                <button type="button" className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <Paperclip className="h-4 w-4" />
                  <span>Add Attachments</span>
                </button>
              </div>
            </div> */}

            {/* Middle Column - Additional Elements */}
            {/* <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" className="flex items-center space-x-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <FileText className="h-4 w-4" />
                  <span>Add Terms & Conditions</span>
                </button>
                <button type="button" className="flex items-center space-x-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <StickyNote className="h-4 w-4" />
                  <span>Add Notes</span>
                </button>
                <button type="button" className="flex items-center space-x-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <Info className="h-4 w-4" />
                  <span>Add Additional Info</span>
                </button>
                <button type="button" className="flex items-center space-x-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  <Phone className="h-4 w-4" />
                  <span>Add Contact Details</span>
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    className="text-gray-400"
                  />
                  <label htmlFor="recurring" className="text-sm font-medium text-gray-700">This is a Recurring invoice</label>
                </div>
                <p className="text-xs text-gray-600">A draft invoice will be created with the same details every next period.</p>
              </div>
            </div> */}

            {/* Right Column - Totals and Payment Status */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SGST:</span>
                    <span className="font-medium">{formatCurrency(totals.totalSGST)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CGST:</span>
                    <span className="font-medium">{formatCurrency(totals.totalCGST)}</span>
                  </div>
                  <div className="text-purple-600 cursor-pointer text-sm">
                    Add Discounts/Additional Charges
                    </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="hideTotals"
                      checked={formData.hideTotals}
                      onChange={(e) => handleInputChange('hideTotals', e.target.checked)}
                      className="text-purple-600"
                    />
                    <label htmlFor="hideTotals" className="text-sm text-gray-700">Hide Totals</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="summarizeQuantity"
                      checked={formData.summarizeTotalQuantity}
                      onChange={(e) => handleInputChange('summarizeTotalQuantity', e.target.checked)}
                      className="text-gray-400"
                    />
                    <label htmlFor="summarizeQuantity" className="text-sm text-gray-700">Summarize Total Quantity</label>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
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

              {/* Quick Actions */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          {/* <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select HSN column view</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Unit as</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>Merge with quantity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show tax summary in invoice</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option>Do not show</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hidePlaceOfSupply"
                  checked={formData.hidePlaceOfSupply}
                  onChange={(e) => handleInputChange('hidePlaceOfSupply', e.target.checked)}
                  className="text-purple-600"
                />
                <label htmlFor="hidePlaceOfSupply" className="text-sm text-gray-700">Hide place/country of supply</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showHSNSummary"
                  checked={formData.showHSNSummary}
                  onChange={(e) => handleInputChange('showHSNSummary', e.target.checked)}
                  className="text-purple-600"
                />
                <label htmlFor="showHSNSummary" className="text-sm text-gray-700">Show HSN summary in invoice</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showOriginalImages"
                  checked={formData.showOriginalImages}
                  onChange={(e) => handleInputChange('showOriginalImages', e.target.checked)}
                  className="text-gray-400"
                />
                <label htmlFor="showOriginalImages" className="text-sm text-gray-700">Add original images in line items</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showThumbnails"
                  checked={formData.showThumbnails}
                  onChange={(e) => handleInputChange('showThumbnails', e.target.checked)}
                  className="text-gray-400"
                />
                <label htmlFor="showThumbnails" className="text-sm text-gray-700">Show thumbnails in separate column</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showDescriptionFullWidth"
                  checked={formData.showDescriptionFullWidth}
                  onChange={(e) => handleInputChange('showDescriptionFullWidth', e.target.checked)}
                  className="text-gray-400"
                />
                <label htmlFor="showDescriptionFullWidth" className="text-sm text-gray-700">Show description in full width</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hideSubtotalForGroups"
                  checked={formData.hideSubtotalForGroups}
                  onChange={(e) => handleInputChange('hideSubtotalForGroups', e.target.checked)}
                  className="text-gray-400"
                />
                <label htmlFor="hideSubtotalForGroups" className="text-sm text-gray-700">Hide subtotal for group items</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showSKU"
                  checked={formData.showSKU}
                  onChange={(e) => handleInputChange('showSKU', e.target.checked)}
                  className="text-gray-400"
                />
                <label htmlFor="showSKU" className="text-sm text-gray-700">Show SKU in invoice</label>
              </div>
            </div>
          </div> */}

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Advanced Options</span>
              </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Save As Draft
            </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
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
