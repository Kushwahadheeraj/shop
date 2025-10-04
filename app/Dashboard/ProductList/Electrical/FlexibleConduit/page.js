import ProductList from './ProductList';

export default function FlexibleConduitPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;