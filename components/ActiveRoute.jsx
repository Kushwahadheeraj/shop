"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export default function ActiveRoute({ children }) {
  const { isAuthenticated, isActive, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        router.replace('/login/seller');
      } else if (!isActive()) {
        router.replace('/Dashboard');
      }
    }
  }, [loading, isAuthenticated, isActive, router]);

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

  if (!isAuthenticated() || !isActive()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Your account is not active. Please contact admin.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 