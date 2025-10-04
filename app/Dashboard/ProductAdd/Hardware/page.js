import ProductForm from "./ProductForm.jsx";
export default function HardwareProductAddPage() {
  return <ProductForm />;
} 


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
