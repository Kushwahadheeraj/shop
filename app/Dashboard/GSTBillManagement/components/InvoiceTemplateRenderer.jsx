import React from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';

// Helper component for Terms & Conditions
const TermsAndConditions = ({ className = '' }) => (
  <div className={`border-t text-xs ${className}`}>
    <div className="flex justify-between items-center px-3 py-1 border-b">
      <div className="font-semibold">Terms & Conditions</div>
      <div className="font-semibold">(E.&O.E.)</div>
    </div>
    <div className="px-3 py-2 leading-5">
      <div>1 : Goods/Services once sold will not be taken back or exchanged.</div>
      <div>2 : All disputes are subject to Deoria jurisdiction only.</div>
      <div>3 : Warranty/Guarantee of products lies with the manufacturer only.</div>
      <div>4 : Kindly check goods at the time of delivery; no claims will be entertained afterwards.</div>
      <div>5 : Payment to be made only in company&apos;s account.</div>
    </div>
  </div>
);

// Helper component for UPI QR Code
const UPIQRCode = ({ amount, invoiceNumber, formatCurrency }) => {
  const upiId = '8299301972@ybl';
  const upiUrl = `upi://pay?pa=${upiId}&am=${(amount || 0).toFixed(2)}&cu=INR&tn=Payment%20for%20Invoice%20${invoiceNumber || ''}`;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="border border-gray-300 bg-white p-2 rounded">
        <QRCodeSVG
          value={upiUrl}
          size={120}
          level="M"
          includeMargin={false}
        />
      </div>
      <div className="text-xs text-center mt-1 text-gray-600 font-semibold">
        {formatCurrency(amount || 0)}
      </div>
    </div>
  );
};

// Helper component for Signatory and Bank Details
const SignatoryAndBankDetails = ({ bill, bank, formatCurrency, className = '' }) => (
  <div className={`border-t border-b grid grid-cols-[1fr_2fr_1fr] text-sm ${className}`}>
    <div className="border-r p-3">
      <div className="font-semibold mb-1">Customer&apos;s Seal and Signature</div>
    </div>
    <div className="border-r p-3 bg-yellow-50/50">
      <div className="font-semibold mb-2">Company&apos;s Bank Details</div>
      <div className="grid grid-cols-[160px_10px_1fr] gap-y-1">
        <div className="text-gray-700">Bank Name</div><div>:</div><div className="font-semibold">{bank?.bankName || '-'}</div>
        <div className="text-gray-700">A/c&apos;s Holder Name</div><div>:</div><div className="font-semibold">{bank?.accountHolder || bill?.shopName || '-'}</div>
        <div className="text-gray-700">A/c No.</div><div>:</div><div className="font-semibold">{bank?.accountNumber || '-'}</div>
        <div className="text-gray-700">Branch & IFSC Code</div><div>:</div><div className="font-semibold">{bank?.branch || ''}{bank?.branch && bank?.ifsc ? ' & ' : ''}{bank?.ifsc || ''}</div>
        <div className="text-gray-700">Phonepay/GPay No</div><div>:</div><div className="font-semibold">{bank?.upiNumber || bank?.upiPhone || '-'}</div>
        <div className="text-gray-700">Account Name</div><div>:</div><div className="font-semibold">{bank?.accountHolder || '-'}</div>
      </div>
      {/* QR Code for UPI Payment */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="font-semibold mb-2 text-center">Scan To Pay</div>
        <UPIQRCode amount={bill?.grandTotal} invoiceNumber={bill?.invoiceNumber} formatCurrency={formatCurrency} />
      </div>
    </div>
    <div className="p-3 flex flex-col text-center justify-between" style={{ minHeight: '140px' }}>
      <div className="font-semibold">for {bill?.shopName || '-'}</div>
      <div className="flex items-center justify-center">
        {bill?.signatureDataUrl ? (
          <Image src={bill.signatureDataUrl} alt="Signature" width={128} height={64} className="h-16 object-contain" />
        ) : (
          <div className="h-16 w-32" />
        )}
      </div>
      <div className="font-semibold">Authorised Signatory</div>
    </div>
  </div>
);

// Template 1: Modern Professional - Purple accent, clean design
const Template1 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-white border-2 border-purple-600 shadow-lg p-6 max-w-5xl mx-auto">
    {/* Header with purple accent */}
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg">
      <div className="text-center">
        <div className="text-2xl font-bold mb-2">TAX INVOICE</div>
        <div className="text-3xl font-extrabold uppercase">{bill.shopName || '-'}</div>
        <div className="text-sm mt-2 opacity-90">{bill.shopAddress || ''}</div>
        <div className="text-xs mt-2">
          GSTIN: {bill.shopGST || '-'} | PAN: {bill.shopPAN || '-'} | State: {pickStateName()} {pickStateCode()}
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6 border-2 border-purple-200">
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="border-l-4 border-purple-600 pl-4">
          <div className="font-bold text-purple-700 mb-2">Bill To</div>
          <div className="text-gray-900 font-semibold">{bill.customerName || '-'}</div>
          <div className="text-gray-700 text-sm mt-1">{bill.customerAddress || '-'}</div>
          <div className="text-xs text-gray-600 mt-2">
            GST: {bill.customerGST || '-'} | State: {pickCustomerStateName()} {pickCustomerStateCode()}
          </div>
        </div>
        <div className="border-l-4 border-purple-600 pl-4">
          <div className="font-bold text-purple-700 mb-2">Invoice Details</div>
          <div className="text-sm space-y-1">
            <div><span className="font-semibold">Invoice No:</span> {bill.invoiceNumber}</div>
            <div><span className="font-semibold">Date:</span> {formatDate(bill.invoiceDate)}</div>
            <div><span className="font-semibold">Due Date:</span> {bill.dueDate ? formatDate(bill.dueDate) : '-'}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-purple-100">
            <tr>
              <th className="border border-purple-300 p-2 text-left">Sr</th>
              <th className="border border-purple-300 p-2 text-left">Description</th>
              <th className="border border-purple-300 p-2 text-right">HSN</th>
              <th className="border border-purple-300 p-2 text-right">Qty</th>
              <th className="border border-purple-300 p-2 text-right">Rate</th>
              <th className="border border-purple-300 p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(bill.items || []).map((it, idx) => (
              <tr key={idx} className="hover:bg-purple-50">
                <td className="border border-purple-300 p-2">{idx + 1}</td>
                <td className="border border-purple-300 p-2">{it.name}</td>
                <td className="border border-purple-300 p-2 text-right">{it.hsnSac || '-'}</td>
                <td className="border border-purple-300 p-2 text-right">{it.quantity} {it.unit || 'pcs'}</td>
                <td className="border border-purple-300 p-2 text-right">{formatCurrency(it.unitPrice)}</td>
                <td className="border border-purple-300 p-2 text-right font-semibold">{formatCurrency(it.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-purple-100 font-bold">
            <tr>
              <td colSpan="5" className="border border-purple-300 p-2 text-right">Total</td>
              <td className="border border-purple-300 p-2 text-right">{formatCurrency(bill.grandTotal || 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Totals */}
      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatCurrency(bill.netAmount || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST:</span>
            <span className="font-semibold">{formatCurrency(bill.gstAmount || 0)}</span>
          </div>
          <div className="flex justify-between text-lg border-t border-purple-300 pt-2 mt-2">
            <span className="font-bold">Grand Total:</span>
            <span className="font-bold text-purple-700">{formatCurrency(bill.grandTotal || 0)}</span>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-700">
          Amount in words: <span className="font-semibold">INR {numberToWords(Math.round(bill.grandTotal || 0))} Only</span>
        </div>
      </div>

      {/* Terms & Conditions */}
      <TermsAndConditions className="border-purple-300 mt-4" />

      {/* Signatory and Bank Details */}
      <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-purple-300" />
    </div>
  </div>
);

// Template 2: Classic Business - Traditional layout with borders
const Template2 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-white border-2 border-gray-800 shadow-lg p-6 max-w-5xl mx-auto">
    <div className="border-2 border-gray-800">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 text-center">
        <div className="text-xl font-bold mb-1">TAX INVOICE</div>
        <div className="text-2xl font-extrabold uppercase">{bill.shopName || '-'}</div>
        <div className="text-xs mt-2">{bill.shopAddress || ''}</div>
        <div className="text-xs mt-1">
          GSTIN: {bill.shopGST || '-'} | PAN: {bill.shopPAN || '-'}
        </div>
      </div>

      {/* Bill To and Invoice Details */}
      <div className="grid grid-cols-2 border-t-2 border-gray-800">
        <div className="border-r-2 border-gray-800 p-4">
          <div className="font-bold text-gray-800 mb-2 border-b border-gray-400 pb-1">Bill To</div>
          <div className="font-semibold">{bill.customerName || '-'}</div>
          <div className="text-sm text-gray-700 mt-1">{bill.customerAddress || '-'}</div>
        </div>
        <div className="p-4">
          <div className="font-bold text-gray-800 mb-2 border-b border-gray-400 pb-1">Invoice Details</div>
          <div className="text-sm space-y-1">
            <div>Invoice No: <span className="font-semibold">{bill.invoiceNumber}</span></div>
            <div>Date: {formatDate(bill.invoiceDate)}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="border-t-2 border-gray-800">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-600 p-2">Sr</th>
              <th className="border border-gray-600 p-2 text-left">Description</th>
              <th className="border border-gray-600 p-2">HSN</th>
              <th className="border border-gray-600 p-2">Qty</th>
              <th className="border border-gray-600 p-2">Rate</th>
              <th className="border border-gray-600 p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(bill.items || []).map((it, idx) => (
              <tr key={idx}>
                <td className="border border-gray-600 p-2 text-center">{idx + 1}</td>
                <td className="border border-gray-600 p-2">{it.name}</td>
                <td className="border border-gray-600 p-2 text-center">{it.hsnSac || '-'}</td>
                <td className="border border-gray-600 p-2 text-center">{it.quantity}</td>
                <td className="border border-gray-600 p-2 text-right">{formatCurrency(it.unitPrice)}</td>
                <td className="border border-gray-600 p-2 text-right">{formatCurrency(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-gray-800 p-4 bg-gray-50">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(bill.netAmount || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST:</span>
              <span className="font-semibold">{formatCurrency(bill.gstAmount || 0)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-800 pt-2 font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(bill.grandTotal || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <TermsAndConditions className="border-gray-800" />

      {/* Signatory and Bank Details */}
      <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-gray-800" />
    </div>
  </div>
);

// Template 3: Minimalist - Clean and simple
const Template3 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-white p-8 max-w-5xl mx-auto">
    <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
      <div className="text-3xl font-light text-gray-800 mb-2">INVOICE</div>
      <div className="text-xl text-gray-600">{bill.shopName || '-'}</div>
      <div className="text-sm text-gray-500 mt-2">{bill.shopAddress || ''}</div>
      <div className="text-xs text-gray-400 mt-1">GSTIN: {bill.shopGST || '-'}</div>
    </div>

    <div className="grid grid-cols-2 gap-8 mb-8">
      <div>
        <div className="text-xs text-gray-500 uppercase mb-2">Bill To</div>
        <div className="font-semibold text-gray-900">{bill.customerName || '-'}</div>
        <div className="text-sm text-gray-600 mt-1">{bill.customerAddress || '-'}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 uppercase mb-2">Invoice Details</div>
        <div className="text-sm space-y-1">
          <div>Invoice # {bill.invoiceNumber}</div>
          <div>Date: {formatDate(bill.invoiceDate)}</div>
        </div>
      </div>
    </div>

    <div className="mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3">Item</th>
            <th className="text-right py-3">Qty</th>
            <th className="text-right py-3">Rate</th>
            <th className="text-right py-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(bill.items || []).map((it, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-3">{it.name}</td>
              <td className="text-right py-3">{it.quantity}</td>
              <td className="text-right py-3">{formatCurrency(it.unitPrice)}</td>
              <td className="text-right py-3 font-semibold">{formatCurrency(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="text-right space-y-2 mb-6">
      <div className="flex justify-end gap-8">
        <span>Total:</span>
        <span className="font-bold text-xl">{formatCurrency(bill.grandTotal || 0)}</span>
      </div>
    </div>

    {/* Terms & Conditions */}
    <TermsAndConditions className="border-gray-300" />

    {/* Signatory and Bank Details */}
    <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-gray-300" />
  </div>
);

// Template 4: Creative - Colorful design
const Template4 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 max-w-5xl mx-auto rounded-lg shadow-xl">
    <div className="bg-white rounded-lg p-6 border-4 border-blue-500">
      <div className="text-center mb-6 pb-4 border-b-4 border-blue-500">
        <div className="text-4xl font-black text-blue-600 mb-2">TAX INVOICE</div>
        <div className="text-2xl font-bold text-gray-800">{bill.shopName || '-'}</div>
        <div className="text-sm text-gray-600 mt-2">{bill.shopAddress || ''}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="font-bold text-blue-700 mb-2">Bill To</div>
          <div className="font-semibold">{bill.customerName || '-'}</div>
          <div className="text-sm text-gray-700 mt-1">{bill.customerAddress || '-'}</div>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="font-bold text-purple-700 mb-2">Invoice Info</div>
          <div className="text-sm space-y-1">
            <div>Invoice: <span className="font-semibold">{bill.invoiceNumber}</span></div>
            <div>Date: {formatDate(bill.invoiceDate)}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <table className="w-full text-sm bg-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-right">Qty</th>
              <th className="p-3 text-right">Rate</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(bill.items || []).map((it, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-blue-50' : 'bg-white'}>
                <td className="p-3">{it.name}</td>
                <td className="p-3 text-right">{it.quantity}</td>
                <td className="p-3 text-right">{formatCurrency(it.unitPrice)}</td>
                <td className="p-3 text-right font-semibold">{formatCurrency(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg text-right mb-6">
        <div className="text-2xl font-bold">Total: {formatCurrency(bill.grandTotal || 0)}</div>
      </div>

      {/* Terms & Conditions */}
      <TermsAndConditions className="border-blue-500" />

      {/* Signatory and Bank Details */}
      <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-blue-500" />
    </div>
  </div>
);

// Template 5: Corporate - Formal and structured
const Template5 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-white border border-gray-300 p-8 max-w-5xl mx-auto">
    <div className="border-b-4 border-gray-800 pb-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold text-gray-900">{bill.shopName || '-'}</div>
          <div className="text-sm text-gray-600 mt-1">{bill.shopAddress || ''}</div>
          <div className="text-xs text-gray-500 mt-1">GSTIN: {bill.shopGST || '-'}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800">TAX INVOICE</div>
          <div className="text-sm text-gray-600 mt-1">Invoice # {bill.invoiceNumber}</div>
          <div className="text-xs text-gray-500">Date: {formatDate(bill.invoiceDate)}</div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-6">
      <div>
        <div className="text-xs uppercase text-gray-500 mb-2">Bill To</div>
        <div className="font-semibold text-gray-900">{bill.customerName || '-'}</div>
        <div className="text-sm text-gray-700 mt-1">{bill.customerAddress || '-'}</div>
      </div>
      <div>
        <div className="text-xs uppercase text-gray-500 mb-2">Payment Terms</div>
        <div className="text-sm text-gray-700">Due Date: {bill.dueDate ? formatDate(bill.dueDate) : 'N/A'}</div>
      </div>
    </div>

    <div className="mb-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 border-y-2 border-gray-800">
            <th className="p-3 text-left font-semibold">Description</th>
            <th className="p-3 text-center font-semibold">HSN</th>
            <th className="p-3 text-right font-semibold">Qty</th>
            <th className="p-3 text-right font-semibold">Rate</th>
            <th className="p-3 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(bill.items || []).map((it, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="p-3">{it.name}</td>
              <td className="p-3 text-center">{it.hsnSac || '-'}</td>
              <td className="p-3 text-right">{it.quantity}</td>
              <td className="p-3 text-right">{formatCurrency(it.unitPrice)}</td>
              <td className="p-3 text-right font-semibold">{formatCurrency(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="flex justify-end mb-6">
      <div className="w-80 space-y-2 border-t-2 border-gray-800 pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>{formatCurrency(bill.netAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>GST:</span>
          <span>{formatCurrency(bill.gstAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t-2 border-gray-800 pt-2">
          <span>Total:</span>
          <span>{formatCurrency(bill.grandTotal || 0)}</span>
        </div>
      </div>
    </div>

    {/* Terms & Conditions */}
    <TermsAndConditions className="border-gray-800" />

    {/* Signatory and Bank Details */}
    <SignatoryAndBankDetails bill={bill} bank={bank} className="border-gray-800" />
  </div>
);

// Template 6: E-commerce - Product focused
const Template6 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-white p-6 max-w-5xl mx-auto border-2 border-orange-300 rounded-lg shadow-lg">
    <div className="bg-orange-500 text-white p-4 rounded-t-lg mb-4">
      <div className="text-center">
        <div className="text-xl font-bold">TAX INVOICE</div>
        <div className="text-lg mt-1">{bill.shopName || '-'}</div>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-50 p-3 rounded">
        <div className="text-xs text-gray-500 mb-1">Bill To</div>
        <div className="font-semibold text-sm">{bill.customerName || '-'}</div>
        <div className="text-xs text-gray-600 mt-1">{bill.customerAddress || '-'}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded">
        <div className="text-xs text-gray-500 mb-1">Invoice</div>
        <div className="font-semibold text-sm">{bill.invoiceNumber}</div>
        <div className="text-xs text-gray-600 mt-1">{formatDate(bill.invoiceDate)}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded">
        <div className="text-xs text-gray-500 mb-1">Order Total</div>
        <div className="font-bold text-lg text-orange-600">{formatCurrency(bill.grandTotal || 0)}</div>
      </div>
    </div>

    <div className="mb-6">
      <div className="bg-orange-100 p-2 rounded-t-lg font-semibold text-sm mb-2">Items</div>
      <div className="space-y-2">
        {(bill.items || []).map((it, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border-l-4 border-orange-500">
            <div className="flex-1">
              <div className="font-semibold">{it.name}</div>
              <div className="text-xs text-gray-500">HSN: {it.hsnSac || '-'} | Qty: {it.quantity}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{formatCurrency(it.amount)}</div>
              <div className="text-xs text-gray-500">{formatCurrency(it.unitPrice)} each</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-orange-50 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-600">Amount in words</div>
          <div className="font-semibold text-sm">{numberToWords(Math.round(bill.grandTotal || 0))} Only</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(bill.grandTotal || 0)}</div>
        </div>
      </div>
    </div>

    {/* Terms & Conditions */}
    <TermsAndConditions className="border-orange-300" />

    {/* Signatory and Bank Details */}
    <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-orange-300" />
  </div>
);

// Template 7: Elegant - Sophisticated design
const Template7 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-gradient-to-b from-gray-50 to-white p-8 max-w-5xl mx-auto border border-gray-300 shadow-2xl">
    <div className="text-center mb-8 pb-6 border-b border-gray-400">
      <div className="text-4xl font-thin text-gray-700 mb-2 tracking-widest">INVOICE</div>
      <div className="text-xl font-light text-gray-600">{bill.shopName || '-'}</div>
      <div className="text-sm text-gray-500 mt-2 italic">{bill.shopAddress || ''}</div>
    </div>

    <div className="grid grid-cols-2 gap-8 mb-8">
      <div className="border-l-2 border-gray-400 pl-4">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Bill To</div>
        <div className="text-lg font-light text-gray-900">{bill.customerName || '-'}</div>
        <div className="text-sm text-gray-600 mt-2 leading-relaxed">{bill.customerAddress || '-'}</div>
      </div>
      <div className="text-right border-r-2 border-gray-400 pr-4">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-3">Invoice Details</div>
        <div className="text-sm space-y-2 text-gray-700">
          <div>Invoice # <span className="font-semibold">{bill.invoiceNumber}</span></div>
          <div>Date: {formatDate(bill.invoiceDate)}</div>
        </div>
      </div>
    </div>

    <div className="mb-8">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="text-left py-4 font-light">Item</th>
            <th className="text-right py-4 font-light">Quantity</th>
            <th className="text-right py-4 font-light">Price</th>
            <th className="text-right py-4 font-light">Total</th>
          </tr>
        </thead>
        <tbody>
          {(bill.items || []).map((it, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-4 text-gray-700">{it.name}</td>
              <td className="text-right py-4 text-gray-600">{it.quantity}</td>
              <td className="text-right py-4 text-gray-600">{formatCurrency(it.unitPrice)}</td>
              <td className="text-right py-4 font-semibold text-gray-900">{formatCurrency(it.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="text-right space-y-3 border-t-2 border-gray-400 pt-6 mb-6">
      <div className="flex justify-end gap-12">
        <div className="text-sm text-gray-600">Total Amount</div>
        <div className="text-3xl font-light text-gray-900">{formatCurrency(bill.grandTotal || 0)}</div>
      </div>
    </div>

    {/* Terms & Conditions */}
    <TermsAndConditions className="border-gray-400" />

    {/* Signatory and Bank Details */}
    <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-gray-400" />
  </div>
);

// Template 8: Compact - Space efficient
const Template8 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-white p-4 max-w-5xl mx-auto border border-gray-400 text-xs">
    <div className="grid grid-cols-3 gap-2 mb-3 border-b-2 border-gray-800 pb-2">
      <div>
        <div className="font-bold text-sm">{bill.shopName || '-'}</div>
        <div className="text-gray-600">{bill.shopAddress || ''}</div>
        <div className="text-gray-500">GST: {bill.shopGST || '-'}</div>
      </div>
      <div className="text-center">
        <div className="font-bold text-sm">TAX INVOICE</div>
        <div className="text-gray-600">#{bill.invoiceNumber}</div>
        <div className="text-gray-500">{formatDate(bill.invoiceDate)}</div>
      </div>
      <div className="text-right">
        <div className="font-semibold">Bill To:</div>
        <div className="text-gray-700">{bill.customerName || '-'}</div>
        <div className="text-gray-600 text-xs">{bill.customerAddress || '-'}</div>
      </div>
    </div>

    <table className="w-full text-xs border-collapse mb-2">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-400 p-1 text-left">Item</th>
          <th className="border border-gray-400 p-1 text-right">Qty</th>
          <th className="border border-gray-400 p-1 text-right">Rate</th>
          <th className="border border-gray-400 p-1 text-right">Amt</th>
        </tr>
      </thead>
      <tbody>
        {(bill.items || []).map((it, idx) => (
          <tr key={idx}>
            <td className="border border-gray-400 p-1">{it.name}</td>
            <td className="border border-gray-400 p-1 text-right">{it.quantity}</td>
            <td className="border border-gray-400 p-1 text-right">{formatCurrency(it.unitPrice)}</td>
            <td className="border border-gray-400 p-1 text-right font-semibold">{formatCurrency(it.amount)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="flex justify-end border-t-2 border-gray-800 pt-2 mb-4">
      <div className="text-right space-y-1">
        <div className="flex gap-4">
          <span>Total:</span>
          <span className="font-bold">{formatCurrency(bill.grandTotal || 0)}</span>
        </div>
      </div>
    </div>

    {/* Terms & Conditions */}
    <TermsAndConditions className="border-gray-800" />

    {/* Signatory and Bank Details */}
    <SignatoryAndBankDetails bill={bill} bank={bank} className="border-gray-800" />
  </div>
);

// Template 9: Colorful - Vibrant design
const Template9 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => (
  <div className="bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 p-6 max-w-5xl mx-auto rounded-2xl shadow-2xl">
    <div className="bg-white rounded-xl p-6 border-4 border-pink-400">
      <div className="text-center mb-6">
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 mb-2">
          INVOICE
        </div>
        <div className="text-2xl font-bold text-gray-800">{bill.shopName || '-'}</div>
        <div className="text-sm text-gray-600 mt-2">{bill.shopAddress || ''}</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-4 rounded-lg">
          <div className="font-bold text-pink-700 mb-2">Bill To</div>
          <div className="font-semibold text-gray-900">{bill.customerName || '-'}</div>
          <div className="text-sm text-gray-700 mt-1">{bill.customerAddress || '-'}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-200 to-blue-300 p-4 rounded-lg">
          <div className="font-bold text-blue-700 mb-2">Invoice</div>
          <div className="font-semibold text-gray-900">{bill.invoiceNumber}</div>
          <div className="text-sm text-gray-700 mt-1">{formatDate(bill.invoiceDate)}</div>
        </div>
      </div>

      <div className="mb-6">
        {(bill.items || []).map((it, idx) => (
          <div key={idx} className={`p-4 mb-2 rounded-lg ${idx % 2 === 0 ? 'bg-yellow-100' : 'bg-blue-100'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-900">{it.name}</div>
                <div className="text-xs text-gray-600">Qty: {it.quantity} | HSN: {it.hsnSac || '-'}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{formatCurrency(it.amount)}</div>
                <div className="text-xs text-gray-600">{formatCurrency(it.unitPrice)} each</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-white p-4 rounded-lg text-center mb-6">
        <div className="text-3xl font-black">Total: {formatCurrency(bill.grandTotal || 0)}</div>
      </div>

      {/* Terms & Conditions */}
      <TermsAndConditions className="border-pink-400" />

      {/* Signatory and Bank Details */}
      <SignatoryAndBankDetails bill={bill} bank={bank} formatCurrency={formatCurrency} className="border-pink-400" />
    </div>
  </div>
);

// Template 10: Detailed - Comprehensive layout (uses original structure)
const Template10 = ({ bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => {
  // This is the original detailed template - keeping it as is
  return null; // Will use the original structure from InvoicePreview
};

// Main Template Renderer Component
const InvoiceTemplateRenderer = ({ bill, templateId, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank }) => {
  const props = { bill, formatCurrency, formatDate, numberToWords, pickStateName, pickStateCode, pickCustomerStateName, pickCustomerStateCode, bank };
  
  switch(templateId) {
    case 1: return <Template1 {...props} />;
    case 2: return <Template2 {...props} />;
    case 3: return <Template3 {...props} />;
    case 4: return <Template4 {...props} />;
    case 5: return <Template5 {...props} />;
    case 6: return <Template6 {...props} />;
    case 7: return <Template7 {...props} />;
    case 8: return <Template8 {...props} />;
    case 9: return <Template9 {...props} />;
    case 10: return <Template10 {...props} />;
    default: return <Template1 {...props} />;
  }
};

export default InvoiceTemplateRenderer;

