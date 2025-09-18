import AppStore from '@/public/appstore.png';
import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="bg-black text-white pt-10 pb-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 border-b border-gray-700 pb-8">
          {/* MY ACCOUNT */}
          <div>
            <h3 className="font-bold mb-2 tracking-wide">MY ACCOUNT</h3>
            <div className="w-8 border-b-2 border-gray-400 mb-2"></div>
            <ul className="space-y-1 text-sm">
              <li>- Cart</li>
              <li>- Checkout</li>
              <li>- My Account</li>
              <li>- Payment Options</li>
              <li>- Forget Password</li>
            </ul>
          </div>
          {/* INFORMATION */}
          <div>
            <h3 className="font-bold mb-2 tracking-wide">INFORMATION</h3>
            <div className="w-8 border-b-2 border-gray-400 mb-2"></div>
            <ul className="space-y-1 text-sm">
              <li>- Track Your Order</li>
              <li>- How It Works</li>
              <li>- Gallery</li>
              <li>- COVID-19 FAQ</li>
            </ul>
          </div>
          {/* WHY CHOOSE US */}
          <div>
            <h3 className="font-bold mb-2 tracking-wide">WHY CHOOSE US</h3>
            <div className="w-8 border-b-2 border-gray-400 mb-2"></div>
            <ul className="space-y-1 text-sm">
              <li>- Support</li>
              <li>- About US</li>
              <li>- Contact Us</li>
              <li>- Reseller Program</li>
            </ul>
          </div>
          {/* POLICIES */}
          <div>
            <h3 className="font-bold mb-2 tracking-wide">POLICIES</h3>
            <div className="w-8 border-b-2 border-gray-400 mb-2"></div>
            <ul className="space-y-1 text-sm">
              <li>- Privacy policy</li>
              <li>- Terms & conditions</li>
              <li>- Return And Refund Policy</li>
            </ul>
          </div>
          {/* DOWNLOAD OUR APP */}
          <div>
            <h3 className="font-bold mb-2 tracking-wide">DOWNLOAD OUR APP</h3>
            <div className="w-8 border-b-2 border-gray-400 mb-2"></div>
            <div className="flex flex-col gap-2 mt-2">
              <Image src={AppStore} alt="App Store" className="w-32" />
              {/* Google Play Button */}
              {/* <div className="bg-black border border-gray-600 rounded-lg px-3 py-2 flex items-center gap-2 w-32">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="#4CAF50"/>
                </svg>
                <div className="text-white text-xs">
                  <div className="font-bold">ANDROID APP ON</div>
                  <div className="text-gray-300">Google play</div>
                </div>
              </div> */}
            </div>
          </div>
          {/* CONNECT WITH US */}
          <div>
            <h3 className="font-bold mb-2 tracking-wide">CONNECT WITH US</h3>
            <div className="w-8 border-b-2 border-gray-400 mb-2"></div>
            <ul className="space-y-1 text-sm">
              <li>- <a href="#" className="hover:underline text-blue-400">Facebook</a></li>
              <li>- <a href="#" className="hover:underline text-pink-400">Instagram</a></li>
              <li>- <a href="#" className="hover:underline text-blue-300">Twitter</a></li>
            </ul>
          </div>
        </div>
        {/* Bottom Section - Copyright and Payment Methods */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 pt-6 border-gray-700">
          {/* Copyright */}
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            Copyright 2025 © <span className="font-bold text-white">Hardware Shack</span>
          </div>
          
          {/* Payment Methods */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            {/* Cash on Delivery */}
            <div className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div className="text-gray-300 text-xs font-medium">
                <div>CASH ON</div>
                <div>DELIVERY</div>
              </div>
            </div>

            {/* G Pay */}
            <div className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <div className="text-gray-300 text-xs font-bold">G Pay</div>
            </div>

            {/* VISA */}
            <div className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <path d="M8.5 6.5h7v11h-7z"/>
                <path d="M9.5 7.5h5v9h-5z" fill="#1A1F71"/>
                <path d="M12 8.5c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="white"/>
              </svg>
              <div className="text-gray-300 text-xs font-bold">VISA</div>
            </div>

            {/* MasterCard */}
            <div className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24">
                <circle cx="9" cy="12" r="5" fill="#EB001B"/>
                <circle cx="15" cy="12" r="5" fill="#F79E1B"/>
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" fill="#FF5F00"/>
              </svg>
              <div className="text-gray-300 text-xs font-bold">MasterCard</div>
            </div>

            {/* Bank Transfer */}
            <div className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <div className="text-gray-300 text-xs font-medium">
                <div>BANK</div>
                <div>TRANSFER</div>
              </div>
            </div>

            {/* Diners Club */}
            <div className="bg-gray-700 px-3 py-2 rounded flex items-center gap-2">
              <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div className="text-gray-300 text-xs font-bold">Diners Club</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
