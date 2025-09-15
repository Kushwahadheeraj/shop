'use client';

import React from 'react';
import PersistentShopSidebar from './PersistentShopSidebar';

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
