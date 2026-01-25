import CategoryBannerUpload from '@/components/CategoryBannerUpload';

export default function SlidingSystemPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Sliding System</h1>
      <CategoryBannerUpload category="SlidingSystem" />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
