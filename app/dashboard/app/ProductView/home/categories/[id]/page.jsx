"use client";
import { useParams } from "next/navigation";
import CategoriesView from "@/components/CategoriesView";

export default function CategoriesViewPage() {
  const { id } = useParams();
  return <CategoriesView id={id} />;
} 