"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';

export default function PaymentPage() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pending, setPending] = useState(null);

  // Load canonical totals from pending payload
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('pending_order_payload') : null;
      if (raw) {
        const payload = JSON.parse(raw);
        setPending(payload);
      }
    } catch {}
  }, []);

  const fallbackSubtotal = items.reduce((sum, item) => sum + (Number(item.price || item.salePrice || 0) * (item.quantity || 1)), 0);
  const subtotal = pending?.totals?.subtotal ?? fallbackSubtotal;
  const platformFee = pending?.totals?.platformFee ?? 7;
  const shipping = pending?.totals?.shipping ?? 0;
  const discount = pending?.coupon?.discount ?? 0;
  const totalAmount = pending?.totals?.grandTotal ?? Math.max(0, fallbackSubtotal + platformFee + shipping - discount);

  const currency = (amount) => `₹${amount.toLocaleString()}`;

  const paymentMethods = [
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'Pay by any UPI app',
      icon: 'UPI',
      offers: 'Save upto ₹50 • 5 offers available',
      iconComponent: (
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          <span className="text-blue-600 font-bold text-xs">UPI</span>
        </div>
      )
    },
    {
      id: 'card',
      title: 'Credit / Debit / ATM Card',
      subtitle: 'Add and secure cards as per RBI guidelines',
      offers: 'Save upto ₹1,600 • 4 offers available',
      iconComponent: (
        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
          </svg>
        </div>
      )
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      iconComponent: (
        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 01-1-1V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
          </svg>
        </div>
      )
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      iconComponent: (
        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
          </svg>
        </div>
      )
    },
  ];

  const handleVerify = async () => {
    if (!upiId.trim()) {
      alert('Please enter a valid UPI ID');
      return;
    }
    
    setIsVerifying(true);
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      alert('UPI ID verified successfully!');
    }, 2000);
  };

  const handlePayment = () => {
    // Simulate payment processing
    clear();
    router.push('/order-success');
  };

  return (
    <div className="min-h-screen mt-36 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Complete Payment</h1>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium">100% Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Payment Methods */}
          <div className="lg:col-span-1">
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'bg-gray-50 border-gray-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {method.iconComponent}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      {method.subtitle && (
                        <p className="text-sm text-gray-600 mt-1">{method.subtitle}</p>
                      )}
                      {method.offers && (
                        <p className="text-sm text-green-600 mt-1 font-medium">{method.offers}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Panel - Payment Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6">
              {selectedPaymentMethod === 'upi' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Add new UPI ID</h3>
                    <button className="text-blue-600 text-sm hover:underline">
                      How to find?
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="Enter your UPI ID"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleVerify}
                          disabled={isVerifying}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'card' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Add Card Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'netbanking' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Select Bank</h3>
                  
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {/* State Bank of India */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="sbi"
                          className="w-4 h-4 text-blue-600"
                          defaultChecked
                        />
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">SBI</span>
                        </div>
                        <span className="font-medium">State Bank of India</span>
                      </div>
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                      </svg>
                    </div>

                    {/* HDFC Bank */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="hdfc"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-red-600 font-bold text-xs">HDFC</span>
                        </div>
                        <span className="font-medium">HDFC Bank</span>
                      </div>
                      <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">H</span>
                      </div>
                    </div>

                    {/* ICICI Bank */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="icici"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xs">ICICI</span>
                        </div>
                        <span className="font-medium">ICICI Bank</span>
                      </div>
                      <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">I</span>
                      </div>
                    </div>

                    {/* Kotak Mahindra Bank */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="kotak"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">K</span>
                        </div>
                        <span className="font-medium">Kotak Mahindra Bank</span>
                      </div>
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">∞</span>
                      </div>
                    </div>

                    {/* Axis Bank */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="axis"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                          <span className="text-red-600 font-bold text-xs">A</span>
                        </div>
                        <span className="font-medium">Axis Bank</span>
                      </div>
                      <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">A</span>
                      </div>
                    </div>

                    {/* Federal Bank */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="federal"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">F</span>
                        </div>
                        <span className="font-medium">Federal Bank</span>
                      </div>
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">F</span>
                      </div>
                    </div>

                    {/* Indian Overseas Bank */}
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="bank"
                          value="iob"
                          className="w-4 h-4 text-blue-600"
                        />
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">IOB</span>
                        </div>
                        <span className="font-medium">Indian Overseas Bank</span>
                      </div>
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">IOB</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'cod' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Cash on Delivery</h3>
                  <p className="text-gray-600">
                    Pay with cash when your order is delivered. Please keep exact change ready.
                  </p>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                className="w-full mt-8 bg-gray-600 text-white py-3 px-4 rounded-md font-semibold text-lg hover:bg-gray-700"
              >
                Pay {currency(totalAmount)}
              </button>
            </div>
          </div>

          {/* Right Panel - Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border-l-4 border-yellow-300 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PRICE DETAILS</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span>Price ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-semibold">{currency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Coupon Discount</span>
                    <span className="font-semibold text-green-600">- {currency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">{currency(shipping)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Platform Fee</span>
                  <span className="font-semibold">{currency(platformFee)}</span>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-3">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Amount</span>
                    <span className="text-blue-600">{currency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Discount Section */}
              <div className="mt-6 bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-green-600">10% instant discount</p>
                    <p className="text-sm text-green-600">Claim now with payment offers</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 ml-1">+3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
