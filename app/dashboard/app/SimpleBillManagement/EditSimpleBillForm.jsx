"use client";
import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Save, AlertCircle } from 'lucide-react';

const EditSimpleBillForm = ({ bill, onClose, onSave, shops }) => {
  const [formData, setFormData] = useState({
    shopId: '',
    items: [],
    pricing: {
      subtotal: 0,
      discount: 0,
      totalAmount: 0
    },
    payment: {
      method: 'cash',
      status: 'pending',
      paidAmount: 0
    },
    billDate: '',
    dueDate: '',
    description: '',
    notes: '',
    recurring: {
      isRecurring: false,
      frequency: 'monthly',
      nextDueDate: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bill) {
      setFormData({
        shopId: bill.shopId?._id || bill.shopId || '',
        items: bill.items || [],
        pricing: {
          subtotal: bill.pricing?.subtotal || 0,
          discount: bill.pricing?.discount || 0,
          totalAmount: bill.pricing?.totalAmount || 0
        },
        payment: {
          method: bill.payment?.method || 'cash',
          status: bill.payment?.status || 'pending',
          paidAmount: bill.payment?.paidAmount || 0
        },
        billDate: bill.billDate ? new Date(bill.billDate).toISOString().split('T')[0] : '',
        dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString().split('T')[0] : '',
        description: bill.description || '',
        notes: bill.notes || '',
        recurring: {
          isRecurring: bill.recurring?.isRecurring || false,
          frequency: bill.recurring?.frequency || 'monthly',
          nextDueDate: bill.recurring?.nextDueDate ? new Date(bill.recurring.nextDueDate).toISOString().split('T')[0] : ''
        }
      });
    }
  }, [bill]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.pricing.discount]);

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalAmount = subtotal - formData.pricing.discount; // NO GST

    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        subtotal,
        totalAmount
      }
    }));
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        name: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        category: '',
        description: ''
      }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.shopId) {
      newErrors.shopId = 'Please select a shop';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }

    formData.items.forEach((item, index) => {
      if (!item.name) {
        newErrors[`item_${index}_name`] = 'Item name is required';
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${index}_unitPrice`] = 'Unit price must be greater than 0';
      }
    });

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

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving bill:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!bill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Edit Simple Bill - {bill.billNumber}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.shopId}
                onChange={(e) => handleInputChange('shopId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.shopId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a shop</option>
                {(Array.isArray(shops) ? shops : []).map((shop) => {
                  const id = shop?._id || shop?.id || shop?.shopId || '';
                  const label = shop?.name || shop?.shopName || shop?.title || 'Unnamed Shop';
                  const addr = shop?.address || shop?.street || shop?.city || '';
                  return (
                    <option key={id || label} value={id}>
                      {label}{addr ? ` - ${addr}` : ''}
                    </option>
                  );
                })}
              </select>
              {errors.shopId && (
                <p className="text-red-500 text-sm mt-1">{errors.shopId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.billDate}
                onChange={(e) => handleInputChange('billDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.billDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.billDate && (
                <p className="text-red-500 text-sm mt-1">{errors.billDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter bill description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            {errors.items && (
              <p className="text-red-500 text-sm mb-4">{errors.items}</p>
            )}

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`item_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter item name"
                      />
                      {errors[`item_${index}_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`item_${index}_quantity`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`item_${index}_unitPrice`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`item_${index}_unitPrice`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_unitPrice`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                      <input
                        type="number"
                        value={item.totalPrice}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => updateItem(index, 'category', e.target.value)}
                        placeholder="Category"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Item description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                  <input
                    type="number"
                    value={formData.pricing.subtotal}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.discount}
                    onChange={(e) => handleInputChange('pricing.discount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                  <input
                    type="number"
                    value={formData.pricing.totalAmount}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={formData.payment.method}
                    onChange={(e) => handleInputChange('payment.method', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={formData.payment.status}
                    onChange={(e) => handleInputChange('payment.status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.payment.paidAmount}
                    onChange={(e) => handleInputChange('payment.paidAmount', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Amount</label>
                  <input
                    type="number"
                    value={formData.pricing.totalAmount - formData.payment.paidAmount}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurring Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.recurring.isRecurring}
                  onChange={(e) => handleInputChange('recurring.isRecurring', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-gray-700">
                  Make this a recurring bill
                </label>
              </div>

              {formData.recurring.isRecurring && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                    <select
                      value={formData.recurring.frequency}
                      onChange={(e) => handleInputChange('recurring.frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Due Date</label>
                    <input
                      type="date"
                      value={formData.recurring.nextDueDate}
                      onChange={(e) => handleInputChange('recurring.nextDueDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSimpleBillForm;
