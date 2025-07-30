"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, ArrowLeft } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/sanitary/essess/quadra`;

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
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    router.push("/Dashboard/ProductAdd/Sanitary/Essess/Quadra?id=" + product._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete:' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  const handleView = (product) => {
    router.push(`/Dashboard/ProductView/sanitary/essess/quadra/${product._id}`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Sanitary/Essess/Quadra");
  };

  
  const handleBackToParent = () => {
    router.push("/Dashboard/ProductList/Sanitary/Essess");
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              <Button 
                variant="outline" 
                onClick={handleBackToParent}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Essess
              </Button>
              <CardTitle>Sanitary - Essess - Quadra Products</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchProducts}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchProducts}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            category="Sanitary - Essess - Quadra Products"
          />
        </CardContent>
      </Card>
    </div>
  );
}