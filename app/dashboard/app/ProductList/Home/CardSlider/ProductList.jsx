"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, Search, Eye, Edit, Trash2 , Sparkles } from "lucide-react";
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
  const [cardSliders, setCardSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/cardSlider`;

  useEffect(() => {
    fetchCardSliders();
  }, []);

  const fetchCardSliders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/get');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const responseData = await res.json();
      console.log('API Response:', responseData); // Debug log
      
      // Handle the response format: {"success":true,"count":0,"data":[]}
      let cardSlidersArray = [];
      if (responseData.success && responseData.data) {
        cardSlidersArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        cardSlidersArray = responseData;
      } else if (responseData.cardSliders) {
        cardSlidersArray = responseData.cardSliders;
      }
      
      setCardSliders(cardSlidersArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching card sliders:', err);
      setCardSliders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cardSlider) => {
    router.push("/ProductAdd/Home/CardSlider?id=" + cardSlider._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete/' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchCardSliders(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting card slider:', err);
    }
  };

  const handleView = (cardSlider) => {
    router.push(`/ProductView/home/cardSlider/${cardSlider._id}`);
  };

  const handleAddNew = () => {
    router.push("/ProductAdd/Home/CardSlider");
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

  // Filter card sliders based on search term
  const filteredCardSliders = cardSliders.filter(cardSlider =>
    cardSlider.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && cardSliders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading card sliders...</p>
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Home Card Slider Products</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">View and manage all products</p>
      </div>

    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg sm:text-xl">Home Card Slider Products</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={fetchCardSliders}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
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
                onClick={fetchCardSliders}
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
                placeholder="Search card sliders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Custom Table for Card Sliders */}
          <div className="border rounded-lg overflow-x-auto responsive-table-container">
            <Table className="responsive-table">
              <TableHeader className="responsive-table-header">
                <TableRow className="responsive-table-row">
                  <TableHead className="responsive-table-cell col-name">Name</TableHead>
                  <TableHead className="responsive-table-cell col-image">Image</TableHead>
                  <TableHead className="responsive-table-cell col-date">Created Date</TableHead>
                  <TableHead className="responsive-table-cell col-status">Status</TableHead>
                  <TableHead className="responsive-table-cell col-actions text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCardSliders.length === 0 ? (
                  <TableRow className="responsive-table-row">
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 responsive-table-cell">
                      {searchTerm ? 'No card sliders found matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No card sliders found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first card slider</div>
                          <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Card Slider
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCardSliders.map((cardSlider) => (
                    <TableRow key={cardSlider._id} className="responsive-table-row">
                      <TableCell className="responsive-table-cell col-name font-medium">
                        <div className="content-height-limit">
                          <div className="text-truncate-tooltip" title={cardSlider.name}>{cardSlider.name}</div>
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-image">
                        <div className="content-height-limit">
                          {cardSlider.image && (
                            <img 
                              src={cardSlider.image} 
                              alt={cardSlider.name}
                              className="w-12 h-12 object-cover rounded border flex-shrink-0"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-date">
                        <div className="content-height-limit text-truncate-tooltip" title={formatDate(cardSlider.createdAt)}>
                          {formatDate(cardSlider.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-status">
                        <div className="content-height-limit">
                          <Badge variant="default">
                            Active
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-actions text-right">
                        <div className="content-height-limit">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleView(cardSlider)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(cardSlider)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteClick(cardSlider._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the card slider "{cardSlider.name}".
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
    </div>
  );
} 