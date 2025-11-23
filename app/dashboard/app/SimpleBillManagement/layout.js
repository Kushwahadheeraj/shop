// Layout for SimpleBillManagement route
// Explicitly mark as static to prevent Vercel from expecting a lambda
export const dynamic = 'force-static';

export default function SimpleBillManagementLayout({ children }) {
  return children;
}

