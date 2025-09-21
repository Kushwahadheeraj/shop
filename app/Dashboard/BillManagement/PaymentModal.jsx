import React, { useState } from 'react';
import { X, Save, CreditCard, Smartphone, FileText, Camera } from 'lucide-react';

const PaymentModal = ({ bill, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    method: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen || !bill) return null;

  const remainingAmount = bill.pricing?.totalAmount - (bill.payment?.paidAmount || 0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = parseFloat(formData.amount) || 0;

    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (amount > remainingAmount) {
      newErrors.amount = `Amount cannot exceed remaining balance of ₹${remainingAmount}`;
    }

    if (!formData.method) {
      newErrors.method = 'Please select a payment method';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Please select a payment date';
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
      const amount = parseFloat(formData.amount) || 0;
      const paymentData = {
        ...formData,
        amount: amount,
        billId: bill._id,
        previousPaidAmount: bill.payment?.paidAmount || 0,
        newPaidAmount: (bill.payment?.paidAmount || 0) + amount
      };
      
      await onSave(paymentData);
      onClose();
    } catch (error) {
      console.error('Error saving payment:', error);
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

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return <CreditCard className="h-5 w-5" />;
      case 'upi':
        return <Smartphone className="h-5 w-5" />;
      case 'cheque':
        return <FileText className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodLabel = (method) => {
    switch (method) {
      case 'cash':
        return 'Cash';
      case 'upi':
        return 'UPI';
      case 'cheque':
        return 'Cheque';
      default:
        return 'Cash';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] overflow-y-auto mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Add Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Bill Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Bill:</span> {bill.billNumber}</p>
            <p><span className="font-medium">Shop:</span> {bill.shopName}</p>
            <p><span className="font-medium">Total Amount:</span> {formatCurrency(bill.pricing?.totalAmount || 0)}</p>
            <p><span className="font-medium">Paid Amount:</span> {formatCurrency(bill.payment?.paidAmount || 0)}</p>
            <p className="text-lg font-bold text-red-600">
              <span className="font-medium">Remaining:</span> {formatCurrency(remainingAmount)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                min="0.01"
                max={remainingAmount}
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Maximum: {formatCurrency(remainingAmount)}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['cash', 'upi', 'cheque'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => handleInputChange('method', method)}
                  className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all duration-200 ${
                    formData.method === method
                      ? 'border-green-500 bg-green-50 text-green-700 shadow-md'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    formData.method === method ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getMethodIcon(method)}
                  </div>
                  <span className="text-sm font-medium mt-2">{getMethodLabel(method)}</span>
                </button>
              ))}
            </div>
            {errors.method && (
              <p className="text-red-500 text-sm mt-1">{errors.method}</p>
            )}
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.paymentDate}
              onChange={(e) => handleInputChange('paymentDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                errors.paymentDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.paymentDate && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Add payment notes (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* AI Scanning Button */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="p-1 bg-blue-100 rounded-full">
                <Camera className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-blue-900">AI Receipt Scanning</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Scan payment receipt to automatically extract amount and details
            </p>
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Camera className="h-4 w-4" />
              <span>Scan Receipt</span>
            </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Payment Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Current Payment:</span>
                <span className="font-medium text-gray-900">{formatCurrency(parseFloat(formData.amount) || 0)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Previous Paid:</span>
                <span className="font-medium text-gray-900">{formatCurrency(bill.payment?.paidAmount || 0)}</span>
              </div>
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-bold text-base py-1">
                  <span className="text-gray-800">New Total Paid:</span>
                  <span className="text-green-600">
                    {formatCurrency((bill.payment?.paidAmount || 0) + (parseFloat(formData.amount) || 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">Remaining After Payment:</span>
                  <span className="text-red-600 font-medium">
                    {formatCurrency(remainingAmount - (parseFloat(formData.amount) || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.amount || parseFloat(formData.amount) <= 0}
              className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium shadow-sm"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Processing...' : 'Add Payment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
