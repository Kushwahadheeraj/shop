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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subtitle: "",
    link: "",
    buttonText: "",
    backgroundColor: "#f3f4f6",
    contentPosition: "left",
    verticalAlign: "center",
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/fashionbanner`;

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/get');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const responseData = await res.json();
      
      let itemsArray = [];
      if (responseData.success && responseData.data) {
        itemsArray = responseData.data;
      } else if (Array.isArray(responseData)) {
        itemsArray = responseData;
      }
      
      setItems(itemsArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete/' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchItems(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting item:', err);
    }
  };

  const handleAddNew = () => {
    router.push("/dashboard/app/ProductAdd/Home/FashionBanner");
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete._id);
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const openEditDialog = (item) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || "",
      subtitle: item.subtitle || "",
      link: item.link || "",
      buttonText: item.buttonText || "",
      backgroundColor: item.backgroundColor || "#f3f4f6",
      contentPosition: item.contentPosition || "left",
      verticalAlign: item.verticalAlign || "center",
    });
    setEditFile(null);
    setEditPreview(item.image || null);
    setEditError("");
    setEditDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditPreview(URL.createObjectURL(file));
      setEditError("");
    }
  };

  const handleEditRemovePhoto = () => {
    setEditFile(null);
    setEditPreview(editingItem ? editingItem.image || null : null);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingEdit(true);
    setEditError("");
    try {
      const data = new FormData();
      data.append("title", editForm.title);
      data.append("subtitle", editForm.subtitle);
      data.append("link", editForm.link);
      data.append("buttonText", editForm.buttonText);
      data.append("backgroundColor", editForm.backgroundColor);
      data.append("contentPosition", editForm.contentPosition);
      data.append("verticalAlign", editForm.verticalAlign);
      if (editFile) {
        data.append("image", editFile);
      }

      const res = await fetch(API_URL + "/update/" + editingItem._id, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to update banner");
      }

      await fetchItems();
      setEditDialogOpen(false);
      setEditingItem(null);
      setEditFile(null);
      setEditPreview(null);
    } catch (err) {
      setEditError(err.message || "Error updating banner");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fashion Banners</h1>
            <p className="text-sm text-gray-500">Manage your fashion banner items</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button 
            onClick={fetchItems} 
            variant="outline" 
            className="gap-2 border-gray-200 hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={handleAddNew} 
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Banner
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white border-gray-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredItems.length} items
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Button Text</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
                      <p>Loading banners...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                    No banners found. Click "Add New Banner" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                    <TableCell className="text-gray-500">{item.subtitle}</TableCell>
                    <TableCell className="text-gray-500 font-mono text-xs truncate max-w-[150px]">
                      {item.link || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {item.buttonText}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" onClick={() => handleDeleteClick(item)}>
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
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete <span className="font-semibold text-gray-900">"{itemToDelete?.title}"</span>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Fashion Banner</DialogTitle>
            <DialogDescription>
              Update text, background and layout. Upload a new image if needed.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEditSave}>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <Input
                name="subtitle"
                value={editForm.subtitle}
                onChange={handleEditChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Link</label>
              <Input
                name="link"
                value={editForm.link}
                onChange={handleEditChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <Input
                name="buttonText"
                value={editForm.buttonText}
                onChange={handleEditChange}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="backgroundColor"
                  value={editForm.backgroundColor}
                  onChange={handleEditChange}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer bg-transparent"
                />
                <Input
                  name="backgroundColor"
                  value={editForm.backgroundColor}
                  onChange={handleEditChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Image Position</label>
                <select
                  name="contentPosition"
                  value={editForm.contentPosition}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="left">Image Left, Text Right</option>
                  <option value="right">Image Right, Text Left</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-1">Vertical Align</label>
                <select
                  name="verticalAlign"
                  value={editForm.verticalAlign}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                >
                  <option value="start">Top</option>
                  <option value="center">Center</option>
                  <option value="end">Bottom</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Banner Image</label>
              <div className="flex items-center justify-center w-full">
                {!editPreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Sparkles className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleEditFile} />
                  </label>
                ) : (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden group border border-gray-200">
                    <img src={editPreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleEditRemovePhoto}
                      >
                        Remove Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {editError && (
              <p className="text-sm text-red-500">{editError}</p>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false);
                  setEditingItem(null);
                  setEditFile(null);
                  setEditPreview(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
