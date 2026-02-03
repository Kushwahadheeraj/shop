"use client";

import ProductForm from "./ProductForm.jsx";

export default function Page() {
  return (
    <div className="space-y-6">
      <ProductForm />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
