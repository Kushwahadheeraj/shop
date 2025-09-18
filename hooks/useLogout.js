import { useCallback } from 'react';
import { performLogout } from '@/lib/logout';

// Custom hook for logout functionality
export const useLogout = () => {
  const logout = useCallback(() => {
    performLogout();
  }, []);

  return { logout };
};
