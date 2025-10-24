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

  const API_URL = `${API_BASE_URL}/home/producttools`;

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
      console.log('Response headers:', res.headers);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const responseData = await res.json();
      console.log('API Response:', responseData); // Debug log
      console.log('Response data type:', typeof responseData);
      console.log('Response data keys:', Object.keys(responseData || {}));
      
      // Handle the response format: {"success":true,"count":0,"data":[]}
      let productsArray = [];
      if (responseData.success && responseData.data) {
        productsArray = responseData.data;
        console.log('Using success.data path, found products:', productsArray.length);
      } else if (Array.isArray(responseData)) {
        productsArray = responseData;
        console.log('Using direct array path, found products:', productsArray.length);
      } else if (responseData.products) {
        productsArray = responseData.products;
        console.log('Using products path, found products:', productsArray.length);
      } else {
        console.log('No recognized data structure found in response');
        console.log('Available keys:', Object.keys(responseData || {}));
      }
      
      console.log('Processed products array:', productsArray); // Debug log
      if (productsArray.length > 0) {
        console.log('First product:', productsArray[0]);
        console.log('First product images:', productsArray[0].images);
      } else {
        console.log('No products found in the array');
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
    router.push("/Dashboard/ProductAdd/Home/ProductTools?id=" + product._id);
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
    router.push(`/Dashboard/ProductView/home/productTools/${product._id}`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Home/ProductTools");
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
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading product tools...</p>
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
              <CardTitle>Product Tools</CardTitle>
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
                Add New Product Tool
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
                placeholder="Search by name, category, description, brand, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Product Tools Table */}
          <div className="overflow-x-auto responsive-table-container">
            <Table className="responsive-table">
              <TableHeader className="responsive-table-header">
                <TableRow className="responsive-table-row">
                  <TableHead className="responsive-table-cell col-image">Images</TableHead>
                  <TableHead className="responsive-table-cell col-name">Name</TableHead>
                  <TableHead className="responsive-table-cell col-category">Category</TableHead>
                  <TableHead className="responsive-table-cell col-brand">Brand</TableHead>
                  <TableHead className="responsive-table-cell col-price">Price Range</TableHead>
                  <TableHead className="responsive-table-cell col-price">Current Price</TableHead>
                  <TableHead className="responsive-table-cell col-variants">Variants</TableHead>
                  <TableHead className="responsive-table-cell col-tags">Tags</TableHead>
                  <TableHead className="responsive-table-cell col-rating">Rating</TableHead>
                  <TableHead className="responsive-table-cell col-status">Status</TableHead>
                  <TableHead className="responsive-table-cell col-date">Created Date</TableHead>
                  <TableHead className="responsive-table-cell col-actions text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow className="responsive-table-row">
                    <TableCell colSpan={12} className="text-center py-8 text-gray-500 responsive-table-cell">
                      {searchTerm ? 'No product tools found matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No product tools found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first product tool</div>
                          <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Product Tool
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id} className="hover:bg-gray-50 responsive-table-row">
                      <TableCell className="responsive-table-cell col-image">
                        <div className="content-height-limit">
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
                                    className="w-12 h-12 object-cover rounded border flex-shrink-0"
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
                      <TableCell className="responsive-table-cell col-name">
                        <div className="content-height-limit">
                          <div className="font-medium text-truncate-tooltip" title={product.name}>{product.name}</div>
                          {product.description && (
                            <div className="text-xs text-gray-500 line-clamp-2" title={product.description}>
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
                          {product.minPrice && product.maxPrice ? (
                            <div className="text-sm text-truncate-tooltip" title={`${formatPrice(product.minPrice)} - ${formatPrice(product.maxPrice)}`}>
                              {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)}
                            </div>
                          ) : product.minPrice ? (
                            <div className="text-sm text-truncate-tooltip" title={`From ${formatPrice(product.minPrice)}`}>From {formatPrice(product.minPrice)}</div>
                          ) : product.maxPrice ? (
                            <div className="text-sm text-truncate-tooltip" title={`Up to ${formatPrice(product.maxPrice)}`}>Up to {formatPrice(product.maxPrice)}</div>
                          ) : (
                            <span className="text-gray-400 text-sm">No range</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-price">
                        <div className="space-y-1 content-height-limit">
                          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
                          {product.discount && product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {product.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-variants">
                        <div className="flex items-center gap-2 content-height-limit">
                          <Package className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <div className="text-sm min-w-0">
                            {product.variants && product.variants.length > 0 ? (
                              <div>
                                <div className="font-medium">{product.variants.length} variants</div>
                                <div className="text-xs text-gray-500 text-truncate-tooltip" title={product.variants.slice(0, 2).map(v => v.variantName).join(', ')}>
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
                      <TableCell className="responsive-table-cell col-tags">
                        <div className="flex flex-wrap gap-1 content-height-limit">
                          {product.tags && product.tags.length > 0 ? (
                            <>
                              {product.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs badge-truncate" title={tag}>
                                  {tag}
                                </Badge>
                              ))}
                              {product.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{product.tags.length - 2} more
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm">No tags</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-rating">
                        <div className="flex items-center gap-2 content-height-limit">
                          <span className="text-sm font-medium">{formatRating(product.rating)}</span>
                          {product.rating > 0 && (
                            <div className="flex flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(product.rating) 
                                      ? 'text-yellow-300 fill-current' 
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
                      <TableCell className="responsive-table-cell col-status">
                        <Badge variant={product.isActive !== false ? "default" : "destructive"}>
                          {product.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-date">
                        <div className="text-sm text-truncate-tooltip content-height-limit" title={formatDate(product.createdAt)}>
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
                                  This action cannot be undone. This will permanently delete the product tool "{product.name}".
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