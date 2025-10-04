"use client";
import ProductForm from "./ProductForm.jsx";
export default function CeilingRosesProductAddPage() {
  return <ProductForm />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;