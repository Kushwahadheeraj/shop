import ProductList from './ProductList';

export default function Page() {
  return <ProductList />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
