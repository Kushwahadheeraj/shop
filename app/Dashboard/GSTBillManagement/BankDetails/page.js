"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const baseInput = 'w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500';

export default function BankDetailsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ accountHolder: '', bankName: '', accountNumber: '', ifsc: '', branch: '', isDefault: false });
  const [selectedId, setSelectedId] = useState('');
  const [pendingBill, setPendingBill] = useState(null);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/bank-accounts', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data?.success) setAccounts(data.data || []);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    // Load pending bill from previous step
    try {
      const raw = sessionStorage.getItem('pending_gst_bill');
      if (!raw) {
        router.push('/Dashboard/GSTBillManagement');
        return;
      }
      setPendingBill(JSON.parse(raw));
    } catch {
      router.push('/Dashboard/GSTBillManagement');
      return;
    }
    fetchAccounts();
  }, [router]);

  const saveAccount = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/bank-accounts', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (data?.success) { setForm({ accountHolder: '', bankName: '', accountNumber: '', ifsc: '', branch: '', isDefault: false }); fetchAccounts(); setSelectedId(data.data?._id || ''); }
  };

  const finalizeBill = async () => {
    if (!pendingBill) return;
    const token = localStorage.getItem('token');
    if (!selectedId) {
      alert('Please select a bank account or add one.');
      return;
    }
    const payload = { ...pendingBill, bankAccountId: selectedId };
    const res = await fetch('/api/gst-bills', { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (res.ok && data?.success) {
      sessionStorage.removeItem('pending_gst_bill');
      const billId = data?.data?.gstBill?._id;
      router.push(`/Dashboard/GSTBillManagement/InvoicePreview?billId=${billId}`);
    } else {
      alert(data?.message || 'Failed to save GST bill.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Bank Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-3">Select Existing Account</h2>
          <div className="space-y-3">
            {loading ? (<div>Loading...</div>) : accounts.length === 0 ? (<div className="text-sm text-gray-600">No accounts yet</div>) : accounts.map(acc => (
              <label key={acc._id} className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
                <div className="flex items-center gap-3">
                  <input type="radio" name="bank" checked={selectedId===acc._id} onChange={()=>setSelectedId(acc._id)} />
                  <div>
                    <div className="font-medium">{acc.accountHolder} • {acc.bankName}</div>
                    <div className="text-xs text-gray-600">{acc.accountNumber} • {acc.ifsc} • {acc.branch}</div>
                  </div>
                </div>
                {acc.isDefault ? <span className="text-xs text-purple-600">Default</span> : null}
              </label>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-3">Add New Account</h2>
          <div className="space-y-3">
            <input className={baseInput} placeholder="Account Holder" value={form.accountHolder} onChange={(e)=>setForm({ ...form, accountHolder: e.target.value })} />
            <input className={baseInput} placeholder="Bank Name" value={form.bankName} onChange={(e)=>setForm({ ...form, bankName: e.target.value })} />
            <input className={baseInput} placeholder="Account Number" value={form.accountNumber} onChange={(e)=>setForm({ ...form, accountNumber: e.target.value })} />
            <input className={baseInput} placeholder="IFSC" value={form.ifsc} onChange={(e)=>setForm({ ...form, ifsc: e.target.value.toUpperCase() })} />
            <input className={baseInput} placeholder="Branch" value={form.branch} onChange={(e)=>setForm({ ...form, branch: e.target.value })} />
            <label className="inline-flex items-center text-sm"><input type="checkbox" checked={form.isDefault} onChange={(e)=>setForm({ ...form, isDefault: e.target.checked })} className="mr-2" /> Set as default</label>
            <button type="button" onClick={saveAccount} className="px-4 py-2 bg-purple-600 text-white rounded-md">Save Account</button>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={finalizeBill} className="px-6 py-2 bg-green-600 text-white rounded-md">Save & Continue</button>
      </div>
    </div>
  );
}


