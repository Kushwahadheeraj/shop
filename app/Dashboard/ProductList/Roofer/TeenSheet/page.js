import ProductList from './ProductList';

export default function TeenSheetListPage() {
  return <ProductList />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
