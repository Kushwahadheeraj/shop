import ProductForm from './ProductForm';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function FiberSheetPage() {
  return <ProductForm />;
}