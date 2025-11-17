import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import API_BASE_URL from '@/lib/apiConfig';

const GST_STATE_CODES = [
  { name: 'Jammu & Kashmir', code: '01' },
  { name: 'Himachal Pradesh', code: '02' },
  { name: 'Punjab', code: '03' },
  { name: 'Chandigarh', code: '04' },
  { name: 'Uttarakhand', code: '05' },
  { name: 'Haryana', code: '06' },
  { name: 'Delhi', code: '07' },
  { name: 'Rajasthan', code: '08' },
  { name: 'Uttar Pradesh', code: '09' },
  { name: 'Bihar', code: '10' },
  { name: 'Sikkim', code: '11' },
  { name: 'Arunachal Pradesh', code: '12' },
  { name: 'Nagaland', code: '13' },
  { name: 'Manipur', code: '14' },
  { name: 'Mizoram', code: '15' },
  { name: 'Tripura', code: '16' },
  { name: 'Meghalaya', code: '17' },
  { name: 'Assam', code: '18' },
  { name: 'West Bengal', code: '19' },
  { name: 'Jharkhand', code: '20' },
  { name: 'Odisha', code: '21' },
  { name: 'Chhattisgarh', code: '22' },
  { name: 'Madhya Pradesh', code: '23' },
  { name: 'Gujarat', code: '24' },
  { name: 'Daman & Diu', code: '25' },
  { name: 'Dadra & Nagar Haveli', code: '26' },
  { name: 'Maharashtra', code: '27' },
  { name: 'Andhra Pradesh (Old)', code: '28' },
  { name: 'Karnataka', code: '29' },
  { name: 'Goa', code: '30' },
  { name: 'Lakshadweep', code: '31' },
  { name: 'Kerala', code: '32' },
  { name: 'Tamil Nadu', code: '33' },
  { name: 'Puducherry', code: '34' },
  { name: 'Andaman & Nicobar Islands', code: '35' },
  { name: 'Telangana', code: '36' },
  { name: 'Andhra Pradesh (Newly Added)', code: '37' },
  { name: 'Ladakh (Newly Added)', code: '38' },
  { name: 'Others Territory', code: '97' },
  { name: 'Center Jurisdiction', code: '99' }
];

const baseInput = 'w-full h-10 px-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500';
const label = 'block text-sm font-medium text-gray-700 mb-2';

const ShopFormModal = ({ isOpen, mode = 'add', initialShop, onClose, onSaved }) => {
  const [form, setForm] = useState(() => ({
    name: initialShop?.name || '',
    alias: '',
    gstin: '',
    pan: '',
    country: 'India',
    state: '',
    stateCode: '',
    city: '',
    pincode: '',
    street: '',
    email: '',
    phone: '',
    showEmailInInvoice: false,
    showPhoneInInvoice: false,
    isDefault: false,
    customFields: []
  }));

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  // GSTIN lookup temporarily disabled per request

  const save = async () => {
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: form.name,
        alias: form.alias,
        gstin: form.gstin,
        pan: form.pan,
        country: form.country,
        stateName: form.state,
        stateCode: form.stateCode,
        city: form.city,
        pincode: form.pincode,
        street: form.street,
        email: form.email,
        phone: form.phone,
        showEmailInInvoice: form.showEmailInInvoice,
        showPhoneInInvoice: form.showPhoneInInvoice,
        isDefault: form.isDefault,
        customFields: form.customFields.map(({ label, value }) => ({ label, value }))
      };
      const res = await fetch(mode === 'edit' && initialShop?._id ? `${API_BASE_URL}/gst-shops/${initialShop._id}` : `${API_BASE_URL}/gst-shops`, {
        method: mode === 'edit' && initialShop?._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      onSaved?.(data);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to save business');
    }
  };

  useEffect(() => {
    if (mode === 'edit' && initialShop && isOpen) {
      setForm({
        name: initialShop.name || '',
        alias: initialShop.alias || '',
        gstin: initialShop.gstin || '',
        pan: initialShop.pan || '',
        country: initialShop.country || 'India',
        state: initialShop.stateName || '',
        stateCode: initialShop.stateCode || '',
        city: initialShop.city || '',
        pincode: initialShop.pincode || '',
        street: initialShop.street || '',
        email: initialShop.email || '',
        phone: initialShop.phone || '',
        showEmailInInvoice: !!initialShop.showEmailInInvoice,
        showPhoneInInvoice: !!initialShop.showPhoneInInvoice,
        isDefault: !!initialShop.isDefault,
        customFields: (initialShop.customFields || []).map((x, idx) => ({ id: idx + 1, label: x.label || '', value: x.value || '' }))
      });
    }
  }, [mode, initialShop, isOpen]);

  // Auto-lookup disabled

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Business details</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          <details className="group" open>
            <summary className="cursor-pointer text-gray-900 font-medium">Basic Information</summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Vendor's Business Name*</label>
                <input className={baseInput} value={form.name} onChange={e=>set('name', e.target.value)} placeholder="Vendor's Business Name (Required)" />
              </div>
              <div>
                <label className={label}>Business Alias</label>
                <input className={baseInput} value={form.alias} onChange={e=>set('alias', e.target.value)} placeholder="Alias (Optional)" />
              </div>
            </div>
          </details>

          <details className="group" open>
            <summary className="cursor-pointer text-gray-900 font-medium">Tax Information <span className="text-gray-400 text-sm">(optional)</span></summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Business GSTIN</label>
                <div className="flex gap-2">
                  <input className={baseInput + ' flex-1'} maxLength={15} value={form.gstin} onChange={e=>set('gstin', e.target.value.toUpperCase())} placeholder="Business GSTIN (Optional)" />
                  <button type="button" onClick={async()=>{
                    try{
                      const r = await fetch(`${API_BASE_URL}/gstin-lookup`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ gstin: form.gstin })});
                      const d = await r.json();
                      const n = d?.normalized || {};
                      if(n.name){ set('name', n.name); }
                      if(n.pan){ set('pan', n.pan); }
                      if(n.stateName){ set('state', n.stateName); const f = GST_STATE_CODES.find(s=>s.name===n.stateName); set('stateCode', f?f.code:(n.stateCode||'')); }
                      if(n.city){ set('city', n.city); }
                      if(n.pincode){ set('pincode', String(n.pincode)); }
                      if(n.addressString){ set('street', n.addressString); }
                      alert('GST details fetched');
                    }catch{ alert('GST lookup failed'); }
                  }} className="px-3 min-w-[110px] border border-gray-300 rounded-md text-sm">Check</button>
                </div>
              </div>
              <div>
                <label className={label}>Business PAN Number</label>
                <input className={baseInput} value={form.pan} onChange={e=>set('pan', e.target.value)} placeholder="Business PAN Number (Optional)" />
              </div>
            </div>
          </details>

          <details className="group" open>
            <summary className="cursor-pointer text-gray-900 font-medium">Address <span className="text-gray-400 text-sm">(optional)</span></summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Select Country</label>
                <select className={baseInput} value={form.country} onChange={e=>set('country', e.target.value)}>
                  <option>India</option>
                </select>
              </div>
              <div>
                <label className={label}>State Name</label>
                <select className={baseInput} value={form.state} onChange={e=>{ const n=e.target.value; const f=GST_STATE_CODES.find(s=>s.name===n); set('state', n); set('stateCode', f?f.code:''); }}>
                  <option value="">Select State</option>
                  {GST_STATE_CODES.map(s => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={label}>State GST Code</label>
                <input className={baseInput + ' bg-gray-50'} value={form.stateCode} readOnly />
              </div>
              <div>
                <label className={label}>City/Town</label>
                <input className={baseInput} value={form.city} onChange={e=>set('city', e.target.value)} placeholder="City/Town Name" />
              </div>
              <div>
                <label className={label}>Postal Code / Zip Code</label>
                <input className={baseInput} value={form.pincode} onChange={e=>set('pincode', e.target.value)} placeholder="Postal Code / Zip Code" />
              </div>
              <div className="md:col-span-2">
                <label className={label}>Street Address</label>
                <input className={baseInput} value={form.street} onChange={e=>set('street', e.target.value)} placeholder="Street Address" />
              </div>
            </div>
          </details>

          <details className="group" open>
            <summary className="cursor-pointer text-gray-900 font-medium">Additional Details <span className="text-gray-400 text-sm">(optional)</span></summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={label}>Display Name</label>
                <input className={baseInput} value={form.alias} onChange={e=>set('alias', e.target.value)} placeholder="Business Alias / Display Name" />
              </div>
              <div></div>
              <div>
                <label className={label}>Email</label>
                <input className={baseInput} value={form.email} onChange={e=>set('email', e.target.value)} placeholder="Email" />
                <p className="text-xs text-gray-500 mt-1">Add to directly email documents from Refrens</p>
                <label className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.showEmailInInvoice} onChange={(e)=>set('showEmailInInvoice', e.target.checked)} />
                  <span>Show Email in Invoice</span>
                </label>
              </div>
              <div>
                <label className={label}>Phone No.</label>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md bg-white">🇮🇳</span>
                  <input className={baseInput} value={form.phone} onChange={e=>set('phone', e.target.value)} placeholder="+91" />
                </div>
                <p className="text-xs text-gray-500 mt-1">Add to directly WhatsApp documents from Refrens</p>
                <label className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-700">
                  <input type="checkbox" checked={form.showPhoneInInvoice} onChange={(e)=>set('showPhoneInInvoice', e.target.checked)} />
                  <span>Show Phone in Invoice</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="inline-flex items-center text-sm text-gray-700">
                <input type="checkbox" checked={form.isDefault} onChange={(e)=>set('isDefault', e.target.checked)} className="mr-2" />
                Set as default business (auto-selected in new invoices)
              </label>
            </div>
            <div className="mt-4 space-y-3">
              {form.customFields.map(cf => (
                <div key={cf.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <input className={baseInput} placeholder="Field Label" value={cf.label} onChange={(e)=>set('customFields', form.customFields.map(x=>x.id===cf.id?{...x,label:e.target.value}:x))} />
                  <input className={baseInput + ' md:col-span-2'} placeholder="Field Value" value={cf.value} onChange={(e)=>set('customFields', form.customFields.map(x=>x.id===cf.id?{...x,value:e.target.value}:x))} />
                  <button type="button" onClick={()=>set('customFields', form.customFields.filter(x=>x.id!==cf.id))} className="text-sm text-red-600">Remove</button>
                </div>
              ))}
              <button type="button" onClick={()=>set('customFields', [...form.customFields, { id: Date.now(), label: '', value: '' }])} className="text-sm text-purple-600">+ Add Custom Fields</button>
            </div>
          </details>

          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center text-sm text-gray-700">
              <input type="checkbox" className="mr-2" /> Update changes for Previous and Future documents.
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center text-sm text-gray-700">
              <input type="checkbox" className="mr-2" /> Only update for Future documents
            </label>
          </div>

          <div className="pt-2">
            <button type="button" onClick={save} className="px-6 py-2 bg-purple-600 text-white rounded-md">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopFormModal;


