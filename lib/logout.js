// Centralized logout function
export const performLogout = () => {
  // Clear all user-related data from localStorage
  localStorage.removeItem('euser_token');
  localStorage.removeItem('euser');
  localStorage.removeItem('euser_username');
  localStorage.removeItem('euser_addresses');
  localStorage.removeItem('euser_checkout_address');
  
  // Clear seller data as well (if exists)
  localStorage.removeItem('token');
  localStorage.removeItem('seller');
  
  // Clear cart data
  localStorage.removeItem('cart');
  
  // Dispatch logout events to notify other components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('euser-auth'));
    window.dispatchEvent(new Event('seller-auth'));
  }
  
  // Always redirect to home page
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// Logout with confirmation
export const logoutWithConfirmation = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    performLogout();
  }
};
