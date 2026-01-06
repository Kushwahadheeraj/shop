"use client";
import React from 'react';
import { X, Eye, Edit, Trash2, Download, Printer, Calendar, MapPin, Phone, Mail, CreditCard, Clock } from 'lucide-react';

const BillViewModal = ({ bill, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !bill) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 sm:p-6 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bill Details</h2>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.print()}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => onEdit(bill)}
              className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Bill"
            >
              <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Bill Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Bill Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Bill Number:</span>
                    <span className="font-medium truncate ml-2">{bill.billNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(bill.billDate)}</span>
                  </div>
                  {bill.dueDate && (
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">{formatDate(bill.dueDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm sm:text-base">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                      {bill.status?.toUpperCase() || 'DRAFT'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Shop Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{bill.shopName}</p>
                      <p className="text-xs sm:text-sm text-gray-600 break-words">{bill.shopAddress}</p>
                    </div>
                  </div>
                  {bill.shopId?.contact?.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 truncate">{bill.shopId.contact.phone}</span>
                    </div>
                  )}
                  {bill.shopId?.contact?.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-gray-600 truncate">{bill.shopId.contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Items</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Category
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Unit Price
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bill.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-gray-900">{item.name || 'Unnamed Item'}</div>
                          {item.description && (
                            <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">{item.description}</div>
                          )}
                          <div className="text-xs sm:text-sm text-gray-500 sm:hidden">{item.category || '-'}</div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                        {item.category || '-'}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                        {item.quantity || 0}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                        {formatCurrency(item.unitPrice || 0)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalPrice || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Pricing Summary</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(bill.pricing?.subtotal || 0)}</span>
                </div>
                {(bill.pricing?.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(bill.pricing.discount)}</span>
                  </div>
                )}
                {(bill.pricing?.extraCharge || 0) > 0 && (
                  <div className="flex justify-between text-sm sm:text-base text-blue-600">
                    <span>Extra Charge:</span>
                    <span>+{formatCurrency(bill.pricing.extraCharge)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">GST ({bill.pricing?.gstRate || 0}%):</span>
                  <span className="font-medium">{formatCurrency(bill.pricing?.gstAmount || 0)}</span>
                </div>
                <div className="border-t pt-2 sm:pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(bill.pricing?.totalAmount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Payment Information</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize truncate ml-2">{bill.payment?.method?.replace('_', ' ') || 'Cash'}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(bill.payment?.status)}`}>
                    {bill.payment?.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Paid Amount:</span>
                  <span className="font-medium text-green-600">{formatCurrency(bill.payment?.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Remaining:</span>
                  <span className="font-medium text-red-600">{formatCurrency(bill.payment?.remainingAmount || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {(bill.description || bill.notes) && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Additional Information</h3>
              <div className="space-y-3 sm:space-y-4">
                {bill.description && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Description</h4>
                    <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3 break-words">{bill.description}</p>
                  </div>
                )}
                {bill.notes && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Notes</h4>
                    <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-2 sm:p-3 break-words">{bill.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recurring Information */}
          {bill.recurring?.isRecurring && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recurring Information</h3>
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <span className="text-sm sm:text-base font-medium text-blue-900">Recurring Bill</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="capitalize">{bill.recurring.frequency}</span>
                  </div>
                  {bill.recurring.nextDueDate && (
                    <div className="flex justify-between">
                      <span>Next Due:</span>
                      <span>{formatDate(bill.recurring.nextDueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-4 p-4 sm:p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 flex-1">
            <button
              onClick={() => onEdit(bill)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Edit Bill</span>
            </button>
            <button
              onClick={() => onDelete(bill._id)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Delete Bill</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillViewModal;
