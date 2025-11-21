"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Search, Eye, Edit, Trash2, Image } from "lucide-react";
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
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const API_URL = `${API_BASE_URL}/home/paints`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/get`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    router.push("/ProductAdd/Home/Paints?id=" + product._id);
  };

  const handleDelete = async (id) => {
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
    router.push(`/ProductView/home/paints/${product._id}`);
  };

  const handleAddNew = () => {
    router.push("/ProductAdd/Home/Paints");
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
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    product.colors?.some(color => color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading paint products...</p>
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
              <CardTitle>Home Paints</CardTitle>
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
                Add New Paint
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
                placeholder="Search by name, category, brand, tags, or colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Custom Table for Paints */}
          <div className="border rounded-lg overflow-x-auto responsive-table-container">
            <Table className="responsive-table">
              <TableHeader className="responsive-table-header">
                <TableRow className="responsive-table-row">
                  <TableHead className="responsive-table-cell col-image">Images</TableHead>
                  <TableHead className="responsive-table-cell col-name">Name</TableHead>
                  <TableHead className="responsive-table-cell col-category">Category</TableHead>
                  <TableHead className="responsive-table-cell col-brand">Brand</TableHead>
                  <TableHead className="responsive-table-cell col-price">Price</TableHead>
                  <TableHead className="responsive-table-cell col-variants">Colors</TableHead>
                  <TableHead className="responsive-table-cell col-tags">Tags</TableHead>
                  <TableHead className="responsive-table-cell col-status">Status</TableHead>
                  <TableHead className="responsive-table-cell col-date">Created Date</TableHead>
                  <TableHead className="responsive-table-cell col-actions text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No paint products found matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No paint products found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first paint product</div>
                          <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Paint
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id} className="responsive-table-row">
                      <TableCell className="responsive-table-cell col-image">
                        <div className="relative content-height-limit">
                          {product.images && product.images.length > 0 ? (
                            <>
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border flex-shrink-0"
                              />
                              {product.images.length > 1 && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  +{product.images.length - 1}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                              <Image className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium responsive-table-cell col-name">
                        <div className="max-w-xs content-height-limit">
                          <div className="font-medium text-truncate-tooltip" title={product.name}>{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 line-clamp-2 text-truncate-tooltip" title={product.description}>
                              {product.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-category">
                        <div className="text-truncate-tooltip content-height-limit" title={product.category || 'N/A'}>
                          {product.category || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-brand">
                        <div className="text-truncate-tooltip content-height-limit" title={product.brand || 'N/A'}>
                          {product.brand || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-price">
                        <div className="space-y-1 content-height-limit">
                          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
                          {product.discountPrice && product.discountPrice !== product.price && (
                            <div className="text-xs text-gray-500 line-through">
                              {formatPrice(product.originalPrice || product.price)}
                            </div>
                          )}
                          {product.discount && product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-variants">
                        <div className="flex flex-wrap gap-1 max-w-32 content-height-limit">
                          {product.colors && product.colors.length > 0 ? (
                            product.colors.slice(0, 2).map((color, index) => (
                              <Badge key={index} variant="outline" className="text-xs badge-truncate" title={color}>
                                {color}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No colors</span>
                          )}
                          {product.colors && product.colors.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.colors.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-tags">
                        <div className="flex flex-wrap gap-1 max-w-32 content-height-limit">
                          {product.tags && product.tags.length > 0 ? (
                            product.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs badge-truncate" title={tag}>
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No tags</span>
                          )}
                          {product.colors && product.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-status">
                        <Badge variant={product.isActive !== false ? "default" : "destructive"}>
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-date">
                        <div className="text-truncate-tooltip content-height-limit" title={formatDate(product.createdAt)}>
                          {formatDate(product.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right responsive-table-cell col-actions">
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
                                  This action cannot be undone. This will permanently delete the paint product "{product.name}".
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