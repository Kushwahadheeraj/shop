"use client";
import ProductForm from "./ProductForm.jsx";
import CategoryBannerUpload from '@/components/CategoryBannerUpload';
export default function AdaptorsProductAddPage() {
   return (
       <div>
         <h1 className="text-2xl font-bold mb-4">Adaptors Products</h1>
         <CategoryBannerUpload category="Adaptors" />
         <ProductForm />
         {/* List products here */}
       </div>
     );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
