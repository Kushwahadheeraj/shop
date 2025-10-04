import ProductForm from './ProductForm';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function UncategorizedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Uncategorized Products</h1>
      <ProductForm />
      {/* List products here */}
    </div>
  );
} 

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
