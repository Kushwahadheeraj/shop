'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/public/logo.png';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';


export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
  
      <header className='fixed top-0 left-0 w-full z-50 h-24 flex items-center justify-between px-4 py-3 bg-white border-b shadow'>
        {/* Left: Hamburger, Logo, Brand */}
        <div className='flex items-center gap-3'>
          {/* Hamburger menu icon */}
          <button
            className={`mr-2 text-2xl text-gray-500 focus:outline-none lg:hidden ${
              sidebarOpen ? 'abc' : ''
            }`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <IoClose size={24} /> : <FiMenu size={24} />}
          </button>

          <Image
            src={Logo}
            alt='Hardware Shack Logo'
            className='rounded w-[14rem] h-[3rem] lg:w-[21.563rem] lg:h-[6.25rem] object-contain'
          />
        </div>
        {/* Hide on mobile: Search and Login/Register */}
        <div className='hidden md:flex items-center flex-1 max-w-2xl mx-8'>
          <div className='flex w-full'>
            <select className='rounded-l-full px-4 py-2 bg-gray-100 border-2 border-gray-300 text-gray-600 focus:outline-none'>
              <option>All</option>
              {/* Add more options here */}
            </select>
            <input
              type='text'
              placeholder='Search...'
              className='flex-1 px-4 py-2 bg-gray-100 border-t-2 border-b-2 border-gray-300 focus:outline-none'
              style={{ borderLeft: 'none', borderRadius: '0' }}
            />
            <button className='rounded-r-full px-4 py-2 bg-gray-100 border-2 border-gray-300 border-l-0 text-gray-500 focus:outline-none flex items-center justify-center'>
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
            </button>
          </div>
        </div>
        {/* Right: Cart button only on mobile, show login/register on md+ */}
        <div className='flex items-center gap-4'>
          <Link href='/login' className='hidden md:block'>
            <p className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-2 rounded-full transition'>
              LOGIN / REGISTER
            </p>
          </Link>
          <span className='h-8 border-l border-gray-300 hidden md:inline-block'></span>
          <Link href='/cart'>
            <p className='bg-yellow-400 hover:bg-yellow-500 text-white font-bold w-12 h-12 rounded-full flex items-center justify-center transition'>
              <svg
                width='28'
                height='28'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <circle cx='12' cy='22' r='1.5' />
                <circle cx='20' cy='22' r='1.5' />
                <path d='M5 6h18l-2 10H7z' />
              </svg>
            </p>
          </Link>
        </div>
      </header>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
