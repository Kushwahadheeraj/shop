"use client";
import React from 'react';
import { AuthProvider } from './AuthContext';
import DashboardLayout from '../app/layout-wrapper';

// Client component wrapper - components are already marked with "use client"
// The defensive code in AuthContext and useAuth should handle build-time null React cases
export default function ClientProviders({ children }) {
  // During build/prerender, if React is not available, just render children
  // This prevents errors when Next.js evaluates this component during error page builds
  try {
    // Check if React is available before using it
    if (typeof React === 'undefined' || React === null || !React.useContext) {
      return children;
    }

    return (
      <AuthProvider>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </AuthProvider>
    );
  } catch (error) {
    // If providers fail during build (e.g., React is null), just render children
    // This can happen during static generation of error pages
    if (process.env.NODE_ENV === 'development') {
      console.warn('ClientProviders: Providers unavailable during build:', error.message);
    }
    return children;
  }
}
