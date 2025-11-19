import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const fallbackCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

const fallbackDate = (value) => {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return value;
  }
};

const numberToWords = (num) => {
  if (!num && num !== 0) return '';
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n, suffix = '') => {
    if (n === 0) return '';
    if (n < 20) return `${a[n]} ${suffix}`.trim();
    if (n < 100)
      return `${b[Math.floor(n / 10)]} ${a[n % 10]} ${suffix}`.replace(/\s+/g, ' ').trim();
    return `${a[Math.floor(n / 100)]} Hundred ${inWords(n % 100, '')} ${suffix}`.replace(
      /\s+/g,
      ' '
    ).trim();
  };

  if (num === 0) return 'Zero';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = Math.floor(num % 100);

  let words = '';
  words += inWords(crore, 'Crore');
  words += words && lakh ? ' ' : '';
  words += inWords(lakh, 'Lakh');
  words += words && thousand ? ' ' : '';
  words += inWords(thousand, 'Thousand');
  words += words && hundred ? ' ' : '';
  words += inWords(hundred * 100, '');
  words += words && rest ? ' and ' : '';
  words += inWords(rest, '');

  return words.trim();
};

const numberToWordsHindi = (num) => {
  if (!num && num !== 0) return '';
  const a = [
    '',
    'एक',
    'दो',
    'तीन',
    'चार',
    'पांच',
    'छह',
    'सात',
    'आठ',
    'नौ',
    'दस',
    'ग्यारह',
    'बारह',
    'तेरह',
    'चौदह',
    'पंद्रह',
    'सोलह',
    'सत्रह',
    'अठारह',
    'उन्नीस'
  ];
  const b = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

  const inWords = (n) => {
    if (n === 0) return '';
    if (n < 20) return a[n];
    if (n < 100) {
      const tens = Math.floor(n / 10);
      const ones = n % 10;
      if (ones === 0) return b[tens];
      return `${b[tens]} ${a[ones]}`;
    }
    if (n < 1000) {
      const hundreds = Math.floor(n / 100);
      const remainder = n % 100;
      let result = '';
      if (hundreds > 0) result += `${a[hundreds]} सौ`;
      if (remainder > 0) result += ` ${inWords(remainder)}`;
      return result.trim();
    }
    return '';
  };

  if (num === 0) return 'शून्य';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const rest = num % 1000;

  let words = '';
  if (crore > 0) {
    words += `${inWords(crore)} करोड़ `;
  }
  if (lakh > 0) {
    words += `${inWords(lakh)} लाख `;
  }
  if (thousand > 0) {
    words += `${inWords(thousand)} हज़ार `;
  }
  if (rest > 0) {
    words += inWords(rest);
  }

  return words.trim() || 'शून्य';
};

const calculateTotals = (bill) => {
  const items = Array.isArray(bill?.items) ? bill.items : [];
  const subtotal =
    bill?.pricing?.subtotal ??
    items.reduce((sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0), 0);
  const discount = bill?.pricing?.discount ?? bill?.discount ?? 0;
  const totalAmount =
    bill?.pricing?.totalAmount ?? Math.max(0, subtotal - (Number(discount) || 0));
  const paidAmount = bill?.payment?.paidAmount ?? 0;
  const balance = Math.max(0, totalAmount - paidAmount);

  return {
    subtotal,
    discount,
    totalAmount,
    paidAmount,
    balance
  };
};

const Terms = () => (
  <div className="border-t border-gray-200 pt-4 mt-6 print:pt-3 print:mt-4">
    <h3 className="text-sm font-semibold text-slate-900 uppercase mb-3 print:text-xs print:mb-2">Terms and Conditions</h3>
    <div className="text-xs text-gray-600 leading-5 space-y-2 print:text-[10px] print:leading-relaxed print:space-y-1">
      <p>1. Goods once sold will not be taken back; exchange is allowed only after 12 PM. (एक बार बेचे गए सामान वापस नहीं लिए जाएंगे; केवल दोपहर 12 बजे के बाद ही एक्सचेंज की अनुमति है।)</p>
      <p>2. Please check items before leaving the counter. No complaints will be entertained after leaving. (कृपया काउंटर छोड़ने से पहले सामान जांच लें। छोड़ने के बाद कोई शिकायत स्वीकार नहीं की जाएगी।)</p>
      <p>3. Payments through UPI/Cash only unless agreed in writing. (लिखित रूप से सहमति के बिना केवल UPI/नकद के माध्यम से भुगतान।)</p>
      <p>4. All disputes are subject to local jurisdiction only. (सभी विवाद केवल स्थानीय अधिकार क्षेत्र के अधीन हैं।)</p>
      <p>5. Warranty/Guarantee as per manufacturer's terms and conditions. (वारंटी/गारंटी निर्माता की शर्तों के अनुसार।)</p>
      <p>6. E. & O.E. (Errors and Omissions Excepted) (E. & O.E. (त्रुटियां और चूक सुरक्षित))</p>
    </div>
  </div>
);

const QRBlock = ({ amount, billNumber }) => {
  const upiId = '8299301972@ybl';
  const value = `upi://pay?pa=${upiId}&am=${(amount || 0).toFixed(
    2
  )}&cu=INR&tn=Payment%20for%20Invoice%20${billNumber || ''}`;

  return (
    <div className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <QRCodeSVG value={value} size={120} includeMargin level="M" />
      <p className="mt-3 text-xs font-semibold text-gray-700">
        Scan & Pay: {fallbackCurrency(amount)}
      </p>
      <p className="text-[11px] text-gray-500">{upiId}</p>
    </div>
  );
};

const InvoiceHeader = ({ bill }) => (
  <header className="border-b border-slate-200 pb-4 mb-6">
    <div className="text-center space-y-1">
      <h1 className="text-3xl font-black tracking-wide text-slate-900 uppercase">
        {bill?.shopName || 'Shop Name'}
      </h1>
      {(bill?.shopAddress || bill?.shopPhone || bill?.shopEmail) && (
        <div className="text-xs text-slate-500 space-y-1">
          {bill?.shopAddress && <p>{bill.shopAddress}</p>}
          {(bill?.shopPhone || bill?.shopEmail) && (
            <p className="flex flex-wrap items-center justify-center gap-3">
              {bill?.shopPhone && <span>📞 {bill.shopPhone}</span>}
              {bill?.shopEmail && <span>✉️ {bill.shopEmail}</span>}
            </p>
          )}
        </div>
      )}
    </div>
    <div className="mt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-600 w-full md:w-auto">
        <p className="text-slate-900 font-semibold uppercase tracking-wide mb-2">Bill to</p>
        <p className="text-sm font-semibold text-slate-900">
          {bill?.customerName || 'Valued Customer'}
        </p>
        {bill?.customerAddress && <p className="mt-1">{bill.customerAddress}</p>}
        {(bill?.customerPhone || bill?.customerEmail) && (
          <div className="mt-1 space-y-1">
            {bill?.customerPhone && <p>📞 {bill.customerPhone}</p>}
            {bill?.customerEmail && <p>✉️ {bill.customerEmail}</p>}
          </div>
        )}
      </div>
      <div className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-3 w-full md:w-auto">
        <p className="text-slate-900 font-semibold uppercase tracking-wide mb-2">Invoice Details</p>
        <p>
          <span className="font-semibold text-slate-900">Invoice #:</span>{' '}
          {bill?.billNumber || bill?.invoiceNumber || '—'}
        </p>
        <p>
          <span className="font-semibold text-slate-900">Date:</span>{' '}
          {fallbackDate(bill?.invoiceDate)}
        </p>
        {bill?.dueDate && (
          <p>
            <span className="font-semibold text-slate-900">Due:</span>{' '}
            {fallbackDate(bill.dueDate)}
          </p>
        )}
      </div>
    </div>
  </header>
);

// New header with QR code and Bill To in split layout - Exact same as image A
const InvoiceHeaderWithQR = ({ bill }) => {
  const totals = calculateTotals(bill);
  const upiId = '8299301972@ybl';
  const value = `upi://pay?pa=${upiId}&am=${(totals.totalAmount || 0).toFixed(
    2
  )}&cu=INR&tn=Payment%20for%20Invoice%20${bill?.billNumber || bill?.invoiceNumber || ''}`;

  // Format invoice number like "INV 2025 9234" instead of "INV-2025-9234"
  const formatInvoiceNumber = (invNum) => {
    if (!invNum) return '—';
    return invNum.replace(/-/g, ' ');
  };

  return (
    <header className="mb-6 print:mb-4">
      {/* 3 equal columns layout: QR, Supplier/Bill To, Shipping */}
      <div className="grid grid-cols-3 gap-4 mb-4 print:gap-3 print:mb-3">
        {/* Column 1: Invoice Details and QR Code */}
        <div className="col-span-1 space-y-4 print:space-y-3">
          <div>
            <h1 className="text-4xl font-bold text-emerald-500 mb-4 print:text-3xl print:mb-3">INVOICE</h1>
            <div className="space-y-2 text-sm text-slate-700 print:text-xs">
              <p>
                <span className="font-semibold text-emerald-600">INVOICE:</span>{' '}
                {formatInvoiceNumber(bill?.billNumber || bill?.invoiceNumber)}
              </p>
              <p>
                <span className="font-semibold text-emerald-600">DATE:</span>{' '}
                {fallbackDate(bill?.invoiceDate)}
              </p>
            </div>
          </div>
          <div className="mt-4 print:mt-3">
            <QRCodeSVG value={value} size={120} includeMargin level="M" className="print:w-24 print:h-24" />
          </div>
        </div>

        {/* Column 2: Supplier and Bill To */}
        <div className="col-span-1 space-y-6 print:space-y-4">
          {/* Supplier Section */}
          <div>
            <h2 className="text-sm font-semibold text-emerald-600 uppercase mb-2 print:text-xs print:mb-1">SUPPLIER</h2>
            <div className="text-sm text-slate-700 space-y-1 print:text-xs">
              <p className="font-semibold">{bill?.shopName || 'Shop Name'}</p>
              {bill?.shopAddress && <p>{bill.shopAddress}</p>}
              {(bill?.shopPhone || bill?.shopEmail) && (
                <div className="space-y-1">
                  {bill?.shopPhone && <p>📞 {bill.shopPhone}</p>}
                  {bill?.shopEmail && <p>✉️ {bill.shopEmail}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Bill To Section */}
          <div>
            <h2 className="text-sm font-semibold text-emerald-600 uppercase mb-2 print:text-xs print:mb-1">BILL TO</h2>
            <div className="text-sm text-slate-700 space-y-1 print:text-xs">
              <p className="font-semibold">
                {bill?.customerName || bill?.customer?.name || 'Valued Customer'}
              </p>
              {bill?.customerAddress && (
                <p>{bill.customerAddress}</p>
              )}
              {bill?.customerPhone && (
                <p>T: {bill.customerPhone}</p>
              )}
              {bill?.customerEmail && (
                <p>E: {bill.customerEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Shipping Address */}
        <div className="col-span-1">
          <h2 className="text-sm font-semibold text-emerald-600 uppercase mb-2 print:text-xs print:mb-1">SHIPPING ADDRESS</h2>
          <div className="text-sm text-slate-700 space-y-1 print:text-xs">
            <p className="font-semibold">
              {bill?.customerName || bill?.customer?.name || 'Valued Customer'}
            </p>
            {bill?.customerAddress && (
              <p>{bill.customerAddress}</p>
            )}
            {bill?.customerPhone && (
              <p>T: {bill.customerPhone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t-2 border-emerald-400 my-4 print:my-3"></div>
    </header>
  );
};

const CustomerCard = ({ bill }) => (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-slate-50">
      <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
        Payment Summary
      </h2>
      {(() => {
        const totals = calculateTotals(bill);
        return (
          <div className="text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">{fallbackCurrency(totals.subtotal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{fallbackCurrency(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Paid</span>
              <span className="font-semibold text-teal-700">
                {fallbackCurrency(totals.paidAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2">
              <span>Balance</span>
              <span className="text-rose-600">{fallbackCurrency(totals.balance)}</span>
            </div>
          </div>
        );
      })()}
    </div>
  </section>
);

const ItemsTable = ({ bill }) => {
  const items = Array.isArray(bill?.items) ? bill.items : [];
  return (
    <div className="overflow-hidden print:overflow-visible">
      <table className="w-full text-sm text-slate-700 bg-white border-collapse print:text-xs">
        <thead>
          <tr className="border-b-2 border-emerald-400 print:border-b-2">
            <th className="text-left py-3 px-3 font-semibold text-emerald-600 uppercase text-xs print:py-2 print:px-2">Article</th>
            <th className="text-right py-3 px-3 font-semibold text-emerald-600 uppercase text-xs print:py-2 print:px-2">Quantity</th>
            <th className="text-right py-3 px-3 font-semibold text-emerald-600 uppercase text-xs print:py-2 print:px-2">Unit Price</th>
            <th className="text-right py-3 px-3 font-semibold text-emerald-600 uppercase text-xs print:py-2 print:px-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-400 print:py-4 print:text-xs">
                No items added to this invoice.
              </td>
            </tr>
          ) : (
            items.map((item, idx) => {
              const quantity = item.quantity || 0;
              const rate = item.unitPrice || item.rate || 0;
              const amount = item.amount || item.totalPrice || quantity * rate;
              const unit = item.unit || 'pc';
              const quantityDisplay = `${quantity}${unit}`;
              return (
                <tr
                  key={`${item.name}-${idx}`}
                  className="border-b border-slate-200 print:border-b print:border-slate-200"
                >
                  <td className="px-3 py-3 font-medium text-slate-800 print:py-2 print:px-2">
                    {item.name || 'Item'}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700 print:py-2 print:px-2">
                    {quantityDisplay}
                  </td>
                  <td className="px-3 py-3 text-right text-slate-700 print:py-2 print:px-2">
                    {fallbackCurrency(rate)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-slate-900 print:py-2 print:px-2">
                    {fallbackCurrency(amount)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

const TotalsFooter = ({ bill }) => {
  const totals = calculateTotals(bill);
  const totalInWords = numberToWords(Math.floor(totals.totalAmount));
  const totalInWordsHindi = numberToWordsHindi(Math.floor(totals.totalAmount));
  const paise = Math.round((totals.totalAmount - Math.floor(totals.totalAmount)) * 100);
  
  return (
    <section className="mt-6 print:mt-4 print:break-inside-avoid print:page-break-inside-avoid">
      <div className="flex justify-end print:justify-end">
        <div className="w-full md:w-80 space-y-2 print:w-full print:space-y-1">
          <div className="flex justify-between text-sm text-slate-700 py-1 print:text-xs print:py-0.5">
            <span>Sub Total (Tax Inclusive):</span>
            <span className="font-medium">{fallbackCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-700 py-1 print:text-xs print:py-0.5">
            <span>Discount:</span>
            <span className="font-medium">
              {totals.discount > 0 ? `-${fallbackCurrency(totals.discount)}` : fallbackCurrency(0)}
            </span>
          </div>
          <div className="border-t-2 border-emerald-400 pt-2 mt-2 print:pt-1 print:mt-1">
            <div className="flex justify-between text-base font-semibold text-slate-900 print:text-sm">
              <span>Total:</span>
              <span>{fallbackCurrency(totals.totalAmount)}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 print:mt-2 print:pt-2">
            <div className="text-xs text-slate-600 print:text-[10px] print:leading-tight">
              <p className="font-semibold text-slate-700 mb-1 print:mb-0.5">Amount in Words:</p>
              <p className="print:leading-relaxed">
                {totalInWords} Rupees{paise > 0 ? ` and ${paise} Paise` : ''} Only
                ({totalInWordsHindi} रुपये{paise > 0 ? ` और ${numberToWordsHindi(paise)} पैसे` : ''} मात्र)
              </p>
            </div>
          </div>
        </div>
      </div>
      {bill?.notes && (
        <div className="mt-6 pt-4 border-t border-slate-200 print:mt-4 print:pt-3">
          <p className="text-sm text-slate-600 print:text-xs">{bill.notes}</p>
        </div>
      )}
    </section>
  );
};

const FooterSignature = ({ bill }) => (
  <footer className="mt-8 pt-6 print:mt-6 print:pt-4">
    <div className="text-right">
      <p className="text-sm font-semibold text-slate-900 mb-8 print:text-xs print:mb-6">for {bill?.shopName || 'Our Shop'}</p>
      <div className="h-16 flex items-center justify-end print:h-12">
        <div className="w-32 h-px bg-slate-300 print:w-24" />
      </div>
      <p className="text-xs uppercase tracking-widest text-slate-500 mt-2 print:text-[10px] print:mt-1">Authorised Signatory</p>
    </div>
  </footer>
);

const TemplateWrapper = ({ bill, template }) => {
  switch (template?.id) {
    case 'classic':
      return (
        <div className="bg-white border border-slate-300 shadow-2xl max-w-5xl w-full mx-auto rounded-2xl px-10 py-8">
          <InvoiceHeader bill={bill} />
          <CustomerCard bill={bill} />
          <ItemsTable bill={bill} />
          <TotalsFooter bill={bill} />
          <Terms />
          <FooterSignature bill={bill} />
        </div>
      );
    case 'minimal':
      return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl max-w-4xl w-full mx-auto p-10">
          <InvoiceHeader bill={bill} />
          <CustomerCard bill={bill} />
          <ItemsTable bill={bill} />
          <TotalsFooter bill={bill} />
          <Terms />
          <FooterSignature bill={bill} />
        </div>
      );
    case 'modern':
      return (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-5xl w-full mx-auto p-10">
          <InvoiceHeader bill={bill} />
          <CustomerCard bill={bill} />
          <ItemsTable bill={bill} />
          <TotalsFooter bill={bill} />
          <Terms />
          <FooterSignature bill={bill} />
        </div>
      );
    case 'default':
    default:
      // Default template - 3 column layout with 100px top padding
      return (
        <div className="bg-white max-w-5xl w-full mx-auto p-8 print:p-0 print:max-w-full print:w-full">
          <InvoiceHeaderWithQR bill={bill} />
          <ItemsTable bill={bill} />
          <TotalsFooter bill={bill} />
          <Terms />
          <FooterSignature bill={bill} />
        </div>
      );
  }
};

const InvoiceTemplateRenderer = ({ bill, template }) => {
  if (!bill) {
    return null;
  }
  return <TemplateWrapper bill={bill} template={template} />;
};

export default InvoiceTemplateRenderer;