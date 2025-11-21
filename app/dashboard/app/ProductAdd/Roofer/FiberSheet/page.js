import ProductForm from './ProductForm';

export default function FiberSheetPage() {
  return <ProductForm />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
