"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from "@/lib/apiConfig";
import { performLogout } from '@/lib/logout';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Get current seller profile
        const response = await fetch(`${API_BASE_URL}/seller/profile/me`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Handle local file URLs by prepending the correct base URL
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
          setUser(null);
        } else {
          // For other errors, keep token but set user to null
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On network error, keep token and user null (will retry later)
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/seller/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await res.json();
      
      if (data.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        
        // Handle local file URLs by prepending the correct base URL
        let avatarUrl = data.seller.avatar;
        if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
          // Remove /api from the base URL for static file serving
          const baseUrl = API_BASE_URL.replace('/api', '');
          avatarUrl = `${baseUrl}${avatarUrl}`;
        }
        
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
        return { success: true };
      } else {
        return { success: false, error: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    // Use centralized logout function
    performLogout();
  };

  const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return token !== null && user !== null;
  };

  const isSeller = () => {
    return user && (user.role === 'seller' || user.role === 'admin');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isUser = () => {
    return user && user.role === 'user';
  };

  const isActive = () => {
    return user && user.status === 'active';
  };

  const updateProfile = async (profileData) => {
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
        let avatarUrl = data.seller.avatar;
        if (avatarUrl && avatarUrl.startsWith('/uploads/')) {
          // Remove /api from the base URL for static file serving
          const baseUrl = API_BASE_URL.replace('/api', '');
          avatarUrl = `${baseUrl}${avatarUrl}`;
        }
        
        setUser({
          ...user,
          username: data.seller.username,
          email: data.seller.email,
          mobile: data.seller.mobile,
          shopName: data.seller.shopName,
          gstNumber: data.seller.gstNumber,
          status: data.seller.status || user.status,
          avatar: avatarUrl
        });
        return { success: true, message: data.message };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
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
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
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
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 