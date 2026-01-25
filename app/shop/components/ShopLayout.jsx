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
    const shopIndex = parts.findIndex((p) => p.toLowerCase() === 'shoppage');
    const top = shopIndex !== -1 ? parts[shopIndex + 1] : undefined;
    if (!top) return '';
    return folderToLabelMap[top] || top.replace(/-/g, ' ').toUpperCase();
  };

  const currentLabel = getCurrentLabel();
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">HOME</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">{currentLabel}</span>
          </nav>

        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Persistent Sidebar */}
          <PersistentShopSidebar />
          
          {/* Main Content Area */}
          <main className="w-full lg:w-3/4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
