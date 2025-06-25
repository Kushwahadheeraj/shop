"use client";
import React from 'react';
import { useAuth } from '../../components/AuthContext';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen m-0 p-0">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col justify-between h-screen">
        <div>
          <div className="p-4 font-bold text-xl">LOGO</div>
          <nav className="flex-1 p-4">
            <ul>
              <li className="mb-4">Dashboard</li>
              <li className="mb-4">Settings</li>
            </ul>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700 flex flex-col gap-2">
          <button className="w-full text-left" onClick={logout}>Logout</button>
        </div>
      </aside>
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