"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCw, Search, MoreHorizontal, Eye, Edit, Trash2 , Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/brands`;

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/get');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const responseData = await res.json();
       // Debug log
      
      // Handle the response format: {"success":true,"count":0,"data":[]}
      let brandsArray = [];
      if (responseData.success && responseData.data) {
        brandsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        brandsArray = responseData;
      } else if (responseData.brands) {
        brandsArray = responseData.brands;
      }
      
      setBrands(brandsArray);
    } catch (err) {
      setError(err.message);
      setBrands([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    router.push("/ProductAdd/Home/Brands?id=" + brand._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete/' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchBrands(); // Refresh the list
    } catch (err) {
      setError(err.message);
    }
  };

  const handleView = (brand) => {
    router.push(`/ProductView/home/brands/${brand._id}`);
  };

  const handleAddNew = () => {
    router.push("/ProductAdd/Home/Brands");
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (brandToDelete) {
      handleDelete(brandToDelete._id);
    }
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Filter brands based on search term
  const filteredBrands = brands.filter(brand => 
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && brands.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading brands...</p>
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Brands Management</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">View and manage all products</p>
      </div>

    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg sm:text-xl">Brands Management</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={fetchBrands}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Brand
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error loading products: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchBrands}
                className="mt-2"
              >
                Retry Loading
              </Button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search brands by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Showing {filteredBrands.length} of {brands.length} brands
            </div>
          </div>
          
          {/* Brands Table */}
          <div className="overflow-x-auto responsive-table-container">
            <Table className="responsive-table">
              <TableHeader className="responsive-table-header">
                <TableRow className="responsive-table-row">
                  <TableHead className="responsive-table-cell col-name">Brand Name</TableHead>
                  <TableHead className="responsive-table-cell col-logo">Logo</TableHead>
                  <TableHead className="responsive-table-cell col-date">Created Date</TableHead>
                  <TableHead className="responsive-table-cell col-status">Status</TableHead>
                  <TableHead className="responsive-table-cell col-actions text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.length === 0 ? (
                  <TableRow className="responsive-table-row">
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 responsive-table-cell">
                      {searchTerm ? 'No brands found matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No brands found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first brand</div>
                          <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Brand
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBrands.map((brand) => (
                    <TableRow key={brand._id} className="hover:bg-gray-50 responsive-table-row">
                      <TableCell className="font-medium responsive-table-cell col-name">
                        <div className="content-height-limit">
                          <div className="font-semibold text-truncate-tooltip" title={brand.name}>{brand.name}</div>
                          <div className="text-xs text-gray-500 text-truncate-tooltip" title={`ID: ${brand._id}`}>ID: {brand._id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-logo">
                        <div className="content-height-limit">
                          {brand.logo ? (
                            <div className="flex items-center">
                              <img 
                                src={brand.logo} 
                                alt={brand.name} 
                                className="w-12 h-12 object-cover rounded border flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">No Logo</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500 responsive-table-cell col-date">
                        <div className="content-height-limit">
                          <div className="text-truncate-tooltip" title={formatDate(brand.createdAt)}>
                            {formatDate(brand.createdAt)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-status">
                        <Badge variant="default">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right responsive-table-cell col-actions">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(brand)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(brand)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(brand)}
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
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{brandToDelete?.name}&quot;? This action cannot be undone.
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
    </div>
    </div>
  );
}