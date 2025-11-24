// Layout for BillManagement route
// Keep this segment fully dynamic because the page relies on runtime data.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function BillManagementLayout({ children }) {
  return children;
}

