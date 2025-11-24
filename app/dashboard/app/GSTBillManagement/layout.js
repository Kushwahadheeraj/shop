// Layout for GSTBillManagement route
// Needs to stay dynamic due to client-side data fetching/auth checks.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function GSTBillManagementLayout({ children }) {
  return children;
}

