"use client";
import { useParams } from "next/navigation";
import ProductView from "@/components/ProductView";

export default function UniversalProductViewPage() {
  const { category, id } = useParams();
  return <ProductView api={category} id={id} />;
} 