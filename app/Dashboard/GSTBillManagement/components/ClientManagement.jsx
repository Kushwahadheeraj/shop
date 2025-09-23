import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

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

const baseInput = 'w-full h-10 px-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500';
const label = 'block text-sm font-medium text-gray-700 mb-2';

const ClientManagement = ({ onClose, onSelectClient, initialClient, mode = 'add' }) => {
  const [form, setForm] = useState({
    businessName: '',
    industry: '',
    country: 'India',
    city: '',
    stateName: '',
    stateCode: '',
    gstin: '',
    pan: '',
    alias: '',
    uniqueKey: '',
    email: '',
    phone: '',
    showEmailInInvoice: false,
    showPhoneInInvoice: false,
    customFields: []
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  // GSTIN auto-lookup temporarily disabled per request

  const addCustomField = () => {
    set('customFields', [
      ...form.customFields,
      { id: Date.now(), label: '', value: '' }
    ]);
  };

  const updateCustomField = (id, key, value) => {
    set('customFields', form.customFields.map(cf => cf.id === id ? { ...cf, [key]: value } : cf));
  };

  const removeCustomField = (id) => {
    set('customFields', form.customFields.filter(cf => cf.id !== id));
  };

  // Prefill when editing
  React.useEffect(() => {
    if (!initialClient) return;
    setForm(prev => ({
      ...prev,
      businessName: initialClient.name || initialClient.businessName || '',
      country: initialClient.country || 'India',
      city: initialClient.city || '',
      stateName: initialClient.stateName || '',
      stateCode: initialClient.stateCode || '',
      gstin: initialClient.gstin || '',
      pan: initialClient.pan || '',
      alias: initialClient.alias || '',
      uniqueKey: initialClient.uniqueKey || '',
      email: initialClient.email || '',
      phone: initialClient.phone || '',
      showEmailInInvoice: !!initialClient.showEmailInInvoice,
      showPhoneInInvoice: !!initialClient.showPhoneInInvoice,
      customFields: (initialClient.customFields || []).map((x, i) => ({ id: x.id || i + 1, label: x.label || '', value: x.value || '' }))
    }));
  }, [initialClient]);

  // Auto-lookup disabled

  const save = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: form.businessName, country: form.country, city: form.city, stateName: form.stateName, stateCode: form.stateCode, gstin: form.gstin, pan: form.pan, alias: form.alias, email: form.email, phone: form.phone })
    });
    onSelectClient({ name: form.businessName, address: '', country: form.country, city: form.city });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{mode === 'edit' ? 'Edit Client' : 'Add New Client'}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>

        <form className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={label}>Business Name*</label>
              <input className={baseInput} value={form.businessName} onChange={e=>set('businessName', e.target.value)} placeholder="Business Name (Required)" />
            </div>
            <div>
              <label className={label}>Client Industry</label>
              <select className={baseInput} value={form.industry} onChange={e=>set('industry', e.target.value)}>
                <option value="">-Select an Industry-</option>
                <option>Apparel & Fashion</option>
                <option>Construction</option>
                <option>Electronics</option>
                <option>Other</option>
            </select>
            </div>
            <div>
              <label className={label}>Select Country*</label>
              <select className={baseInput} value={form.country} onChange={e=>set('country', e.target.value)}>
                <option>India</option>
              </select>
            </div>
            <div>
              <label className={label}>City/Town</label>
              <input className={baseInput} value={form.city} onChange={e=>set('city', e.target.value)} placeholder="City/Town Name" />
          </div>
        </div>

          {/* Collapsible placeholders matching screenshot order */}
          <div className="space-y-6">
            <details className="group" open>
              <summary className="cursor-pointer text-gray-900 font-medium flex items-center justify-between">Tax Information <span className="text-gray-400 text-sm">(optional)</span></summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                  <label className={label}>Business GSTIN</label>
                  <div className="flex gap-2">
                    <input className={baseInput + ' flex-1'} value={form.gstin} maxLength={15} onChange={(e)=>set('gstin', (e.target.value || '').toUpperCase())} placeholder="Business GSTIN (Optional)" />
                    <button type="button" onClick={async()=>{
                      try{
                        const r = await fetch('/api/gstin-lookup', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ gstin: form.gstin })});
                        const d = await r.json();
                        const n = d?.normalized || {};
                        if(n.name){ set('businessName', n.name); }
                        if(n.pan){ set('pan', n.pan); }
                        if(n.stateName){ set('stateName', n.stateName); const f = GST_STATE_CODES.find(s=>s.name===n.stateName); set('stateCode', f?f.code:(n.stateCode||'')); }
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
                  <input className={baseInput} placeholder="Business PAN Number (Optional)" />
                      </div>
                    </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                <div className="flex items-center space-x-8">
                  <label className="flex items-center space-x-2 text-gray-800 text-sm">
                    <input type="radio" name="ctype" defaultChecked className="text-purple-600 focus:ring-purple-500" />
                    <span>Individual</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-800 text-sm">
                    <input type="radio" name="ctype" className="text-purple-600 focus:ring-purple-500" />
                    <span>Company</span>
                  </label>
                    </div>
                  </div>
              <div className="mt-6">
                <label className={label}>Tax Treatment</label>
                <select className={baseInput} defaultValue="">
                  <option value="">Select Tax Treatment</option>
                  <option>Registered Business - Regular</option>
                  <option>Registered Business - Composition</option>
                  <option>Unregistered Business</option>
                  <option>Consumer</option>
                  <option>Overseas</option>
                  <option>Special Economic Zone</option>
                </select>
                    </div>
            </details>

            <details className="group" open>
              <summary className="cursor-pointer text-gray-900 font-medium flex items-center justify-between">Address <span className="text-gray-400 text-sm">(optional)</span></summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                  <label className={label}>Select Country</label>
                  <select className={baseInput} value={form.country} onChange={(e)=>set('country', e.target.value)}>
                    <option>India</option>
                  </select>
                      </div>
                      <div>
                  <label className={label}>State Name</label>
                  <select className={baseInput} value={form.stateName} onChange={(e)=>{const n=e.target.value; const f=GST_STATE_CODES.find(s=>s.name===n); set('stateName', n); set('stateCode', f?f.code:'');}}>
                    <option value="">Select State</option>
                    {GST_STATE_CODES.map(s=> <option key={s.code} value={s.name}>{s.name}</option>)}
                  </select>
                      </div>
                  <div>
                  <label className={label}>State GST Code</label>
                  <input className={baseInput + ' bg-gray-50'} value={form.stateCode || ''} readOnly placeholder="" />
                    </div>
                  <div>
                  <label className={label}>City/Town</label>
                  <input className={baseInput} value={form.city} onChange={(e)=>set('city', e.target.value)} placeholder="City/Town Name" />
                      </div>
                  <div>
                  <label className={label}>Postal Code / Zip Code</label>
                  <input className={baseInput} value={form.pincode || ''} onChange={(e)=>set('pincode', e.target.value)} placeholder="Postal Code / Zip Code" />
                  </div>
                <div className="md:col-span-2">
                  <label className={label}>Street Address</label>
                  <input className={baseInput} value={form.street || ''} onChange={(e)=>set('street', e.target.value)} placeholder="Street Address" />
                </div>
              </div>
            </details>

            <details className="group" open>
              <summary className="cursor-pointer text-gray-900 font-medium flex items-center justify-between">Additional Details <span className="text-gray-400 text-sm">(optional)</span></summary>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                  <label className={label}>Business Alias (Nick Name)</label>
                  <input className={baseInput} value={form.alias} onChange={(e)=>set('alias', e.target.value)} placeholder="Business Alias" />
                  </div>
                  <div>
                  <label className={label}>Unique Key</label>
                  <input className={baseInput} value={form.uniqueKey} onChange={(e)=>set('uniqueKey', e.target.value)} placeholder="Unique Key" />
                  </div>
                  <div>
                  <label className={label}>Email</label>
                  <input className={baseInput} value={form.email} onChange={(e)=>set('email', e.target.value)} placeholder="Email" />
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
                    <input className={baseInput + ' flex-1'} value={form.phone} onChange={(e)=>set('phone', e.target.value)} placeholder="+91" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Add to directly WhatsApp documents from Refrens</p>
                  <label className="mt-2 inline-flex items-center space-x-2 text-sm text-gray-700">
                    <input type="checkbox" checked={form.showPhoneInInvoice} onChange={(e)=>set('showPhoneInInvoice', e.target.checked)} />
                    <span>Show Phone in Invoice</span>
                    </label>
                  </div>
                  </div>
              <div className="mt-4 space-y-3">
                {form.customFields.map(cf => (
                  <div key={cf.id} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <input
                      className={baseInput}
                      placeholder="Field Label"
                      value={cf.label}
                      onChange={(e)=>updateCustomField(cf.id, 'label', e.target.value)}
                    />
                    <input
                      className={baseInput + ' md:col-span-2'}
                      placeholder="Field Value"
                      value={cf.value}
                      onChange={(e)=>updateCustomField(cf.id, 'value', e.target.value)}
                    />
                    <button type="button" onClick={()=>removeCustomField(cf.id)} className="text-sm text-red-600">Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addCustomField} className="text-sm text-purple-600">+ Add Custom Fields</button>
                  </div>
            </details>

            <details className="group" open>
              <summary className="cursor-pointer text-gray-900 font-medium flex items-center justify-between">Account Details <span className="text-gray-400 text-sm">(optional)</span></summary>
              <div className="mt-4 p-4 rounded-md bg-gray-50 border border-gray-100 text-gray-700 text-sm">
                Enable Advanced Accounting to create or link ledger. <button type="button" className="text-purple-600 hover:underline">Enable Now</button>
                  </div>
            </details>
                </div>

          <div className="flex items-center justify-end space-x-4 pt-2">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="button" onClick={save} className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"><Save className="h-4 w-4" /><span>Save</span></button>
                </div>
              </form>
      </div>
    </div>
  );
};

export default ClientManagement;
