"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Search, Eye, Edit, Trash2, Image, Package } from "lucide-react";
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

  const API_URL = `${API_BASE_URL}/home/popularProducts`;

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
      
      console.log('Processed products array:', productsArray); // Debug log
      if (productsArray.length > 0) {
        console.log('First product images:', productsArray[0].images); // Debug log
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
    router.push("/Dashboard/ProductAdd/Home/PopularProducts?id=" + product._id);
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
    router.push(`/Dashboard/ProductView/home/popularProducts/${product._id}`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Home/PopularProducts");
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

  const formatRating = (rating) => {
    return rating ? `${parseFloat(rating).toFixed(1)}/5` : 'N/A';
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading popular products...</p>
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
              <CardTitle>Popular Products</CardTitle>
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
                placeholder="Search by name, category, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Custom Table for Popular Products */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Images</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No popular products found matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No popular products found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first popular product</div>
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
                        <div className="relative">
                          {(() => {
                            // Handle both old 'image' and new 'images' field for backward compatibility
                            const productImages = product.images || (product.image ? [product.image] : []);
                            console.log('Rendering images for product:', product.name, 'Images:', productImages);
                            
                            if (productImages && productImages.length > 0) {
                              return (
                                <>
                                  <img 
                                    src={productImages[0]} 
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded border"
                                    onError={(e) => {
                                      console.error('Image failed to load:', productImages[0], e);
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                    onLoad={() => console.log('Image loaded successfully:', productImages[0])}
                                  />
                                  <div 
                                    className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center hidden"
                                    style={{ display: 'none' }}
                                  >
                                    <Image className="w-6 h-6 text-gray-400" />
                                  </div>
                                  {productImages.length > 1 && (
                                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                      +{productImages.length - 1}
                                    </div>
                                  )}
                                </>
                              );
                            } else {
                              return (
                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                                  <Image className="w-6 h-6 text-gray-400" />
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="max-w-xs">
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {product.minPrice && product.maxPrice ? (
                            <div className="text-sm">
                              {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
                            </div>
                          ) : product.minPrice ? (
                            <div className="text-sm">From {formatPrice(product.minPrice)}</div>
                          ) : product.maxPrice ? (
                            <div className="text-sm">Up to {formatPrice(product.maxPrice)}</div>
                          ) : (
                            <span className="text-gray-400 text-sm">No range</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
                          {product.discount && product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            {product.variants && product.variants.length > 0 ? (
                              <div>
                                <div className="font-medium">{product.variants.length} variants</div>
                                <div className="text-xs text-gray-500">
                                  {product.variants.slice(0, 2).map(v => v.variantName).join(', ')}
                                  {product.variants.length > 2 && ` +${product.variants.length - 2} more`}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">No variants</span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-32">
                          {product.tags && product.tags.length > 0 ? (
                            product.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm">No tags</span>
                          )}
                          {product.tags && product.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{product.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{formatRating(product.rating)}</span>
                          {product.rating > 0 && (
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.isActive !== false ? "default" : "destructive"}>
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(product.createdAt)}
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
                                  This action cannot be undone. This will permanently delete the popular product "{product.name}".
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