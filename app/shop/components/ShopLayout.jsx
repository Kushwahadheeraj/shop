'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import PersistentShopSidebar from './PersistentShopSidebar';

export default function ShopLayout({ children }) {
  const pathname = usePathname();

  const folderToLabelMap = {
    Uncategorized: 'UNCATEGORIZED',
    Adhesives: 'ADHESIVES',
    Cements: 'CEMENTS & POP',
    Cleaning: 'CLEANING',
    Dry: 'DRY WALL GYPSUM SCREWS',
    Electrical: 'ELECTRICAL ITEMS',
    Hardware: 'HOUSE HOLD LADDER',
    Locks: 'LOCKS & ACCESSORIES',
    Paint: 'PAINTS',
    Pipe: 'PIPES & FITTINGS',
    Sanitary: 'SANITARY WARE & FAUCETS',
    Tools: 'TOOLS',
    WaterProofing: 'WATERPROOFING',
  };

  const getCurrentLabel = () => {
    if (!pathname) return '';
    const parts = pathname.split('/').filter(Boolean);
    
    // Check if it's the main Shop page
    if (parts.length === 1 && parts[0].toLowerCase() === 'shop') return 'SHOP';

    const shopIndex = parts.findIndex((p) => p.toLowerCase() === 'shoppage');
    const top = shopIndex !== -1 ? parts[shopIndex + 1] : undefined;
    if (!top) return '';
    return folderToLabelMap[top] || top.replace(/-/g, ' ').toUpperCase();
  };

  const currentLabel = getCurrentLabel();
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-[180px] pt-[120px] pb-8">
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-400 uppercase tracking-widest">
            <Link href="/" className="hover:text-black transition-colors">HOME</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 font-bold">{currentLabel}</span>
          </nav>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Persistent Sidebar Container */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <PersistentShopSidebar />
          </div>
          
          {/* Main Content Area */}
          <main className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-100">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
