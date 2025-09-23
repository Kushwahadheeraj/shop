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
    console.log('Downloading GST bill:', bill.invoiceNumber);
    // Implementation for download functionality
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">GST Bill Details</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div className="p-6">
          {/* Bill Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">GST INVOICE</h1>
            <p className="text-gray-600">Invoice No: {bill.invoiceNumber}</p>
            <p className="text-gray-600">Date: {formatDate(bill.invoiceDate)}</p>
            {bill.dueDate && (
              <p className="text-gray-600">Due Date: {formatDate(bill.dueDate)}</p>
            )}
          </div>

          {/* Company and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">From:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{bill.shopName}</p>
                <p className="text-gray-600">{bill.shopAddress || 'Address not provided'}</p>
                <p className="text-gray-600">GST: {bill.shopGST || 'Not provided'}</p>
                <p className="text-gray-600">Phone: {bill.shopPhone || 'Not provided'}</p>
                <p className="text-gray-600">Email: {bill.shopEmail || 'Not provided'}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">To:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900">{bill.customerName}</p>
                <p className="text-gray-600">{bill.customerAddress || 'Address not provided'}</p>
                <p className="text-gray-600">GST: {bill.customerGST || 'Not provided'}</p>
                <p className="text-gray-600">Phone: {bill.customerPhone || 'Not provided'}</p>
                <p className="text-gray-600">Email: {bill.customerEmail || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">S.No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Item Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-300">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-300">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-300">GST %</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b border-gray-300">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items && bill.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.description || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.gstRate}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(bill.netAmount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total GST:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(bill.gstAmount)}</span>
                </div>
                <div className="flex justify-between py-4 bg-green-50 px-4 rounded-lg">
                  <span className="text-lg font-bold text-gray-900">Grand Total:</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(bill.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {(bill.notes || bill.terms) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {bill.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{bill.notes}</p>
                </div>
              )}
              {bill.terms && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Terms & Conditions</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{bill.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* GST Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">GST Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">CGST</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(bill.gstAmount / 2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">SGST</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(bill.gstAmount / 2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total GST</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(bill.gstAmount)}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
            <p>This is a computer generated invoice.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={() => onEdit(bill)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(bill._id)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSTBillViewModal;
