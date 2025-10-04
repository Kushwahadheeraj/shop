import ProductForm from './ProductForm';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function BrushPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Brush Product</h1>
      <ProductForm />
    </div>
  );
} 

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
