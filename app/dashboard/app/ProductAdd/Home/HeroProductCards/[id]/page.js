"use client";
import ProductForm from "../ProductForm.jsx";
import { useParams } from "next/navigation";

export default function HeroProductCardsEditPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="space-y-6">
      <ProductForm productId={id} />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
