"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Edit, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import InvoiceTemplateRenderer from '../components/InvoiceTemplateRenderer';
import API_BASE_URL from '@/lib/apiConfig';

export default function InvoicePreview() {
  const params = useSearchParams();
  const router = useRouter();
  const [bill, setBill] = useState(null);
  const [bank, setBank] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const load = async () => {
      const billId = params.get('billId');
      if (!billId) { router.push('/Dashboard/GSTBillManagement'); return; }
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/gst-bills/${billId}`, { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data?.success) {
        const b = data.data.gstBill;
        setBill(b);
        // fetch linked bank account for display
        try {
          if (b?.bankAccountId) {
            const res2 = await fetch(`${API_BASE_URL}/bank-accounts`, { headers: { 'Authorization': `Bearer ${token}` } });
            const d2 = await res2.json();
            const list = d2?.data || [];
            const acc = list.find(x => String(x._id) === String(b.bankAccountId));
            if (acc) setBank(acc);
          }
        } catch {}
      } else router.push('/Dashboard/GSTBillManagement');
    };
    load();
  }, [params, router]);

  // Inject print styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        body { background: white; }
        @page { size: A4; margin: 12mm; }
        /* Print only the invoice area */
        body * { visibility: hidden !important; }
        .invoice-sheet, .invoice-sheet * { visibility: visible !important; }
        .invoice-sheet { position: absolute; left: 0; top: 0; right: 0; margin: 0 auto; box-shadow: none !important; border: 1px solid #000 !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    // Download only the invoice content as PDF via print-to-pdf UX
    window.print();
  };

  if (!bill) return <div className="p-6">Loading...</div>;

  const templateId = bill.templateId || 1; // Default to template 1

  const formatCurrency = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Math.round((n + Number.EPSILON) * 100)/100);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN');
  // number to words (Indian system) for "Amount Chargeable (in words)"
  const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const belowThousand = (n) => {
      let str = '';
      if (n > 99) {
        str += a[Math.floor(n / 100)] + ' Hundred ';
        n = n % 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      } else if (n > 0) {
        str += a[n];
      }
      return str.trim();
    };
    if (!num) return 'Zero';
    let n = Math.floor(Math.abs(num));
    const parts = [];
    const units = [
      { d: 10000000, l: 'Crore' },
      { d: 100000, l: 'Lakh' },
      { d: 1000, l: 'Thousand' },
      { d: 100, l: 'Hundred' }
    ];
    for (const u of units) {
      if (n >= u.d) {
        const q = Math.floor(n / u.d);
        parts.push((u.d === 100 ? a[q] : belowThousand(q)) + ' ' + u.l);
        n = n % u.d;
      }
    }
    if (n > 0) parts.push(belowThousand(n));
    return parts.join(' ').trim();
  };

  // pick state and code robustly
  const pickStateName = () => {
    if (bill.shopStateName) return bill.shopStateName;
    if (bill.shopId && (bill.shopId.stateName || bill.shopId.state)) return bill.shopId.stateName || bill.shopId.state;
    if (bill.shopAddress && bill.shopAddress.includes('Uttar Pradesh')) return 'Uttar Pradesh';
    if (bill.shopAddress && bill.shopAddress.includes('Uttarakhand')) return 'Uttarakhand';
    return '';
  };
  const pickStateCode = () => {
    if (bill.shopStateCode) return bill.shopStateCode;
    if (bill.shopId && bill.shopId.stateCode) return bill.shopId.stateCode;
    if (bill.shopAddress && bill.shopAddress.includes('code-')) return bill.shopAddress.split('code-')[1]?.replace(/\D/g,'') || '';
    return '';
  };

  // customer state helpers from saved address like "..., Uttar Pradesh, India (code-09)"
  const pickCustomerStateCode = () => {
    if (bill.customerStateCode) return bill.customerStateCode;
    const a = bill.customerAddress || '';
    const m = a.match(/\(code-\s*(\d{2})\)/i);
    return m ? m[1] : '';
  };
  const pickCustomerStateName = () => {
    if (bill.customerStateName) return bill.customerStateName;
    const a = bill.customerAddress || '';
    const idx = a.toLowerCase().indexOf('(code-');
    const before = idx > -1 ? a.slice(0, idx) : a;
    const parts = before.split(',').map(s => s.trim()).filter(Boolean);
    if (!parts.length) return '';
    // Prefer last non-country token
    const isCountry = (s) => /^(india|bharat|republic of india)$/i.test(s);
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!isCountry(parts[i])) return parts[i];
    }
    return parts[parts.length - 1];
  };

  return (
    <div className="p-6">
      <div className="flex justify-end gap-2 mb-4 no-print">
        <button onClick={()=>router.push('/Dashboard/GSTBillManagement')} className="px-3 py-2 border rounded flex items-center gap-2"><Edit className="w-4 h-4"/>Edit</button>
        <button onClick={handleDownload} className="px-3 py-2 border rounded flex items-center gap-2"><Download className="w-4 h-4"/>Download</button>
        <button onClick={handlePrint} className="px-3 py-2 border rounded flex items-center gap-2"><Printer className="w-4 h-4"/>Print</button>
      </div>

      {/* Render template based on templateId - Template 10 uses original detailed structure */}
      {templateId === 10 ? (
        <div ref={printRef} className={`bg-white border border-black shadow p-6 max-w-5xl mx-auto invoice-sheet template-${templateId}`}>
          {/* Original Detailed Template (Template 10) */}
          <div className='border border-black'>
        <div className="border-b pb-3">
          
          <div className="text-center mt-1">
            <div className="text-lg font-bold tracking-wide">TAX INVOICE</div>
          </div>
          <div className="mt-2 text-center">
            <div className="text-3xl font-extrabold tracking-widest uppercase">{bill.shopName || '-'}</div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-800 whitespace-pre-line">
            {bill.shopAddress || ''}
          </div>
          <div className="mt-1 text-center text-sm text-gray-800">
            <span className="font-semibold">GSTIN :</span> {bill.shopGST || '-'}
            <span className="mx-1">|</span>
            <span className="font-semibold">PAN :</span> {bill.shopPAN || '-'}
            <span className="mx-1">|</span>
            <span className="font-semibold">State/Code :</span> {pickStateName()} {pickStateCode()}
          </div>
          
          <div className="mt-1 text-center text-sm text-gray-800">
            {bill.shopPhone ? (<><span className="font-semibold">Mobile No. :</span> {bill.shopPhone}</>) : null}
            {bill.shopEmail ? (<><span className="mx-1">|</span><span className="font-semibold">Email ID :</span> {bill.shopEmail}</>) : null}
          </div>
        </div>
   {/* Parties + Invoice details + Scan (5-part layout: 2|2|1) */}
   <div className="grid grid-cols-5 text-sm  border-t border-black">
          {/* Bill To */}
          <div className="p-2 border-r border-black col-span-2">
            <div className="font-semibold mb-1">Bill To</div>
            <div className="text-gray-900 font-semibold">{bill.customerName || '-'}</div>
            <div className="text-gray-800 whitespace-pre-line">{bill.customerAddress || '-'}</div>
            <div className="grid grid-cols-[140px_10px_1fr] gap-y-1 mt-1">
              <div className="font-medium">State Code/Name</div><div>:</div><div className="break-words break-all">{pickCustomerStateName()} {pickCustomerStateName() && pickCustomerStateCode() ? '-' : ''} {pickCustomerStateCode() || ''}</div>
              <div className="font-medium">GST Number</div><div>:</div><div className="break-words break-all">{bill.customerGST || '-'}</div>
              <div className="font-medium">Contact No.</div><div>:</div><div className="break-words break-all">{bill.customerPhone || '-'}</div>
              <div className="font-medium">Email ID</div><div>:</div><div className="break-words break-all">{bill.customerEmail || '-'}</div>
            </div>
          </div>
          {/* Invoice details */}
          <div className="p-2 border-r border-black col-span-2">
            <div className="grid grid-cols-[150px_10px_1fr] gap-y-1">
              <div className="font-semibold">Invoice Number</div><div>:</div><div className="font-medium">{bill.invoiceNumber}</div>
              <div className="font-semibold">Invoice Date</div><div>:</div><div>{formatDate(bill.invoiceDate)}</div>
              <div className="font-semibold">Supplier Ref No.</div><div>:</div><div></div>
              <div className="font-semibold">Payment Terms</div><div>:</div><div></div>
              <div className="font-semibold">Dispatched Via</div><div>:</div><div></div>
              <div className="font-semibold">Dispatch Details</div><div>:</div><div></div>
              <div className="font-semibold">Vehicle No</div><div>:</div><div></div>
              <div className="font-semibold">E-Way Bill No.</div><div>:</div><div></div>
          </div>
          </div>
          {/* Scan to pay */}
          <div className="p-2 flex flex-col items-center justify-start col-span-1">
            <div className="font-semibold mb-1">Scan To Pay</div>
            <div className="w-40 h-40 flex items-center justify-center border border-gray-300 bg-white p-2">
              {(() => {
                const upiId = '8299301972@ybl';
                const amount = bill.grandTotal || 0;
                const upiUrl = `upi://pay?pa=${upiId}&am=${amount.toFixed(2)}&cu=INR&tn=Payment%20for%20Invoice%20${bill.invoiceNumber || ''}`;
                return (
                  <QRCodeSVG
                    value={upiUrl}
                    size={140}
                    level="M"
                    includeMargin={false}
                  />
                );
              })()}
            </div>
            <div className="text-xs text-center mt-1 text-gray-600">
              ₹{formatCurrency(bill.grandTotal || 0).replace('₹', '')}
            </div>
          </div>
        </div>

        {/* Items table */}
         <div className="">
          <table className="w-full text-sm border-t border-black border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border-black border-r border-b">Sr. No</th>
                <th className="text-left p-2 border-black border-r border-b">Description of Goods/Services</th>
                <th className="text-right p-2 border-black border-r border-b">HSN/SAC Code</th>
                <th className="text-right p-2 border-black border-r border-b">GST Rate</th>
                <th className="text-right p-2 border-black border-r border-b">Quantity</th>
                <th className="text-right p-2 border-black border-r border-b">Rate</th>
                <th className="text-center p-2 border-black border-r border-b">Per</th>
                <th className="text-right p-2 border-black border-r border-b">Disc %</th>
                <th className="text-right p-2 border-black border-l border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(bill.items || []).map((it, idx) => (
                <tr key={idx} className="align-top">
                  <td className="p-2 border-black border-r">{idx+1}</td>
                  <td className="p-2 border-black border-x">{it.name}</td>
                  <td className="p-2 text-right border-black border-x">{it.hsnSac || it.hsn || '-'}</td>
                  <td className="p-2 text-right border-black border-x">{it.gstRate}%</td>
                  <td className="p-2 text-right border-black border-x">{it.quantity} {it.unit || 'pcs'}</td>
                  <td className="p-2 text-right border-black border-x">{formatCurrency(it.unitPrice)}</td>
                  <td className="p-2 text-center border-black border-x">{it.unit || 'pcs'}</td>
                  <td className="p-2 text-right border-black border-x">{typeof it.discountPercent === 'number' ? `${it.discountPercent}%` : (it.discPercent ? `${it.discPercent}%` : '')}</td>
                  <td className="p-2 text-right border-black border-l">{formatCurrency(it.amount)}</td>
                </tr>
              ))}
              {(() => {
                const items = bill.items || [];
                const totalIGST = items.reduce((s, i) => s + (parseFloat(i.igst) || 0), 0);
                const cg = items.reduce((s, i) => s + (parseFloat(i.cgst) || (totalIGST>0 ? 0 : ((parseFloat(i.amount)||0) * ((parseFloat(i.gstRate)||0)/100) / 2))), 0);
                const sg = items.reduce((s, i) => s + (parseFloat(i.sgst) || (totalIGST>0 ? 0 : ((parseFloat(i.amount)||0) * ((parseFloat(i.gstRate)||0)/100) / 2))), 0);
                if (totalIGST > 0) {
                  // IGST row: label inside Description column aligned right
                  return (
                    <tr>
                      <td className="p-2 border-black border-r"></td>
                      <td className="p-2 border-black border-x text-right"><span className="font-medium">IGST</span></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black text-right border-l">{formatCurrency(totalIGST)}</td>
                    </tr>
                  );
                }
                // Show SGST and CGST lines like the sample image
                return (
                  <>
                    <tr>
                      <td className="p-2 border-black border-r"></td>
                      <td className="p-2 border-black border-x text-right"><span className="font-medium">SGST</span></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black text-right border-l">{formatCurrency(sg)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-black border-r"></td>
                      <td className="p-2 border-black border-x text-right"><span className="font-medium">CGST</span></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black border-x"></td>
                      <td className="p-2 border-black text-right border-l">{formatCurrency(cg)}</td>
                    </tr>
                  </>
                );
              })()}
            </tbody>
            <tfoot>
              <tr className=" border-black font-semibold">
                <td className="p-2 border-r border-t border-black"></td>
                <td className="p-2 font-semibold border-r border-t border-black">Total</td>
                <td className="p-2 border-r border-t border-black"></td>
                <td className="p-2 border-r border-t border-black"></td>
                <td className="p-2 text-right font-semibold border-r border-t border-black">
                  {(() => {
                    const qty = (bill.items || []).reduce((s, i) => s + (parseFloat(i.quantity) || 0), 0);
                    const unit = (bill.items || [])[0]?.unit || 'pcs';
                    return `${qty} ${unit}`;
                  })()}
                </td>
                <td className="p-2 border-r border-t border-black"></td>
                <td className="p-2 text-center border-r border-t border-black">{(bill.items || [])[0]?.unit || 'pcs'}</td>
                <td className="p-2 border-r border-t border-black"></td>
                <td className="p-2 text-right font-semibold border-l border-t border-black">{formatCurrency(bill.grandTotal || (bill.netAmount||0) + (bill.gstAmount||0))}</td>
              </tr>
            </tfoot>
          </table>
           {/* Amount in words full-width row under table (like image) */}
         <div className="border-t border-black text-sm">
           <div className="px-3">Amount Chargeable (in words)</div>
          <div className="px-3 py-1 font-bold">INR {numberToWords(Math.round(bill.grandTotal || ((bill.netAmount||0) + (bill.gstAmount||0))))} Only</div>
        </div>
        <div className="border-t text-sm">
          {(() => {
            const items = bill.items || [];
            const byHsn = {};
            items.forEach((it) => {
              const key = it.hsnSac || it.hsn || '-';
              if (!byHsn[key]) byHsn[key] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, rate: it.gstRate || 0 };
              const amount = parseFloat(it.amount) || 0;
              const rate = parseFloat(it.gstRate) || 0;
              const gstAmt = amount * rate / 100;
              byHsn[key].taxable += amount;
              if ((parseFloat(it.igst) || 0) > 0) {
                byHsn[key].igst += parseFloat(it.igst) || (gstAmt);
              } else {
                byHsn[key].cgst += parseFloat(it.cgst) || (gstAmt / 2);
                byHsn[key].sgst += parseFloat(it.sgst) || (gstAmt / 2);
              }
              byHsn[key].rate = rate;
            });
            const rows = Object.entries(byHsn);
            const totals = rows.reduce((acc, [, v]) => ({
              taxable: acc.taxable + v.taxable,
              cgst: acc.cgst + v.cgst,
              sgst: acc.sgst + v.sgst,
              igst: acc.igst + v.igst,
            }), { taxable: 0, cgst: 0, sgst: 0, igst: 0 });
            const totalTax = totals.cgst + totals.sgst + totals.igst;
            if (!rows.length) return null;
            return (
              <div className="border-t border-black">
                <table className="w-full text-sm ">
                  <thead>
                    <tr>
                      <th className="border-r border-black text-center align-middle">HSN/SAC</th>
                      <th className="border-r border-black text-center align-middle" colSpan={1}>Taxable<br/>Value</th>
                      <th className="border-r border-black text-center" colSpan={2}>CGST</th>
                      <th className="border-r border-black text-center" colSpan={2}>SGST/UTGST</th>
                      <th className="border-l border-black text-center align-middle">Total<br/>Tax Amount</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border-r border-black"></th>
                      <th className="border-r border-black text-right"></th>
                      <th className="border border-black text-center">Rate</th>
                      <th className="border border-black text-right">Amount</th>
                      <th className="border border-black text-center">Rate</th>
                      <th className="border border-black text-right">Amount</th>
                      <th className="border-l border-black"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(([hsn, v], i) => {
                      const cgstRate = v.igst > 0 ? 0 : (v.rate / 2);
                      const sgstRate = v.igst > 0 ? 0 : (v.rate / 2);
                      const taxAmt = v.cgst + v.sgst + v.igst;
                      return (
                        <tr className='border-t border-black' key={i}>
                          <td className="border-r border-black px-2 py-1">{hsn}</td>
                          <td className="border border-black px-2 py-1 text-right">{formatCurrency(v.taxable)}</td>
                          <td className="border border-black px-2 py-1 text-center">{cgstRate ? `${cgstRate}%` : ''}</td>
                          <td className="border border-black px-2 py-1 text-right">{formatCurrency(v.cgst)}</td>
                          <td className="border border-black px-2 py-1 text-center">{sgstRate ? `${sgstRate}%` : ''}</td>
                          <td className="border border-black px-2 py-1 text-right">{formatCurrency(v.sgst || v.igst)}</td>
                          <td className="border-l border-black px-2 py-1 text-right">{formatCurrency(taxAmt)}</td>
                        </tr>
                      );
                    })}
                    <tr className="font-semibold bg-gray-100">
                      <td className="border-r border-t border-black px-2 py-1">Total</td>
                      <td className="border-l border-t border-black px-2 py-1 text-right">{formatCurrency(totals.taxable)}</td>
                      <td className="border-l border-t border-black px-2 py-1"></td>
                      <td className="border-l border-t border-black px-2 py-1 text-right">{formatCurrency(totals.cgst)}</td>
                      <td className="border-l border-t border-black px-2 py-1"></td>
                      <td className="border-l border-t border-black px-2 py-1 text-right">{formatCurrency(totals.sgst || totals.igst)}</td>
                      <td className="border-l border-t border-black px-2 py-1 text-right">{formatCurrency(totalTax)}</td>
                    </tr>
            </tbody>
          </table>
                <div className="px-3 py-2 text-sm border-t border-black">Tax Amount (in words) :
                  <span className="ml-2 font-bold">INR {numberToWords(Math.round(totalTax))} Only</span>
                </div>
              </div>
            );
          })()}
        </div>
        </div>
        {/* Terms & Conditions - detailed, bordered like sample */}
        <div className=" border-t border-black text-xs">
          <div className="flex justify-between items-center px-3 py-1 border-b">
            <div className="font-semibold">Terms & Conditions</div>
            <div className="font-semibold">(E.&O.E.)</div>
          </div>
          {/* <div className='grid grid-cols-2'> */}
          <div className="px-3  py-2 leading-5">
            <div>1 : Goods/Services once sold will not be taken back or exchanged.</div>
            <div>2 : All disputes are subject to Deoria jurisdiction only.</div>
            <div>3 : Warranty/Guarantee of products lies with the manufacturer only.</div>
            <div>4 : Kindly check goods at the time of delivery; no claims will be entertained afterwards.</div>
            <div>5 : Payment to be made only in company&apos;s account.</div>
        </div>
            {/* <div></div> */}
          {/* </div> */}
          
        </div>
        {/* Signature and Bank Details - placed immediately after Terms (no gap) */}
         <div className=" border-t border-b border-black grid grid-cols-[1fr_2fr_1fr] text-sm">
          <div className="border-r border-black p-3">
            <div className="font-semibold mb-1">Customer&apos;s Seal and Signature</div>
          </div>
           <div className="border-r border-black p-3 bg-yellow-50/50">
             <div className="font-semibold mb-2">Company’s Bank Details</div>
             <div className="grid grid-cols-[160px_10px_1fr] gap-y-1">
               <div className="text-gray-700">Bank Name</div><div>:</div><div className="font-semibold">{bank?.bankName || '-'}</div>
               <div className="text-gray-700">A/c&apos;s Holder Name</div><div>:</div><div className="font-semibold">{bank?.accountHolder || bill.shopName || '-'}</div>
               <div className="text-gray-700">A/c No.</div><div>:</div><div className="font-semibold">{bank?.accountNumber || '-'}</div>
               <div className="text-gray-700">Branch & IFSC Code</div><div>:</div><div className="font-semibold">{bank?.branch || ''}{bank?.branch && bank?.ifsc ? ' & ' : ''}{bank?.ifsc || ''}</div>
               <div className="text-gray-700">Phonepay/GPay No</div><div>:</div><div className="font-semibold">{bank?.upiNumber || bank?.upiPhone || '-'}</div>
               <div className="text-gray-700">Account Name</div><div>:</div><div className="font-semibold">{bank?.accountHolder || '-'}</div>
            </div>
          </div>
          <div className="p-3 flex flex-col text-center justify-between" style={{ minHeight: '140px' }}>
            <div className="font-semibold">for {bill.shopName || '-'}</div>
            <div className="flex items-center justify-center">
              {bill.signatureDataUrl ? (
                <Image src={bill.signatureDataUrl} alt="Signature" width={128} height={64} className="h-16 object-contain" />
              ) : (
                <div className="h-16 w-32 " />
              )}
            </div>
            <div className="font-semibold">Authorised Signatory</div>
          </div>
        </div>

        </div>
        
        
      
       

       

       
      </div>
      ) : (
        <div ref={printRef} className="invoice-sheet">
          <InvoiceTemplateRenderer
            bill={bill}
            templateId={templateId}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            numberToWords={numberToWords}
            pickStateName={pickStateName}
            pickStateCode={pickStateCode}
            pickCustomerStateName={pickCustomerStateName}
            pickCustomerStateCode={pickCustomerStateCode}
            bank={bank}
          />
        </div>
      )}
    </div>
  );
}


