"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Trash2, MessageCircle, X, Edit, Calendar, DollarSign, CreditCard, Receipt } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const BalanceManagementPage = () => {
  const router = useRouter();
  const { isAuthenticated, isSeller, loading: authLoading } = useAuth();
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [showCreditForm, setShowCreditForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expandedPerson, setExpandedPerson] = useState(null);

  // Form states
  const [personForm, setPersonForm] = useState({ name: '', phone: '', address: '' });
  const [creditForm, setCreditForm] = useState({ amount: '', description: '', entryDate: new Date().toISOString().split('T')[0] });
  const [paymentForm, setPaymentForm] = useState({ amount: '', paymentDate: new Date().toISOString().split('T')[0], notes: '' });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isSeller)) {
      router.push('/login/seller');
    }
  }, [isAuthenticated, isSeller, authLoading, router]);

  const fetchBalanceEntries = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/balance-entries?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setPersons(data.data.persons || []);
        }
      }
    } catch (error) {
      console.error('Error fetching balance entries:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (isAuthenticated && isSeller) {
      fetchBalanceEntries();
    }
  }, [isAuthenticated, isSeller, fetchBalanceEntries]);

  const handleAddPerson = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      // Create a credit entry with person details (amount 0.01 for initial entry to avoid 0)
      // This will be filtered out in display but allows person creation
      const response = await fetch('/api/balance-entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: personForm.name,
          phone: personForm.phone,
          address: personForm.address,
          entryType: 'credit',
          amount: 0.01, // Small amount to create person, will be adjusted with first real entry
          description: 'Person added to system',
          entryDate: new Date().toISOString()
        })
      });

      if (response.ok) {
        setShowAddPersonForm(false);
        setPersonForm({ name: '', phone: '', address: '' });
        fetchBalanceEntries();
      } else {
        const data = await response.json();
        alert(data.message || 'Error adding person');
      }
    } catch (error) {
      console.error('Error adding person:', error);
      alert('Error adding person');
    }
  };

  const handleAddCredit = async (e) => {
    e.preventDefault();
    if (!selectedPerson) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/balance-entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedPerson.name,
          phone: selectedPerson.phone,
          address: selectedPerson.address,
          entryType: 'credit',
          amount: parseFloat(creditForm.amount),
          description: creditForm.description,
          entryDate: creditForm.entryDate ? new Date(creditForm.entryDate).toISOString() : new Date().toISOString()
        })
      });

      if (response.ok) {
        setShowCreditForm(false);
        setCreditForm({ amount: '', description: '', entryDate: new Date().toISOString().split('T')[0] });
        setSelectedPerson(null);
        fetchBalanceEntries();
      }
    } catch (error) {
      console.error('Error adding credit:', error);
      alert('Error adding credit entry');
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    if (!selectedPerson) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/balance-entries', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: selectedPerson.name,
          phone: selectedPerson.phone,
          address: selectedPerson.address,
          entryType: 'payment',
          amount: parseFloat(paymentForm.amount),
          paymentDate: paymentForm.paymentDate ? new Date(paymentForm.paymentDate).toISOString() : new Date().toISOString(),
          notes: paymentForm.notes
        })
      });

      if (response.ok) {
        setShowPaymentForm(false);
        setPaymentForm({ amount: '', paymentDate: new Date().toISOString().split('T')[0], notes: '' });
        setSelectedPerson(null);
        fetchBalanceEntries();
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Error adding payment entry');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!confirm('क्या आप इस entry को delete करना चाहते हैं?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/balance-entries/${entryId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchBalanceEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Error deleting entry');
    }
  };

  const handleDeletePerson = async (phone) => {
    if (!confirm('क्या आप इस व्यक्ति की सभी entries delete करना चाहते हैं? यह action undo नहीं हो सकता।')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/balance-entries/person/${encodeURIComponent(phone)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchBalanceEntries();
      }
    } catch (error) {
      console.error('Error deleting person:', error);
      alert('Error deleting person entries');
    }
  };

  const sendWhatsAppMessage = (person) => {
    const remainingBalance = person.remainingBalance;
    const shopDetails = 'कुशवाहा हार्डवेयर एंव ट्रंक हाउस, नवलपुर चौराहा, सलेमपुर रोड, 7398222573';
    const message = `नमस्ते ${person.name},\n\nआपका बाकी बैलेंस ₹${remainingBalance.toLocaleString('en-IN')} है। कृपया जल्द से जल्द भुगतान करें।\n\n${shopDetails}\n\nधन्यवाद!`;
    const phoneNumber = person.phone.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Balance Management</h1>
              <p className="text-gray-600 mt-1">बाकी राशि प्रबंधन - Credit और Payment entries manage करें</p>
            </div>
            <button
              onClick={() => setShowAddPersonForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              नया व्यक्ति जोड़ें
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="नाम या नंबर से खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">कुल व्यक्ति</div>
              <div className="text-2xl font-bold text-blue-600">{persons.length}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">कुल Credit</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(persons.reduce((sum, p) => sum + p.totalCredit, 0))}
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">कुल बाकी</div>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(persons.reduce((sum, p) => sum + p.remainingBalance, 0))}
              </div>
            </div>
          </div>
        </div>

        {/* Persons List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : persons.length === 0 ? (
            <div className="p-8 text-center text-gray-500">कोई entries नहीं मिलीं</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {persons.map((person, index) => (
                <div key={person.phone} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{person.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          person.remainingBalance > 0 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {person.remainingBalance > 0 
                            ? `बाकी: ${formatCurrency(person.remainingBalance)}` 
                            : 'सभी भुगतान हो गया'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>📞 {person.phone}</p>
                        {person.address && <p>📍 {person.address}</p>}
                        <div className="flex gap-4 mt-2">
                          <span>Credit: {formatCurrency(person.totalCredit)}</span>
                          <span>Payment: {formatCurrency(person.totalPayment)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPerson(person);
                          setShowCreditForm(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        <CreditCard className="w-4 h-4" />
                        Credit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPerson(person);
                          setShowPaymentForm(true);
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                      >
                        <Receipt className="w-4 h-4" />
                        Payment
                      </button>
                      <button
                        onClick={() => sendWhatsAppMessage(person)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                      {person.remainingBalance <= 0 && (
                        <button
                          onClick={() => handleDeletePerson(person.phone)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedPerson(expandedPerson === person.phone ? null : person.phone)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        {expandedPerson === person.phone ? 'Hide' : 'Show'} Entries
                      </button>
                    </div>
                  </div>

                  {/* Entries Table */}
                  {expandedPerson === person.phone && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Type</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Payment Date</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {person.entries
                            .filter(entry => entry.amount > 0 || entry.description !== 'Person added to system') // Filter out initial 0.01 entry
                            .map((entry) => (
                            <tr key={entry._id || entry.id} className="border-b">
                              <td className="px-4 py-2">{formatDate(entry.entryDate)}</td>
                              <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  entry.entryType === 'credit' 
                                    ? 'bg-orange-100 text-orange-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {entry.entryType === 'credit' ? 'Credit' : 'Payment'}
                                </span>
                              </td>
                              <td className="px-4 py-2 font-semibold">{formatCurrency(entry.amount)}</td>
                              <td className="px-4 py-2">{entry.description || '-'}</td>
                              <td className="px-4 py-2">{entry.paymentDate ? formatDate(entry.paymentDate) : '-'}</td>
                              <td className="px-4 py-2">
                                <button
                                  onClick={() => handleDeleteEntry(entry._id || entry.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Person Modal */}
      {showAddPersonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">नया व्यक्ति जोड़ें</h2>
              <button onClick={() => setShowAddPersonForm(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPerson}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">नाम *</label>
                  <input
                    type="text"
                    required
                    value={personForm.name}
                    onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">नंबर *</label>
                  <input
                    type="tel"
                    required
                    value={personForm.phone}
                    onChange={(e) => setPersonForm({ ...personForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">पता</label>
                  <textarea
                    value={personForm.address}
                    onChange={(e) => setPersonForm({ ...personForm, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  जोड़ें
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPersonForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Credit Modal */}
      {showCreditForm && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Credit Entry - {selectedPerson.name}</h2>
              <button onClick={() => {
                setShowCreditForm(false);
                setSelectedPerson(null);
              }}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddCredit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">राशि *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={creditForm.amount}
                    onChange={(e) => setCreditForm({ ...creditForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">विवरण (क्या लेकर गया)</label>
                  <textarea
                    value={creditForm.description}
                    onChange={(e) => setCreditForm({ ...creditForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                    placeholder="उदाहरण: 10 kg सीमेंट, 5 पेंट बाल्टी, आदि"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">तारीख</label>
                  <input
                    type="date"
                    value={creditForm.entryDate}
                    onChange={(e) => setCreditForm({ ...creditForm, entryDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Add Credit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreditForm(false);
                    setSelectedPerson(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showPaymentForm && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Payment Entry - {selectedPerson.name}</h2>
              <button onClick={() => {
                setShowPaymentForm(false);
                setSelectedPerson(null);
              }}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddPayment}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">राशि *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">भुगतान की तारीख *</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.paymentDate}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">नोट्स</label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Add Payment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedPerson(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceManagementPage;

