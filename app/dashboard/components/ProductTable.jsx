"use client";
import React, { useState, useMemo } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Removed shadcn/ui Select components - using native HTML select instead
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Search, Filter, Eye, Edit, Trash2, Calendar } from "lucide-react";
import ProductUpdateForm from "./ProductUpdateForm";

export default function ProductTable({ products, onEdit, onDelete, onView, category }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterDays, setFilterDays] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [updateProduct, setUpdateProduct] = useState(null);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Filter by days
      if (filterDays !== "all") {
        const productDate = new Date(product.createdAt || product.updatedAt);
        const now = new Date();
        const daysDiff = Math.floor((now - productDate) / (1000 * 60 * 60 * 24));
        
        switch (filterDays) {
          case "3days":
            if (daysDiff > 3) return false;
            break;
          case "7days":
            if (daysDiff > 7) return false;
            break;
          case "15days":
            if (daysDiff > 15) return false;
            break;
          case "30days":
            if (daysDiff > 30) return false;
            break;
        }
      }
      
      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === "minPrice" || sortBy === "maxPrice" || sortBy === "fixPrice" || sortBy === "discountPrice" || sortBy === "totalProduct") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [products, searchTerm, sortBy, sortOrder, filterDays]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDelete(productToDelete._id);
    }
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleUpdate = (updatedProduct) => {
    // Refresh the products list after update
    window.location.reload();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filterDays} 
              onChange={(e) => setFilterDays(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <option value="all">All Products</option>
              <option value="3days">Last 3 Days</option>
              <option value="7days">Last 7 Days</option>
              <option value="15days">Last 15 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>{category || "Products"} List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="responsive-table-container">
            <Table className="responsive-table">
              <TableHeader className="responsive-table-header">
                <TableRow className="responsive-table-row">
                  <TableHead 
                    className="responsive-table-cell col-name cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="responsive-table-cell col-image">Photos</TableHead>
                  {products.length > 0 && products[0].minPrice !== undefined && products[0].maxPrice !== undefined ? (
                    <>
                      <TableHead 
                        className="responsive-table-cell col-price cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("minPrice")}
                      >
                        Min Price {sortBy === "minPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead 
                        className="responsive-table-cell col-price cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("maxPrice")}
                      >
                        Max Price {sortBy === "maxPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                    </>
                  ) : products.length > 0 && products[0].fixPrice !== undefined ? (
                    <>
                      <TableHead 
                        className="responsive-table-cell col-price cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("fixPrice")}
                      >
                        Fix Price {sortBy === "fixPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead 
                        className="responsive-table-cell col-price cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort("discountPrice")}
                      >
                        Discount Price {sortBy === "discountPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                    </>
                  ) : (
                    <TableHead 
                      className="responsive-table-cell col-price cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort("fixPrice")}
                    >
                      Price {sortBy === "fixPrice" && (sortOrder === "asc" ? "↑" : "↓")}
                    </TableHead>
                  )}
                  <TableHead className="responsive-table-cell col-status">Discount</TableHead>
                  <TableHead 
                    className="responsive-table-cell col-status cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort("totalProduct")}
                  >
                    Stock {sortBy === "totalProduct" && (sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="responsive-table-cell col-category">Category</TableHead>
                  <TableHead className="responsive-table-cell col-tags">Tags</TableHead>
                  <TableHead className="responsive-table-cell col-date">Created</TableHead>
                  <TableHead className="responsive-table-cell col-actions text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.length === 0 ? (
                  <TableRow className="responsive-table-row">
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500 responsive-table-cell">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedProducts.map((product) => (
                    <TableRow key={product._id} className="hover:bg-gray-50 responsive-table-row">
                      <TableCell className="font-medium responsive-table-cell col-name">
                        <div className="content-height-limit">
                          <div className="text-truncate-tooltip" title={product.name}>{product.name}</div>
                          <div className="text-xs text-gray-500 text-truncate-tooltip" title={`SKU: ${product.sku || "N/A"}`}>SKU: {product.sku || "N/A"}</div>
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-image">
                        {product.photos && product.photos.length > 0 ? (
                          <div className="flex flex-row gap-1 flex-wrap content-height-limit">
                            {product.photos.slice(0, 3).map((url, idx) => (
                              <img 
                                key={idx} 
                                src={url} 
                                alt="product" 
                                className="w-10 h-10 object-cover rounded border flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            ))}
                            {product.photos.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.photos.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs">No Image</Badge>
                        )}
                      </TableCell>
                      {product.minPrice !== undefined && product.maxPrice !== undefined ? (
                        <>
                          <TableCell className="responsive-table-cell col-price text-truncate-tooltip" title={formatPrice(product.minPrice)}>{formatPrice(product.minPrice)}</TableCell>
                          <TableCell className="responsive-table-cell col-price text-truncate-tooltip" title={formatPrice(product.maxPrice)}>{formatPrice(product.maxPrice)}</TableCell>
                        </>
                      ) : product.fixPrice !== undefined ? (
                        <>
                          <TableCell className="responsive-table-cell col-price text-truncate-tooltip" title={formatPrice(product.fixPrice)}>{formatPrice(product.fixPrice)}</TableCell>
                          <TableCell className="responsive-table-cell col-price text-truncate-tooltip" title={formatPrice(product.discountPrice)}>{formatPrice(product.discountPrice)}</TableCell>
                        </>
                      ) : (
                        <TableCell className="responsive-table-cell col-price text-truncate-tooltip" title={formatPrice(product.fixPrice)}>{formatPrice(product.fixPrice)}</TableCell>
                      )}
                      <TableCell className="responsive-table-cell col-status">
                        {product.discount ? (
                          <Badge variant="destructive">{product.discount}%</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="responsive-table-cell col-status">
                        <Badge variant={product.totalProduct > 0 ? "default" : "destructive"}>
                          {product.totalProduct || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-category">
                        <Badge variant="outline" className="text-truncate-tooltip" title={product.category}>{product.category}</Badge>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-tags">
                        <div className="flex flex-wrap gap-1 content-height-limit">
                          {(product.tags || product.tag) && (product.tags || product.tag).length > 0 ? (
                            <>
                              {(product.tags || product.tag).slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs badge-truncate" title={tag}>
                                  {tag}
                                </Badge>
                              ))}
                              {(product.tags || product.tag).length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{(product.tags || product.tag).length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">No tags</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 responsive-table-cell col-date text-truncate-tooltip" title={formatDate(product.createdAt)}>
                        {formatDate(product.createdAt)}
                      </TableCell>
                      <TableCell className="text-right responsive-table-cell col-actions">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onView(product)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setUpdateProduct(product)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

             {/* Delete Confirmation Dialog */}
       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirm Delete</DialogTitle>
             <DialogDescription>
               Are you sure you want to delete &quot;{productToDelete?.name}&quot;? This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
               Cancel
             </Button>
             <Button variant="destructive" onClick={confirmDelete}>
               Delete
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>

       {/* Update Product Dialog */}
       {updateProduct && (
         <ProductUpdateForm
           product={updateProduct}
           category={category}
           onUpdate={handleUpdate}
           onClose={() => setUpdateProduct(null)}
         />
       )}
     </div>
   );
 } 