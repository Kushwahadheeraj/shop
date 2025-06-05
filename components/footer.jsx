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
              {/* <img src="/googleplay.png" alt="Google Play" className="w-32" /> */}
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
        {/* Payment Methods */}
        <div className="flex flex-wrap gap-2 justify-center mt-8 mb-4">

          <img src="/cod.png" alt="Cash on Delivery" className="h-7" />
          <img src="/gpay.png" alt="GPay" className="h-7" />
          <img src="/visa.png" alt="Visa" className="h-7" />
          <img src="/mastercard.png" alt="MasterCard" className="h-7" />
          <img src="/bank.png" alt="Bank Transfer" className="h-7" />
          <img src="/diners.png" alt="Diners Club" className="h-7" />
        </div>
        {/* Copyright */}
        <div className="text-center text-gray-400 text-sm mt-2">
          Copyright 2025 © <span className="font-bold text-white">HardwareShack</span>
        </div>
      </div>
    </footer>
  );
}
