import ProductForm from './ProductForm';
import CategoryBannerUpload from '@/components/CategoryBannerUpload';

export default function ShopByCategoryAddPage() {
  return (
    <div>
      <CategoryBannerUpload category="ShopByCategory" />
      <ProductForm />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
