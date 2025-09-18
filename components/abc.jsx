'use client';
import { useEffect, useState } from 'react';
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

  const logoutUser = () => {
    setUsername('');
    // Use centralized logout function
    performLogout();
  };

  return (
    <>

      <header className='fixed top-0 left-0 w-full z-50 h-16 md:h-24 bg-white border-b shadow'>
        <div className='w-full max-w-[1280px] mx-auto h-full flex items-center justify-between px-3 md:px-2'>
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
          <div className='hidden md:flex items-center flex-1 max-w-3xl mx-6 lg:mx-8'>
            <div className='flex items-center w-full'>
              {/* Small All chip */}
              <div className='h-11 px-4 rounded-full bg-white border border-gray-300 shadow-sm flex items-center text-gray-700 text-sm'>
                <select className='bg-transparent focus:outline-none'>
                  <option>All</option>
                </select>
              </div>
              <div className='w-2'></div>
              {/* Big search pill */}
              <div className='flex-1 h-11 rounded-full bg-gray-50 border border-gray-300 shadow-sm flex items-center'>
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
                <button className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold h-11 px-6 rounded-full transition flex items-center gap-2 uppercase tracking-wide text-sm shadow-md max-w-[360px] overflow-hidden'>
                  <span className='truncate'>{String(username).toUpperCase()}</span>
                  <span className='inline-block text-base leading-none'>👤</span>
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
                <button  onClick={() => setShowLogin(true)} className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold h-11 px-6 rounded-full transition shadow-md uppercase tracking-wide text-sm'>Login / Register</button>
                <LoginRegisterModal open={showLogin} onClose={() => setShowLogin(false)} />
              </>
            )}
            <span className='h-8 border-l border-gray-300'></span>
            <div className='relative' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
              <Link href='/cart' className='relative block'>
                <p className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold h-11 px-5 rounded-full flex items-center justify-center gap-2 transition shadow-md uppercase tracking-wide text-sm'>
                  <span>CART</span>
                  <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
                    <circle cx='9' cy='21' r='1.5' />
                    <circle cx='20' cy='21' r='1.5' />
                    <path d='M5 6h18l-2 10H7z' />
                  </svg>
                </p>
                {count > 0 && (
                  <span className='absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5 py-0.5'>{count}</span>
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
