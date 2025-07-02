"use client";
import React from 'react';
import { useAuth } from '../../components/AuthContext';
import Sidebar from './Sidebar';
import Navbar from '@/app/Dashboard/Navbar';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  const handleSetting = () => {
    // Implement settings logic here
  };

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