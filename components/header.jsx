import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/logo.png';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <Image
          src={Logo}
          alt="Hardware Shack Logo"
          width={48}
          height={48}
          className="rounded-lg bg-yellow-400 p-2"
        />
        <button className="ml-2 text-2xl text-gray-500 focus:outline-none">
          <span className="sr-only">Open menu</span>
          <Image
            src={Logo}
            alt="Menu Logo"
            width={24}
            height={24}
            className="rounded"
          />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center flex-1 max-w-2xl mx-8">
        <select className="rounded-l-full px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 text-gray-600 focus:outline-none">
          <option>All</option>
          {/* Add more options here */}
        </select>
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 px-4 py-2 bg-gray-100 border-t border-b border-gray-300 focus:outline-none"
        />
        <button className="rounded-r-full px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 text-gray-500 flex items-center">
          <Image
            src={Logo}
            alt="Search Logo"
            width={20}
            height={20}
            className="rounded"
          />
        </button>
      </div>

      {/* Auth and Cart Buttons */}
      <div className="flex items-center gap-4">
        <Link href="/login">
          <p className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded-full transition">
            LOGIN / REGISTER
          </p>
        </Link>
        <span className="h-8 border-l border-gray-300"></span>
        <Link href="/cart">
          <p className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded-full flex items-center gap-2 transition">
            CART
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="17" r="1" />
              <circle cx="15" cy="17" r="1" />
              <path d="M5 6h14l-1.5 9h-11z" />
            </svg>
          </p>
        </Link>
      </div>
    </header>
  );
}
