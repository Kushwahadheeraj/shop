"use client";
import React from 'react';
import { X, Edit, Trash2, Printer, Download, FileText } from 'lucide-react';

const GSTBillViewModal = ({ bill, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !bill) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a downloadable PDF or Excel file
        // Implementation for download functionality
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-4 md:p-6 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">GST Bill Details</h2>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
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
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Bill Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">GST INVOICE</h1>
            <p className="text-sm sm:text-base text-gray-600">Invoice No: {bill.invoiceNumber}</p>
            <p className="text-sm sm:text-base text-gray-600">Date: {formatDate(bill.invoiceDate)}</p>
            {bill.dueDate && (
              <p className="text-sm sm:text-base text-gray-600">Due Date: {formatDate(bill.dueDate)}</p>
            )}
          </div>

          {/* Company and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">From:</h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-1 sm:space-y-2">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{bill.shopName}</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">{bill.shopAddress || 'Address not provided'}</p>
                <p className="text-sm sm:text-base text-gray-600">GST: {bill.shopGST || 'Not provided'}</p>
                <p className="text-sm sm:text-base text-gray-600">Phone: {bill.shopPhone || 'Not provided'}</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">Email: {bill.shopEmail || 'Not provided'}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">To:</h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg space-y-1 sm:space-y-2">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{bill.customerName}</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">{bill.customerAddress || 'Address not provided'}</p>
                <p className="text-sm sm:text-base text-gray-600">GST: {bill.customerGST || 'Not provided'}</p>
                <p className="text-sm sm:text-base text-gray-600">Phone: {bill.customerPhone || 'Not provided'}</p>
                <p className="text-sm sm:text-base text-gray-600 break-words">Email: {bill.customerEmail || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Items</h3>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[720px] border border-gray-300 text-[11px] sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-700 border-b border-gray-300">S.No</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-700 border-b border-gray-300">Item</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-left font-medium text-gray-700 border-b border-gray-300 hidden md:table-cell">Description</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-300">Qty</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-300 hidden sm:table-cell">Rate</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-300 hidden sm:table-cell">GST %</th>
                    <th className="px-3 sm:px-4 py-2 sm:py-3 text-right font-medium text-gray-700 border-b border-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items && bill.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900">{index + 1}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900">
                        <div className="text-xs sm:text-sm font-medium">{item.name}</div>
                        <div className="text-[11px] text-gray-600 sm:hidden">{item.description || '-'}</div>
                      </td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 hidden md:table-cell">{item.description || '-'}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 text-right hidden sm:table-cell">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 text-right hidden sm:table-cell">{item.gstRate}%</td>
                      <td className="px-3 sm:px-4 py-2 sm:py-3 text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-80 space-y-2 sm:space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-200 text-sm sm:text-base">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(bill.netAmount)}</span>
                </div>
              <div className="flex justify-between py-2 border-b border-gray-200 text-sm sm:text-base">
                  <span className="text-gray-600">Total GST:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(bill.gstAmount)}</span>
                </div>
              <div className="flex justify-between items-center py-3 sm:py-4 bg-green-50 px-3 sm:px-4 rounded-lg">
                <span className="text-base sm:text-lg font-bold text-gray-900">Grand Total:</span>
                <span className="text-base sm:text-lg font-bold text-green-600">{formatCurrency(bill.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(bill.notes || bill.terms) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {bill.notes && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm sm:text-base text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg break-words">{bill.notes}</p>
                </div>
              )}
              {bill.terms && (
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-sm sm:text-base text-gray-600 bg-gray-50 p-3 sm:p-4 rounded-lg break-words">{bill.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* GST Summary */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">GST Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-gray-600">CGST</p>
                <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatCurrency(bill.gstAmount / 2)}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-gray-600">SGST</p>
                <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatCurrency(bill.gstAmount / 2)}</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs sm:text-sm text-gray-600">Total GST</p>
                <p className="text-sm sm:text-lg font-semibold text-gray-900">{formatCurrency(bill.gstAmount)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-xs sm:text-sm">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={() => onEdit(bill)}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(bill._id)}
            className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSTBillViewModal;
