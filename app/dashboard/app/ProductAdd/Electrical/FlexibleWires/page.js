"use client";
import ProductForm from "./ProductForm.jsx";
import CategoryBannerUpload from '@/components/CategoryBannerUpload';
export default function FlexibleWiresProductAddPage() {
  return (
    <div className="space-y-6">
      <CategoryBannerUpload category="FlexibleWires" />
      <ProductForm />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
