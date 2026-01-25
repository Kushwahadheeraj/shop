import ProductForm from "./ProductForm.jsx";
import CategoryBannerUpload from '@/components/CategoryBannerUpload';

export default function DealsAddPage() {
  return (
    <div className="space-y-6">
      <CategoryBannerUpload category="DealsSection" />
      <ProductForm />
    </div>
  );
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

