"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { RefreshCw, Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/sanitary/kitchen-bathroom-jali`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/get');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    router.push(`/ProductAdd/Sanitary/KitchenBathroomJali?id=${product._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const deleteUrl = `${API_URL}/delete/${id}`;
      const res = await fetch(deleteUrl, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      alert('Product deleted successfully!');
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(`Error deleting product: ${err.message}`);
      setError(err.message);
    }
  };

  const handleView = (product) => {
    // Placeholder for view functionality
    console.log("View product:", product);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading products... Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Kitchen/Bathroom Jali Products</h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-50">View and manage all Kitchen/Bathroom Jali products</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <Card>
           <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            category="Kitchen/Bathroom Jali Products"
          />
        </Card>
      </div>
    </div>
  );
}
