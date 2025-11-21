"use client";
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAuthenticated, isSeller } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith('/login');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSetting = () => {
    router.push('/Settings');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout('/login/seller');
  };

  // Protect dashboard routes - only sellers can access
  useEffect(() => {
    if (isAuthRoute) return;
    if (!loading) {
      if (!isAuthenticated()) {
        router.replace('/login/seller');
      } else if (!isSeller()) {
        router.replace('/');
      }
    }
  }, [loading, isAuthenticated, isSeller, router, isAuthRoute]);

  // Show loading while checking authentication
  if (!isAuthRoute && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated or not a seller
  if (!isAuthRoute && (!isAuthenticated() || !isSeller())) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (isAuthRoute) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
      <div className="flex h-screen m-0 p-0">
        {/* Sidebar: persistent on lg+, drawer on mobile */}
        <div className="hidden lg:block">
          <Sidebar onSetting={handleSetting} onLogout={handleLogout} />
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white dark:bg-zinc-900 shadow-xl">
              <Sidebar onSetting={handleSetting} onLogout={handleLogout} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-screen min-w-0">
          <Navbar onMenuClick={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6 overflow-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
            {children}
          </main>
        </div>
      </div>
  );
} 