'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/logo.png';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import LoginRegisterModal from "@/components/LoginRegisterModal";
import { useCart } from '@/components/CartContext';
import CartPreview from '@/components/CartPreview';
import API_BASE_URL from '@/lib/apiConfig';
import { performLogout } from '@/lib/logout';


export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { count } = useCart() || { count: 0 };
  const [hover, setHover] = useState(false);
  const [username, setUsername] = useState('');
  const [userOpen, setUserOpen] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const allRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('euser_token');
      let name = localStorage.getItem('euser_username');
      if (token && !name) {
        try {
          const res = await fetch(`${API_BASE_URL}/euser/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const data = await res.json();
            name = data?.username || data?.email?.split('@')[0] || 'USER';
            localStorage.setItem('euser_username', name);
          }
        } catch {}
      }
      setUsername(token ? (name || 'USER') : '');
    };
    load();
    const onAuth = () => load();
    window.addEventListener('euser-auth', onAuth);
    return () => window.removeEventListener('euser-auth', onAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (allRef.current && !allRef.current.contains(event.target)) {
        setAllOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutUser = () => {
    setUsername('');
    // Use centralized logout function
    performLogout();
  };

  return (
    <>

      <header className='fixed top-0 left-0 w-full z-[3000] h-16 md:h-24 bg-white border-b shadow'>
        <div className='w-full max-w-[1280px] mx-auto h-full flex items-center justify-between px-1 md:px-2'>
          {/* Left: Hamburger, Logo, Brand */}
          <div className='flex items-center gap-3'>
            {/* Hamburger menu icon */}
            <button
              className={`mr-1 md:mr-2 text-2xl text-gray-500 focus:outline-none lg:hidden ${
                sidebarOpen ? 'abc' : ''
              }`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <IoClose size={24} /> : <FiMenu size={24} />}
            </button>
            <Image
              src={Logo}
              alt='Hardware Shack Logo'
              className='rounded w-[9.5rem] h-10 md:w-[14rem] md:h-[3rem] lg:w-[18.563rem] lg:h-[4.25rem] object-contain'
            />
          </div>
          {/* Right: Mobile cart */}
          <div className='md:hidden flex items-center gap-2'>
            <Link href='/cart' className='relative block'>
              <span className='w-10 h-10 rounded-full bg-yellow-400 text-white flex items-center justify-center shadow-md'>
                <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                  <circle cx='9' cy='21' r='1.5' />
                  <circle cx='20' cy='21' r='1.5' />
                  <path d='M5 6h18l-2 10H7z' />
                </svg>
              </span>
              {count > 0 && (
                <span className='absolute -top-1 -right-1 bg-black text-white text-[10px] rounded-full px-1.5 py-0.5 leading-none'>{count}</span>
              )}
            </Link>
          </div>
          {/* Hide on mobile: Search and Login/Register */}
          <div className='hidden md:flex items-center flex-none md:w-[400px] lg:w-[480px] mx-4 lg:mx-6'>
            <div className='flex items-center w-full'>
              {/* Small All chip with image */}
              <div className='relative' ref={allRef}>
                <button onClick={() => setAllOpen((v) => !v)} className='h-8 px-2 rounded-full text-gray-400 text-sm  transition-colors shadow-md flex items-center font-medium' aria-haspopup='true' aria-expanded={allOpen}>
                  <span>All</span>
                  <svg className='ml-1 w-3 h-6' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.586l3.71-3.356a.75.75 0 1 1 1.02 1.1l-4.25 3.85a.75.75 0 0 1-1.02 0l-4.25-3.85a.75.75 0 0 1 .02-1.06z' />
                  </svg>
                </button>
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-0 w-48 bg-white border border-gray-200 shadow-xl z-[2000] ${allOpen ? 'block' : 'hidden'}`}>
                  <div className=''>
                    {/* <div className='px-4 py-0.2 hover:bg-blue-600 cursor-pointer flex items-center border-b border-gray-100'>
                      
                      <span className='text-sm font-medium text-gray-600 hover:text-white'>All</span>
                    </div> */}
                    <Link href='/ShopPage/Adhesives' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Adhesives</Link>
                    <Link href='/ShopPage/Cements' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Cements & POP</Link>
                    <Link href='/ShopPage/Cleaning' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Cleaning</Link>
                    <Link href='/ShopPage/Dry' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Dry Wall Gypsum Screws</Link>
                    <Link href='/ShopPage/Electrical' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Electrical Items</Link>
                    <Link href='/ShopPage/Hardware' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>House Hold Ladder</Link>
                    <Link href='/ShopPage/Locks' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Locks & accessories</Link>
                    <Link href='/ShopPage/Cleaning' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Mask & Sanitizers</Link>
                    <Link href='/ShopPage/Paint' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Paints</Link>
                    <Link href='/ShopPage/Pipe' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Pipes & Fittings</Link>
                    <Link href='/ShopPage/Sanitary' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Sanitary Ware & faucets</Link>
                    <Link href='/ShopPage/Tools' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Tools</Link>
                    <Link href='/ShopPage/Uncategorized' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>Uncategorized</Link>
                    <Link href='/ShopPage/WaterProofing' className='block px-4 py-1.5 hover:bg-blue-600 text-sm text-gray-700 hover:text-white'>WaterProofing</Link>
                  </div>
                </div>
              </div>
              <div className='w-2'></div>
              {/* Big search pill */}
              <div className='flex-1 h-8 rounded-full bg-gray-50 border border-gray-300 shadow-sm flex items-center'>
                <input
                  type='text'
                  placeholder='Search...'
                  className='flex-1 h-full px-4 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none'
                />
                <div className='px-4 h-full flex items-center justify-center text-gray-500'>
                  <svg
                    width='20'
                    height='20'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <circle cx='11' cy='11' r='8' />
                    <line x1='21' y1='21' x2='16.65' y2='16.65' />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Right actions */}
          <div className='hidden md:flex items-center gap-4 whitespace-nowrap'>
            {username ? (
              <div className='relative' onMouseEnter={() => setUserOpen(true)} onMouseLeave={() => setUserOpen(false)}>
                <button className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold h-8 px-2 rounded-full transition flex items-center gap-2 uppercase tracking-wide text-sm shadow-md max-w-[360px] overflow-hidden'>
                  <span className='truncate'>{String(username).toUpperCase()}</span>
                  <span className='inline-block text-white text-base leading-none'>👤</span>
                </button>
                {userOpen && (
                  <div className='absolute right-0 top-full mt-2 w-[22rem] bg-white rounded-xl border shadow-2xl text-[15px] z-[1000] cursor-default'>
                    {/* caret */}
                    <div className='absolute -top-2 right-10 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white'></div>
                    <div className='py-2'>
                      <Link href='/AccountDetails' className='block px-6 py-3 hover:bg-gray-50 font-medium'>Dashboard</Link>
                      <Link href='/Orders' className='block px-6 py-3 hover:bg-gray-50'>Orders</Link>
                      <Link href='/downloads' className='block px-6 py-3 hover:bg-gray-50'>Downloads</Link>
                      <Link href='/Address' className='block px-6 py-3 hover:bg-gray-50'>Addresses</Link>
                      <Link href='/AccountDetails' className='block px-6 py-3 hover:bg-gray-50'>Account details</Link>
                      <button onClick={logoutUser} className='w-full text-left px-6 py-3 hover:bg-gray-50'>Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button  onClick={() => setShowLogin(true)} className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold h-8 px-2 rounded-full transition shadow-md uppercase tracking-wide text-sm'>Login / Register</button>
                <LoginRegisterModal open={showLogin} onClose={() => setShowLogin(false)} />
              </>
            )}
            <span className='h-8 border-l border-gray-300'></span>
            <div className='relative' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <Link href='/cart' className='relative block'>
                <p className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold h-8 px-2 rounded-full flex items-center justify-center gap-2 transition shadow-md uppercase tracking-wide text-sm'>
                  <span>CART</span>
                  <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                    <circle cx='9' cy='21' r='1.5' />
                    <circle cx='20' cy='21' r='1.5' />
                    <path d='M5 6h18l-2 10H7z' />
                  </svg>
                </p>
                {count > 0 && (
                  <span className='absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1 py-0.5'>{count}</span>
                )}
              </Link>
              <CartPreview open={hover} />
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
