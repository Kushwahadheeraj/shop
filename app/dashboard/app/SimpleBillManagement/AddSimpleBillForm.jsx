"use client";
import React, { useState, useEffect } from 'react';
import { Camera, Plus, Trash2, X } from 'lucide-react';
import AIReceiptScanner from '../BillManagement/AIReceiptScanner';

const AddSimpleBillForm = ({ onClose, onSave, shops = [] }) => {
  const [formData, setFormData] = useState({
    shopId: '',
    items: [{ name: '', quantity: '', unitPrice: '', category: '', description: '' }],
    pricing: {
      subtotal: 0,
      discount: '',
      totalAmount: 0
    },
    payment: {
      method: 'cash',
      status: 'pending',
      paidAmount: ''
    },
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
    notes: '',
    recurring: {
      isRecurring: false,
      frequency: 'monthly'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAIScanner, setShowAIScanner] = useState(false);

  // Calculate totals whenever items or pricing changes (NO GST)
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    const discount = parseFloat(formData.pricing.discount) || 0;
    const totalAmount = subtotal - discount; // NO GST - just subtotal minus discount
    const paidAmount = parseFloat(formData.payment.paidAmount) || 0;

    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        subtotal: isNaN(subtotal) ? 0 : subtotal,
        totalAmount: isNaN(totalAmount) ? 0 : Math.max(0, totalAmount)
      },
      payment: {
        ...prev.payment,
        paidAmount: isNaN(paidAmount) ? 0 : paidAmount,
        remainingAmount: isNaN(totalAmount - paidAmount) ? 0 : Math.max(0, totalAmount - paidAmount)
      }
    }));
  }, [formData.items, formData.pricing.discount, formData.payment.paidAmount]);

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

  const handleNestedInputChange = (parentField, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unitPrice: 0, category: '', description: '' }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const handleScanReceipt = () => {
    setShowAIScanner(true);
  };

  const handleAIScanComplete = (scannedData = {}) => {
    const shopName = (scannedData.shopName || '').toLowerCase();
    const matchingShop = shops.find(shop => {
      const lower = shop.name?.toLowerCase() || '';
      return lower.includes(shopName) || shopName.includes(lower);
    });
    const selectedShopId = matchingShop ? matchingShop._id : (shops.length > 0 ? shops[0]._id : '');

    const sanitizedItems = Array.isArray(scannedData.items)
      ? scannedData.items.map(it => ({
          name: it.name || '',
          quantity: parseFloat(it.quantity) || 0,
          unitPrice: parseFloat(it.unitPrice) || 0,
          category: it.category || '',
          description: it.description || ''
        }))
      : [];

    const sanitizedPricing = {
      subtotal: parseFloat(scannedData.pricing?.subtotal) || 0,
      discount: parseFloat(scannedData.pricing?.discount) || 0,
      totalAmount: (parseFloat(scannedData.pricing?.subtotal) || 0) - (parseFloat(scannedData.pricing?.discount) || 0)
    };

    const sanitizedPayment = {
      method: scannedData.payment?.method || 'cash',
      status: scannedData.payment?.status || 'pending',
      paidAmount: parseFloat(scannedData.payment?.paidAmount) || 0
    };

    // Populate form only. No popups, no auto-save; user will save manually.
    setFormData(prev => ({
      ...prev,
      shopId: selectedShopId,
      items: sanitizedItems.length ? sanitizedItems : prev.items,
      pricing: sanitizedPricing,
      payment: sanitizedPayment,
      billDate: scannedData.billDate || new Date().toISOString().split('T')[0],
      description: scannedData.description || ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shopId) {
      newErrors.shopId = 'Please select a shop';
    }

    if (formData.items.some(item => !item.name || !item.quantity || !item.unitPrice || parseFloat(item.quantity) <= 0 || parseFloat(item.unitPrice) < 0)) {
      newErrors.items = 'Please fill all item details correctly';
    }

    if (!formData.billDate) {
      newErrors.billDate = 'Bill date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const processedData = {
        ...formData,
        items: formData.items.map(item => ({
          ...item,
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0
        })),
        pricing: {
          ...formData.pricing,
          discount: parseFloat(formData.pricing.discount) || 0
        },
        payment: {
          ...formData.payment,
          paidAmount: parseFloat(formData.payment.paidAmount) || 0
        }
      };
      
      await onSave(processedData);
      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
      alert('Error saving bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add Simple Bill</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* AI Scan Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleScanReceipt}
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-pink-600 hover:to-orange-600 transition-all"
            >
              <Camera className="w-5 h-5" />
              Scan Receipt with AI
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shop Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop *
              </label>
              <select
                value={formData.shopId}
                onChange={(e) => handleInputChange('shopId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.shopId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {shops.length === 0 ? 'No shops available' : 'Select a shop'}
                </option>
                {(Array.isArray(shops) ? shops : []).map(shop => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name} - {shop.address}
                  </option>
                ))}
              </select>
              {errors.shopId && <p className="text-red-500 text-sm mt-1">{errors.shopId}</p>}
            </div>

            {/* Amount and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount
                </label>
                <input
                  type="number"
                  value={isNaN(formData.pricing.totalAmount) ? 0 : formData.pricing.totalAmount.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.payment.method}
                  onChange={(e) => handleNestedInputChange('payment', 'method', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>

            {/* Items Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Items *
                </label>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Item name"
                      value={item.name || ''}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity ?? ''}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice ?? ''}
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Category"
                      value={item.category || ''}
                      onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
            </div>

            {/* Pricing Details - NO GST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtotal
                </label>
                <input
                  type="number"
                  value={isNaN(formData.pricing.subtotal) ? 0 : formData.pricing.subtotal.toFixed(2)}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount
                </label>
                <input
                  type="number"
                  value={isNaN(formData.pricing.discount) ? 0 : formData.pricing.discount}
                  onChange={(e) => handleNestedInputChange('pricing', 'discount', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Total Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount (Subtotal - Discount)
              </label>
              <input
                type="number"
                value={isNaN(formData.pricing.totalAmount) ? 0 : formData.pricing.totalAmount.toFixed(2)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-lg font-semibold"
              />
            </div>

            {/* Paid Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paid Amount
              </label>
              <input
                type="number"
                value={isNaN(formData.payment.paidAmount) ? 0 : formData.payment.paidAmount}
                onChange={(e) => handleNestedInputChange('payment', 'paidAmount', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bill Date *
                </label>
                <input
                  type="date"
                  value={formData.billDate}
                  onChange={(e) => handleInputChange('billDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.billDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.billDate && <p className="text-red-500 text-sm mt-1">{errors.billDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                placeholder="Enter description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Recurring Transaction */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Recurring Transaction</h3>
                  <p className="text-sm text-gray-500">Set up a recurring schedule for this transaction</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recurring.isRecurring}
                    onChange={(e) => handleNestedInputChange('recurring', 'isRecurring', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {formData.recurring.isRecurring && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.recurring.frequency}
                    onChange={(e) => handleNestedInputChange('recurring', 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Bill'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showAIScanner && (
        <AIReceiptScanner
          onClose={() => setShowAIScanner(false)}
          onScanComplete={handleAIScanComplete}
        />
      )}
    </div>
  );
};

export default AddSimpleBillForm;
