import ProductList from './ProductList';

export default function InteriorsPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
