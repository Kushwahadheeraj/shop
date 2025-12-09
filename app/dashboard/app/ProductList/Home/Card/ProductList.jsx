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
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/card`;

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
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
      let cardsArray = [];
      if (responseData.success && responseData.data) {
        cardsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        cardsArray = responseData;
      } else if (responseData.cards) {
        cardsArray = responseData.cards;
      }
      
      setCards(cardsArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cards:', err);
      setCards([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card) => {
    router.push("/ProductAdd/Home/Card?id=" + card._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete/' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchCards(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting card:', err);
    }
  };

  const handleView = (card) => {
    router.push(`/ProductView/home/card/${card._id}`);
  };

  const handleAddNew = () => {
    router.push("/ProductAdd/Home/Card");
  };

  const handleDeleteClick = (card) => {
    setCardToDelete(card);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (cardToDelete) {
      handleDelete(cardToDelete._id);
    }
    setDeleteDialogOpen(false);
    setCardToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Filter cards based on search term
  const filteredCards = cards.filter(card => 
    card.mainText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4 sm:p-6">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading cards...</p>
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
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Card Management</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">View and manage all products</p>
      </div>

    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg sm:text-xl">Card Management</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={fetchCards}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Card
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
                onClick={fetchCards}
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
                placeholder="Search cards by main text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Showing {filteredCards.length} of {cards.length} cards
            </div>
          </div>
          
          {/* Cards Table */}
          <div className="overflow-x-auto responsive-table-container">
            <Table className="responsive-table">
              <TableHeader className="responsive-table-header">
                <TableRow className="responsive-table-row">
                  <TableHead className="responsive-table-cell col-name">Main Text</TableHead>
                  <TableHead className="responsive-table-cell col-image">Image</TableHead>
                  <TableHead className="responsive-table-cell col-date">Created Date</TableHead>
                  <TableHead className="responsive-table-cell col-status">Status</TableHead>
                  <TableHead className="responsive-table-cell col-actions text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCards.length === 0 ? (
                  <TableRow className="responsive-table-row">
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500 responsive-table-cell">
                      {searchTerm ? 'No cards found matching your search' : (
                        <div className="text-center">
                          <div className="text-lg font-medium mb-2">No cards found</div>
                          <div className="text-sm text-gray-400 mb-4">Start by adding your first card</div>
                          <Button onClick={handleAddNew} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add First Card
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCards.map((card) => (
                    <TableRow key={card._id} className="hover:bg-gray-50 responsive-table-row">
                      <TableCell className="responsive-table-cell col-name">
                        <div className="content-height-limit">
                          <div className="font-semibold text-truncate-tooltip" title={card.mainText}>{card.mainText}</div>
                          <div className="text-xs text-gray-500">ID: {card._id}</div>
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-image">
                        <div className="content-height-limit">
                          {card.image ? (
                            <div className="flex items-center">
                              <img 
                                src={card.image} 
                                alt={card.mainText} 
                                className="w-16 h-16 object-cover rounded border flex-shrink-0"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs">No Image</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="responsive-table-cell col-date text-sm text-gray-500">
                        <div className="content-height-limit text-truncate-tooltip" title={formatDate(card.createdAt)}>
                          {formatDate(card.createdAt)}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(card)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(card)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(card)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{cardToDelete?.mainText}"? This action cannot be undone.
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
  );
}