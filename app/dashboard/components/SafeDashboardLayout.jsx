"use client";
import DashboardLayout from '../app/layout-wrapper';

// Safe wrapper that handles build-time React null cases
export default function SafeDashboardLayout({ children }) {
  try {
    return <DashboardLayout>{children}</DashboardLayout>;
  } catch (error) {
    // If DashboardLayout fails during build, just render children
    // This can happen when React is null during static generation
    if (process.env.NODE_ENV === 'development') {
    }
    return <>{children}</>;
  }
}
