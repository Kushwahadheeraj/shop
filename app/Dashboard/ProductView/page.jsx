"use client";
import { useSearchParams } from "next/navigation";
import ProductView from "@/components/ProductView";

export default function ProductViewPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const api = searchParams.get("api");
  return <ProductView id={id} api={api} />;
}
