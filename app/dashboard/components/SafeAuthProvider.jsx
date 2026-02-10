"use client";
import { AuthProvider } from './AuthContext';

// Safe wrapper that handles build-time React null cases
export default function SafeAuthProvider({ children }) {
  try {
    return <AuthProvider>{children}</AuthProvider>;
  } catch (error) {
    // If AuthProvider fails during build, just render children
    // This can happen when React is null during static generation
    if (process.env.NODE_ENV === 'development') {
    }
    return <>{children}</>;
  }
}
