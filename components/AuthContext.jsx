"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE_URL from "@/lib/apiConfig";

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
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Try to get user data using existing endpoint
        const response = await fetch(`${API_BASE_URL}/seller/register`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser({ 
            username: data.username || data.name, 
            email: data.email,
            role: data.role || 'User'
          });
        } else if (response.status === 401) {
          // Only remove token on 401 (Unauthorized)
          localStorage.removeItem('token');
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
        localStorage.setItem('token', data.token);
        setUser({ 
          username: data.username || data.name, 
          email: data.email,
          role: data.role || 'User'
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
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login/seller');
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // If we have a token, user is authenticated (don't check user object during loading)
    return token !== null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      isAuthenticated,
      checkAuthStatus 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 