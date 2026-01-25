import ProductForm from './ProductForm';
import CategoryBannerUpload from '@/components/CategoryBannerUpload';

export default function CleaningPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cleaning Products</h1>
      <CategoryBannerUpload category="Cleaning" />
      <ProductForm />
      {/* List products here */}
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
