"use client";
import React, { useEffect, useState } from 'react';
import { X, Edit, Trash2, Plus, Users, Building2, Search } from 'lucide-react';
import ClientManagement from './ClientManagement';
import ShopFormModal from './ShopFormModal';
import API_BASE_URL from '@/lib/apiConfig';

const baseBtn = "px-3 py-2 text-sm sm:text-base border rounded hover:bg-gray-50";

export default function ContactsManager({ isOpen, onClose }) {
  const [tab, setTab] = useState('clients'); // 'clients' | 'shops'
  const [clients, setClients] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [editingShop, setEditingShop] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [rc, rs] = await Promise.all([
          fetch(`${API_BASE_URL}/clients`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/gst-shops`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        const dc = await rc.json();
        const ds = await rs.json();
        setClients(dc?.data?.clients || dc?.data || dc || []);
        setShops(ds?.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen]);

  const refreshClients = async () => {
    const token = localStorage.getItem('token');
    const r = await fetch(`${API_BASE_URL}/clients`, { headers: { 'Authorization': `Bearer ${token}` } });
    const d = await r.json();
    setClients(d?.data?.clients || d?.data || d || []);
  };

  const refreshShops = async () => {
    const token = localStorage.getItem('token');
    const r = await fetch(`${API_BASE_URL}/gst-shops`, { headers: { 'Authorization': `Bearer ${token}` } });
    const d = await r.json();
    setShops(d?.data || []);
  };

  const deleteClient = async (id) => {
    if (!confirm('Delete this client?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete client');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, { 
        method: 'DELETE', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `Failed to delete client. Status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data?.success) {
        await refreshClients();
        // Success message (optional)
        // alert('Client deleted successfully');
      } else {
        alert(data?.message || 'Failed to delete client');
      }
    } catch (error) {
            alert(error?.message || 'Error deleting client. Please try again.');
    }
  };

  const deleteShop = async (id) => {
    if (!confirm('Delete this shop?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to delete shop');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/gst-shops/${id}`, { 
        method: 'DELETE', 
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || `Failed to delete shop. Status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data?.success) {
        await refreshShops();
        // Success message (optional)
        // alert('Shop deleted successfully');
      } else {
        alert(data?.message || 'Failed to delete shop');
      }
    } catch (error) {
            alert(error?.message || 'Error deleting shop. Please try again.');
    }
  };

  const filteredClients = clients.filter(c => {
    const q = query.toLowerCase();
    return !q || (c.name || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q) || (c.phone || '').toLowerCase().includes(q);
  });
  const filteredShops = shops.filter(s => {
    const q = query.toLowerCase();
    return !q || (s.name || '').toLowerCase().includes(q) || (s.email || '').toLowerCase().includes(q) || (s.phone || '').toLowerCase().includes(q);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-6xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button className={`${baseBtn} ${tab==='clients'?'bg-purple-50 border-purple-300 text-purple-700':''}`} onClick={()=>setTab('clients')}>
              <Users className="w-4 h-4 inline mr-1"/> Clients ({clients.length})
            </button>
            <button className={`${baseBtn} ${tab==='shops'?'bg-purple-50 border-purple-300 text-purple-700':''}`} onClick={()=>setTab('shops')}>
              <Building2 className="w-4 h-4 inline mr-1"/> Shops ({shops.length})
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2"/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search..." className="w-full pl-7 pr-2 py-2 text-sm border rounded"/>
            </div>
            {tab==='clients' ? (
              <button className="px-3 py-2 text-sm sm:text-base bg-green-600 text-white rounded flex items-center justify-center gap-2" onClick={()=>{ setEditingClient(null); setShowClientModal(true); }}>
                <Plus className="w-4 h-4"/> Add Client
              </button>
            ) : (
              <button className="px-3 py-2 text-sm sm:text-base bg-green-600 text-white rounded flex items-center justify-center gap-2" onClick={()=>{ setEditingShop({}); setShowShopModal(true); }}>
                <Plus className="w-4 h-4"/> Add Shop
              </button>
            )}
            <button className="p-2" onClick={onClose}><X className="w-5 h-5"/></button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="py-12 text-center text-gray-600">Loading...</div>
          ) : tab==='clients' ? (
            <div className="overflow-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">GSTIN</th>
                    <th className="text-left p-2">State</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => (
                    <tr key={c._id} className="border-b">
                      <td className="p-2">{c.name}</td>
                      <td className="p-2">{c.email}</td>
                      <td className="p-2">{c.phone}</td>
                      <td className="p-2">{c.gstin}</td>
                      <td className="p-2">{c.stateName} {c.stateCode ? `(${c.stateCode})` : ''}</td>
                      <td className="p-2 text-right">
                        <button className="text-green-600 mr-2" onClick={()=>{ setEditingClient(c); setShowClientModal(true); }}><Edit className="inline w-4 h-4"/></button>
                        <button className="text-red-600" onClick={()=>deleteClient(c._id)}><Trash2 className="inline w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Phone</th>
                    <th className="text-left p-2">State</th>
                    <th className="text-right p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShops.map(s => (
                    <tr key={s._id} className="border-b">
                      <td className="p-2">{s.name}</td>
                      <td className="p-2">{s.email}</td>
                      <td className="p-2">{s.phone}</td>
                      <td className="p-2">{s.stateName} {s.stateCode ? `(${s.stateCode})` : ''}</td>
                      <td className="p-2 text-right">
                        <button className="text-green-600 mr-2" onClick={()=>{ setEditingShop(s); setShowShopModal(true); }}><Edit className="inline w-4 h-4"/></button>
                        <button className="text-red-600" onClick={()=>deleteShop(s._id)}><Trash2 className="inline w-4 h-4"/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showClientModal && (
          <ClientManagement
            mode={editingClient ? 'edit' : 'add'}
            initialClient={editingClient || null}
            onClose={()=>{ setShowClientModal(false); setEditingClient(null); refreshClients(); }}
            onSelectClient={()=>{ setShowClientModal(false); setEditingClient(null); refreshClients(); }}
          />
        )}

        {showShopModal && (
          <ShopFormModal
            isOpen={showShopModal}
            mode={editingShop && editingShop._id ? 'edit' : 'add'}
            initialShop={editingShop && editingShop._id ? editingShop : undefined}
            onClose={()=>{ setShowShopModal(false); setEditingShop(null); }}
            onSaved={()=>{ setShowShopModal(false); setEditingShop(null); refreshShops(); }}
          />
        )}
      </div>
    </div>
  );
}


