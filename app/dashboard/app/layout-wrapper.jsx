"use client";
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useState } from 'react';

export default function DashboardLayout({ children }) {
  // useAuth() already handles SSR/build time fallback with stable references
  const { user, loading, logout, isAuthenticated, isSeller } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/login') || false;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSetting = () => {
    // Prefetch before navigation for instant load
    router.prefetch('/Settings');
    router.push('/Settings');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout('/login/seller');
  };

  // Protect dashboard routes - only sellers can access
  useEffect(() => {
    if (isAuthRoute) return;
    
    // Fast path: Check token immediately without waiting for API
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      router.replace('/login/seller');
      return;
    }
    
    // CRITICAL: Check if user is inactive - immediately redirect
    if (user && user.status === 'inactive') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login/seller';
      }
      return;
    }
    
    // If we have token but still loading, wait for auth check to finish
    if (loading) {
      return;
    }
    
    // If token exists but user is not yet loaded, stay on current route
    if (!user) {
      return;
    }

    // Once user is known, block non-seller roles
    if (!isSeller()) {
      router.replace('/');
    }
  }, [loading, isSeller, router, isAuthRoute, user]);

  // Show dashboard layout only when user is loaded and is seller/admin
  if (!isAuthRoute) {
    if (loading) {
      return null;
    }
    if (!user || !isSeller()) {
      return null;
    }
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
