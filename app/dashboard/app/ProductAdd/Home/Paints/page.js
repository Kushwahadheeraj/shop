import CategorySelect from "./CategorySelect.jsx";
import CategoryBannerUpload from '@/components/CategoryBannerUpload';

export default function HomeProductAddPage() {
  return (
    <div className="space-y-6">
      <CategoryBannerUpload category="Paints" />
      <CategorySelect />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
