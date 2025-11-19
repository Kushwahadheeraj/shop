"use client";
import { useParams } from "next/navigation";
import ProductView from "@/components/ProductView";

export default function HomeElectricalViewPage() {
  const { id } = useParams();
  return <ProductView api="home/electrical" id={id} />;
}


