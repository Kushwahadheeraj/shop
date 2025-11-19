// Centralized logout function
export const performLogout = (redirectTo = "/") => {
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
  
  // Redirect to the requested page (defaults to home)
  if (typeof window !== 'undefined') {
    const target = redirectTo || '/';
    if (window.location.pathname === target) {
      window.location.reload();
    } else {
      window.location.href = target;
    }
  }
};

// Logout with confirmation
export const logoutWithConfirmation = (redirectTo) => {
  if (window.confirm('Are you sure you want to logout?')) {
    performLogout(redirectTo);
  }
};
