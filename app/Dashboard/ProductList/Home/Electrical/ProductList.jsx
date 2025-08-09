"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Search, Eye, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/electrical`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('API URL:', API_URL + '/get');
      const res = await fetch(API_URL + '/get');
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      console.log('Response data:', data);
      console.log('Data type:', typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const responseData = await res.json();
      console.log('API Response:', responseData); // Debug log
      
      // Handle the response format: {"success":true,"count":0,"data":[]}
      let productsArray = [];
      if (responseData.success && responseData.data) {
        productsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        productsArray = responseData;
      } else if (responseData.products) {
        productsArray = responseData.products;
      }
      
      setProducts(productsArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    router.push("/Dashboard/ProductAdd/Home/Electrical?id=" + product._id);
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = `${API_URL}/delete/${id}`;
      console.log('Delete URL:', deleteUrl);
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
    router.push(`/Dashboard/ProductView/home/electrical/${product._id}`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Home/Electrical");
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price ? `₹${parseFloat(price).toFixed(2)}` : 'N/A';
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading electrical products...</p>
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
              <CardTitle>Home Electrical Products</CardTitle>
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
              <p className="text-red-600">Error loading products: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchProducts}
                className="mt-2"
              >
                Retry Loading
              </Button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products, categories, brands, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Custom Table for Electrical Products */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No products found. Please check your connection or try refreshing. matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No electrical products found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first electrical product</div>
                          <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        {product.category || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {product.brand || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
                          {product.originalPrice && product.originalPrice !== product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                          {product.discount && product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.tags && product.tags.length > 0 ? (
                            product.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No tags</span>
                          )}
                          {product.tags && product.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive !== false ? "default" : "destructive"}>
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(product)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(product._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the product "{product.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}