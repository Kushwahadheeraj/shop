"use client";
import ProductForm from "./ProductForm.jsx";
export default function DimmerProductAddPage() {
  return <ProductForm />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
