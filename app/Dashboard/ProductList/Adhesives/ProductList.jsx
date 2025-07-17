"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/adhesives`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch(API_URL + '/get');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const handleEdit = (product) => {
    router.push("/Dashboard/ProductAdd/Adhesives?id=" + product._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    await fetch(API_URL + '/delete:' + id, { method: "DELETE" });
    fetchProducts();
  };

  const handleView = (product) => {
    router.push(`/Dashboard/ProductView/adhesives/${product._id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Adhesives Product List</h1>
      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
}
