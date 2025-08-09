"use client";
import { useParams } from "next/navigation";
import ProductView from "@/components/ProductView";

export default function HomePaintsViewPage() {
  const { id } = useParams();
  return <ProductView api="home/paints" id={id} />;
}


