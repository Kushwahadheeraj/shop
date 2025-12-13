"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from "@/lib/apiConfig";
import { performLogout } from '@/lib/logout';

// Safely create context - handle case where React might be null during build
// Initialize as null and create lazily when first accessed
let AuthContext = null;

function getAuthContext() {
  if (AuthContext) return AuthContext;
  
  try {
    // Check if React and createContext are available before using them
    if (typeof React !== 'undefined' && React !== null && React?.createContext && typeof createContext === 'function') {
      AuthContext = createContext();
      return AuthContext;
    } else {
      throw new Error('React or createContext not available');
    }
  } catch (error) {
    // During build/prerender, if React is null, createContext will fail
    // Create a fallback context object that mimics the Context API
    AuthContext = {
      Provider: ({ children }) => children,
      Consumer: ({ children }) => children(null),
      _currentValue: null,
      displayName: 'AuthContext'
    };
    return AuthContext;
  }
}

// Stable fallback object for SSR/build time when context is unavailable
// All functions are stable references to prevent infinite loops in dependency arrays
// Return structures match real implementations to prevent silent failures
const AUTH_FALLBACK = {
  user: null,
  token: null,
  loading: false,
  login: async () => ({ success: false, error: 'Authentication not available' }),
  logout: () => {}, // logout is not async in real implementation
  isAuthenticated: () => false,
  isSeller: () => false,
  isAdmin: () => false,
  isUser: () => false,
  isActive: () => false,
  checkAuthStatus: async () => {}, // checkAuthStatus doesn't return a value
  updateProfile: async () => ({ success: false, error: 'Profile update not available' }),
  changePassword: async () => ({ success: false, error: 'Password change not available' })
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on app load - OPTIMIZED: Non-blocking
  useEffect(() => {
    // Fast path: Check token first, then verify async
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    // Set loading to false immediately if token exists (optimistic)
    // This allows navigation to proceed without waiting for API
    setLoading(false);
    
    // Verify token in background (non-blocking)
    checkAuthStatus();
  }, []);

  // OPTIMIZED: Memoize checkAuthStatus to prevent recreation
  const checkAuthStatus = useCallback(async () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }
    
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (!storedToken) {
      setUser(null);
      return;
    }
    
    try {
      // Get current seller profile with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_BASE_URL}/seller/profile/me`, {
        headers: { 
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
        next: { revalidate: 60 } // Next.js caching
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        // CRITICAL: Check if user is inactive - immediately logout if deactivated
        if (data.status === 'inactive') {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            setUser(null);
            // Immediately redirect to login page
            window.location.href = '/login/seller';
          }
          return;
        }
        
        // OPTIMIZED: Handle local file URLs by prepending the correct base URL
        let avatarUrl = data.avatar;
        if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
          // Remove /api from the base URL for static file serving
          const baseUrl = API_BASE_URL.replace('/api', '');
          avatarUrl = `${baseUrl}${avatarUrl}`;
        }
        
        setUser({ 
          id: data.id,
          username: data.username, 
          email: data.email,
          mobile: data.mobile,
          shopName: data.shopName,
          gstNumber: data.gstNumber,
          role: data.role || 'seller',
          status: data.status || 'active',
          avatar: avatarUrl
        });
      } else if (response.status === 401) {
        // Only remove token on 401 (Unauthorized)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        setToken(null);
        setUser(null);
      } else {
        // For other errors, keep token but set user to null
        setUser(null);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Auth check failed:', error);
      }
      // On network error, keep token (will retry later if needed)
      // Don't clear user if we already have one (optimistic)
    }
  }, []);

  // OPTIMIZED: Memoize login function
  const login = useCallback(async (email, password, redirectPath = '/') => {
    try {
      const res = await fetch(`${API_BASE_URL}/seller/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.token) {
        // CRITICAL: Check if seller is inactive - prevent login if deactivated
        if (data.seller && data.seller.status === 'inactive') {
          return { 
            success: false, 
            error: 'Your account has been deactivated. Please contact administrator.' 
          };
        }
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
          setToken(data.token);
        }
        
        // Handle local file URLs by prepending the correct base URL
        let avatarUrl = data.seller.avatar;
        if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
          // Remove /api from the base URL for static file serving
          const baseUrl = API_BASE_URL.replace('/api', '');
          avatarUrl = `${baseUrl}${avatarUrl}`;
        }
        
        // Set user immediately (optimistic update)
        setUser({ 
          id: data.seller.id,
          username: data.seller.username, 
          email: data.seller.email,
          mobile: data.seller.mobile,
          shopName: data.seller.shopName,
          gstNumber: data.seller.gstNumber,
          role: data.seller.role || 'seller',
          status: data.seller.status || 'active',
          avatar: avatarUrl
        });
        
        // Immediately redirect without waiting - use window.location for instant redirect
        if (typeof window !== 'undefined' && redirectPath) {
          // Use window.location for fastest redirect (no React re-render delay)
          window.location.href = redirectPath;
        }
        
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  // OPTIMIZED: Memoize logout and auth check functions
  const logout = useCallback((redirectTo = '/') => {
    setUser(null);
    setToken(null);
    // Use centralized logout function
    performLogout(redirectTo);
  }, []);

  const isAuthenticated = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return token !== null && user !== null;
  }, [user, token]);

  const isSeller = useCallback(() => {
    return user && (user.role === 'seller' || user.role === 'admin');
  }, [user]);

  const isAdmin = useCallback(() => {
    return user && user.role === 'admin';
  }, [user]);

  const isUser = useCallback(() => {
    return user && user.role === 'user';
  }, [user]);

  const isActive = useCallback(() => {
    return user && user.status === 'active';
  }, [user]);

  // OPTIMIZED: Memoize updateProfile
  const updateProfile = useCallback(async (profileData) => {
    try {
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }
      const token = localStorage.getItem('token');
      
      // Check if profileData is FormData (for file uploads) or regular object
      const isFormData = profileData instanceof FormData;
      
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      // Don't set Content-Type for FormData, let the browser set it with boundary
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/seller/profile/me`, {
        method: 'PUT',
        headers,
        body: isFormData ? profileData : JSON.stringify(profileData)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle local file URLs by prepending the correct base URL
        let avatarUrl = data.seller?.avatar || data.avatar;
        if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
          // Remove /api from the base URL for static file serving
          const baseUrl = API_BASE_URL.replace('/api', '');
          avatarUrl = `${baseUrl}${avatarUrl}`;
        }
        
        const updatedSeller = data.seller || data;
        setUser({
          ...user,
          username: updatedSeller.username,
          email: updatedSeller.email,
          mobile: updatedSeller.mobile,
          shopName: updatedSeller.shopName,
          gstNumber: updatedSeller.gstNumber,
          status: updatedSeller.status || user.status,
          avatar: avatarUrl || user.avatar
        });
        return { success: true, message: data.message || 'Profile updated successfully' };
      } else {
        // Get error message from response
        let errorMessage = 'Failed to update profile';
        let errorData = null;
        
        try {
          // Try to get response text first
          const responseText = await response.text();
          
          // Try to parse as JSON
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
            } catch (parseError) {
              // If not JSON, use the text as error message
              errorMessage = responseText || errorMessage;
            }
          }
          
          // Extract error message from parsed data
          if (errorData) {
            errorMessage = errorData.message || errorData.error || errorData.msg || errorMessage;
            
            // Check for validation errors
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorMessage = errorData.errors.join(', ');
            } else if (errorData.errors && typeof errorData.errors === 'object') {
              const errorMessages = Object.values(errorData.errors).flat();
              errorMessage = errorMessages.join(', ') || errorMessage;
            }
          }
          
          // Log detailed error for debugging
          if (process.env.NODE_ENV === 'development') {
            console.error('Profile update error:', {
              status: response.status,
              statusText: response.statusText,
              errorData: errorData,
              responseText: responseText,
              formData: isFormData ? 'FormData (see network tab for details)' : profileData
            });
          }
        } catch (e) {
          // If we can't read the response, use status info
          errorMessage = `Server error: ${response.status} ${response.statusText || 'Bad Request'}`;
          if (process.env.NODE_ENV === 'development') {
            console.error('Error reading response:', e);
          }
        }
        
        // Provide more specific error message based on status code
        if (response.status === 400) {
          errorMessage = errorMessage || 'Invalid data provided. Please check all fields and try again.';
        } else if (response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to update this profile.';
        } else if (response.status === 404) {
          errorMessage = 'Profile not found.';
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error' };
    }
  }, [user]);

  // OPTIMIZED: Memoize changePassword
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      if (typeof window === 'undefined') {
        return { success: false, error: 'Not available on server side' };
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/seller/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Network error' };
    }
  }, []);

  // REAL-TIME: Periodic status check to detect deactivation (every 30 seconds)
  useEffect(() => {
    if (typeof window === 'undefined' || !user) return;
    
    // Only check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Set up periodic status check
    const statusCheckInterval = setInterval(() => {
      checkAuthStatus();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(statusCheckInterval);
  }, [user, checkAuthStatus]);

  // REAL-TIME: Monitor user status and logout if deactivated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // If user exists but status is inactive, immediately logout
    if (user && user.status === 'inactive') {
      // Clear token and user
      localStorage.removeItem('token');
      setUser(null);
      // Immediately redirect to login
      window.location.href = '/login/seller';
    }
  }, [user]);

  // OPTIMIZED: Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user, 
    token,
    login, 
    logout, 
    loading, 
    isAuthenticated,
    isSeller,
    isAdmin,
    isUser,
    isActive,
    checkAuthStatus,
    updateProfile,
    changePassword
  }), [user, token, loading, login, logout, isAuthenticated, isSeller, isAdmin, isUser, isActive, checkAuthStatus, updateProfile, changePassword]);

  const context = getAuthContext();
  return (
    <context.Provider value={contextValue}>
      {children}
    </context.Provider>
  );
}

export function useAuth() {
  // Safety check: During build/prerender, React might be null or hooks unavailable
  // This can happen when Next.js prerenders error pages (404, 500)
  // Return fallback immediately if hooks are not available
  
  // Check if React is available first (most important check)
  // typeof null === 'object', so we need explicit null check
  // Use optional chaining to safely check React.useContext
  if (typeof React === 'undefined' || React === null || !React?.useContext || typeof React.useContext !== 'function') {
    return AUTH_FALLBACK;
  }
  
  // Also check the destructured useContext as fallback
  // Note: We already checked React.useContext above, so this is just for completeness
  if (typeof useContext !== 'function' || useContext === null || useContext === undefined) {
    // We already verified React.useContext exists above, so we can use it
    // But double-check with optional chaining just to be safe
    if (!React?.useContext || typeof React.useContext !== 'function') {
      return AUTH_FALLBACK;
    }
  }
  
  // Additional safety: Try-catch to handle any edge cases during build
  try {
    // Double-check React is available before calling useContext
    // Use optional chaining to safely check React.useContext
    if (typeof React === 'undefined' || React === null || !React?.useContext || typeof React.useContext !== 'function') {
      return AUTH_FALLBACK;
    }
    
    // Get the context lazily (creates it if needed)
    const context = getAuthContext();
    if (!context || typeof context !== 'object') {
      return AUTH_FALLBACK;
    }
    
    // Use React.useContext directly - we've already verified it exists
    const contextValue = React.useContext(context);
    // Safety check for SSR/build time when context might not be available
    // Return stable fallback object to prevent infinite loops in dependency arrays
    return contextValue || AUTH_FALLBACK;
  } catch (error) {
    // If useContext throws (e.g., "Cannot read properties of null (reading 'useContext')"),
    // it means React is null during build. Return fallback to prevent build failures.
    // This is expected during static generation of error pages
    if (process.env.NODE_ENV === 'development') {
      console.warn('useAuth: React context unavailable during build/prerender:', error.message);
    }
    return AUTH_FALLBACK;
  }
} 