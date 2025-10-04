import ProductForm from './ProductForm';

export default function CementsSheetPage() {
  return <ProductForm />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;