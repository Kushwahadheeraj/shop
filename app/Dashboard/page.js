"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import DashboardLayout from './layout';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login/seller');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
      <p>This is your seller dashboard.</p>
    </div>
  );
} 