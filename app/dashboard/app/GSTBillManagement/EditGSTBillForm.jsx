"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Calculator } from 'lucide-react';

const EditGSTBillForm = ({ bill, onClose, onSave, shops }) => {
  const [formData, setFormData] = useState({
    shopId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    invoiceNumber: '',
    invoiceDate: '',
    dueDate: '',
    items: [],
    notes: '',
    terms: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bill) {
      setFormData({
        shopId: bill.shopId || '',
        customerName: bill.customerName || '',
        customerEmail: bill.customerEmail || '',
        customerPhone: bill.customerPhone || '',
        customerAddress: bill.customerAddress || '',
        invoiceNumber: bill.invoiceNumber || '',
        invoiceDate: bill.invoiceDate ? bill.invoiceDate.split('T')[0] : '',
        dueDate: bill.dueDate ? bill.dueDate.split('T')[0] : '',
        items: bill.items || [{
          name: '',
          description: '',
          quantity: 1,
          unitPrice: 0,
          gstRate: 18,
          amount: 0
        }],
        notes: bill.notes || '',
        terms: bill.terms || ''
      });
    }
  }, [bill]);

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

    // Calculate amount for this item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : newItems[index].quantity;
      const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : newItems[index].unitPrice;
      newItems[index].amount = quantity * unitPrice;
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        description: '',
        quantity: 1,
        unitPrice: 0,
        gstRate: 18,
        amount: 0
      }]
    }));
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
    const totalGST = formData.items.reduce((sum, item) => {
      const itemAmount = item.amount || 0;
      const gstRate = item.gstRate || 0;
      return sum + (itemAmount * gstRate / 100);
    }, 0);
    const grandTotal = subtotal + totalGST;

    return {
      subtotal: Math.round((subtotal + Number.EPSILON) * 100) / 100,
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
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item_${index}_name`] = 'Item name is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice < 0) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit GST Bill</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Shop <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.shopId}
                onChange={(e) => handleInputChange('shopId', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.shopId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a shop</option>
                {shops.map(shop => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name} - {shop.address}
                  </option>
                ))}
              </select>
              {errors.shopId && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.shopId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.invoiceNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter invoice number"
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.invoiceNumber}</p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Email</label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter customer email"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter customer phone"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Address</label>
                <textarea
                  value={formData.customerAddress}
                  onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter customer address"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.invoiceDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.invoiceDate && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.invoiceDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">Item {index + 1}</h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors[`item_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Item name"
                      />
                      {errors[`item_${index}_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_name`]}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2 lg:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Item description"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`item_${index}_unitPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                      <select
                        value={item.gstRate}
                        onChange={(e) => handleItemChange(index, 'gstRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={12}>12%</option>
                        <option value={18}>18%</option>
                        <option value={28}>28%</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="text"
                        value={formatCurrency(item.amount)}
                        readOnly
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Invoice Totals</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between py-1.5 sm:py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1.5 sm:py-2">
                <span className="text-gray-600">Total GST:</span>
                <span className="font-medium text-gray-900">{formatCurrency(totals.totalGST)}</span>
              </div>
              <div className="border-t border-green-300 pt-2">
                <div className="flex justify-between font-bold text-lg py-2">
                  <span className="text-gray-800">Grand Total:</span>
                  <span className="text-green-600">{formatCurrency(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add any additional notes"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Terms & Conditions</label>
              <textarea
                value={formData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add terms and conditions"
                rows={3}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{loading ? 'Updating...' : 'Update GST Bill'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGSTBillForm;
