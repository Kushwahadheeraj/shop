"use client";
import ProductForm from "./ProductForm.jsx";
import CategoryBannerUpload from '@/components/CategoryBannerUpload';
export default function CeilingFansProductAddPage() {
  return (
    <div className="space-y-6">
      <CategoryBannerUpload category="CeilingFans" />
      <ProductForm />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
