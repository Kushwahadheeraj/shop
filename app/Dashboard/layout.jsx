"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import Sidebar from './Sidebar';
import Navbar from '@/app/Dashboard/Navbar';

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isAuthenticated, isSeller } = useAuth();
  const router = useRouter();

  const handleSetting = () => {
    // Implement settings logic here
  };

  // Protect dashboard routes - only sellers can access
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.replace('/login/seller');
      } else if (!isSeller()) {
        // If authenticated but not a seller, redirect to home
        router.replace('/');
      }
    }
  }, [loading, isAuthenticated, isSeller, router]);

  // Show loading while checking authentication
  if (loading) {
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
  if (!isAuthenticated() || !isSeller()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen m-0 p-0">
      <Sidebar onSetting={handleSetting} onLogout={logout} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
          {children}
        </main>
      </div>
    </div>
  );
} 