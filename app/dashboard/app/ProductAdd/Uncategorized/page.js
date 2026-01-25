import ProductForm from './ProductForm';
import CategoryBannerUpload from '@/components/CategoryBannerUpload';

export default function UncategorizedPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Uncategorized Products</h1>
      <CategoryBannerUpload category="Uncategorized" />
      <ProductForm />
      {/* List products here */}
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
