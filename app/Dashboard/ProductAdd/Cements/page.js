import ProductForm from './ProductForm';

export default function CementsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cements Products</h1>
      <ProductForm />
      {/* List products here */}
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;