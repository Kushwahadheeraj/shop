"use client";
import React from 'react';
import { useAuth } from '../../components/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  const handleSetting = () => {
    alert('Settings clicked');
  };

  return (
    <div className="flex h-screen m-0 p-0">
      <Sidebar onSetting={handleSetting} onLogout={logout} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Navbar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6 m-0 p-0">
          <div className="font-semibold">Dashboard</div>
          <div className="flex items-center gap-4">
            <span>{user?.username}</span>
            <button onClick={logout}>Logout</button>
          </div>
        </header>
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
} 