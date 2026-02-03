import ProductForm from './ProductForm';

export default function ShopByCategoryAddPage() {
  return (
    <div>
      <ProductForm />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
