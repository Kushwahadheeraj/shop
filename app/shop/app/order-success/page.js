"use client";

import { useState, useEffect } from 'react';
import API_BASE_URL from "@/lib/apiConfig";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [deliveryDate, setDeliveryDate] = useState('');
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    // Calculate delivery date (3 days from now)
    const today = new Date();
    const delivery = new Date(today);
    delivery.setDate(today.getDate() + 3);
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setDeliveryDate(delivery.toLocaleDateString('en-US', options));
  }, []);

  useEffect(() => {
    // Create order immediately after successful payment using pending payload
    const postOrder = async () => {
      if (posted) return;
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('pending_order_payload') : null;
        if (!raw) return;
        const payload = JSON.parse(raw);
        if (!payload?.userId || !payload?.address || !Array.isArray(payload?.items)) return;
        if (!payload?.paymentMethod) payload.paymentMethod = 'prepaid';
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          setPosted(true);
          try { localStorage.removeItem('pending_order_payload'); } catch {}
          // Optional: dispatch event so dashboards can refresh
          try { window.dispatchEvent(new Event('orders-updated')); } catch {}
        }
      } catch {}
    };
    postOrder();
  }, [posted]);

  return (
    <div className="min-h-screen mt-32 sm:mt-36 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-3 sm:px-4 py-6">
      <div className="relative max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 text-center relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          
          {/* Confetti Animation */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-12 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
          <div className="absolute top-6 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-300"></div>
          
          {/* Success Icon */}
          <div className="relative mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            {/* Decorative Circles */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-200 rounded-full animate-ping delay-500"></div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
            Thank You!
          </h1>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-green-600 mb-4 sm:mb-6">
            Order Successful
          </h2>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-lg font-semibold text-gray-700">
                Expected Delivery
              </span>
            </div>
            <p className="text-lg sm:text-2xl font-bold text-blue-600 mb-1 sm:mb-2">
              {deliveryDate}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              We&apos;ll send you a confirmation email shortly
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
            <div className="w-6 sm:w-8 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
            <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>

          {/* Continue Shopping Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              href="/"
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-center"
            >
              {/* Button Decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Continue Shopping
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>

            {/* Back to Home Arrow */}
            <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors duration-300 text-sm">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-300">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-medium">Back to Home</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-500 mb-2">
              Need help? Contact our support team
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-xs sm:text-sm">
              <a href="tel:+918299301972" className="text-blue-600 hover:text-blue-800 font-medium text-center">
                📞 +91 82993 01972
              </a>
              <a href="mailto:kushwahahardware02@gmail.com" className="text-blue-600 hover:text-blue-800 font-medium text-center">
                ✉️ kushwahahardware02@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="pointer-events-none absolute -top-2 sm:top-4 left-4 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full animate-bounce delay-1000"></div>
        <div className="pointer-events-none absolute top-10 sm:top-16 right-6 sm:right-10 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-pink-300 rounded-full animate-bounce delay-2000"></div>
        <div className="pointer-events-none absolute bottom-10 sm:bottom-20 left-6 sm:left-16 w-4 h-4 sm:w-5 sm:h-5 bg-blue-300 rounded-full animate-bounce delay-3000"></div>
        <div className="pointer-events-none absolute bottom-16 sm:bottom-28 right-4 sm:right-10 w-2 h-2 bg-green-300 rounded-full animate-bounce delay-4000"></div>
      </div>
    </div>
  );
}
