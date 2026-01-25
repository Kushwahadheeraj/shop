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
import { Plus, RefreshCw, Search, MoreHorizontal, Trash2, Sparkles } from "lucide-react";
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
    name: "",
    subtitle: "",
    link: "",
  });
  const [editFile, setEditFile] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");
  const router = useRouter();

  const API_URL = `${API_BASE_URL}/home/furnituredeals`;

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + "/get");
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
      console.error("Error fetching items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + "/delete/" + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchItems();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting item:", err);
    }
  };

  const handleAddNew = () => {
    router.push("/dashboard/app/ProductAdd/Home/FurnitureDeals");
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
      name: item.name || "",
      subtitle: item.subtitle || "",
      link: item.link || "",
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
      data.append("name", editForm.name);
      data.append("subtitle", editForm.subtitle);
      data.append("link", editForm.link);
      if (editFile) {
        data.append("image", editFile);
      }

      const res = await fetch(API_URL + "/update/" + editingItem._id, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to update item");
      }

      await fetchItems();
      setEditDialogOpen(false);
      setEditingItem(null);
      setEditFile(null);
      setEditPreview(null);
    } catch (err) {
      setEditError(err.message || "Error updating item");
    } finally {
      setSavingEdit(false);
    }
  };

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sanitary Deals</h1>
            <p className="text-sm text-gray-500">Manage your Sanitary deals items</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button onClick={fetchItems} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button
            onClick={handleAddNew}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
          >
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item._id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      {item.subtitle && (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                          {item.subtitle}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-[200px] truncate">
                      {item.link || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => openEditDialog(item)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sanitary Deal</DialogTitle>
            <DialogDescription>
              Update the details of the selected sanitary deal.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle (Optional)</label>
              <Input
                name="subtitle"
                value={editForm.subtitle}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link (Optional)</label>
              <Input
                name="link"
                value={editForm.link}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image (Optional)</label>
              <Input type="file" accept="image/*" onChange={handleEditFile} />
              {editPreview && (
                <div className="mt-3">
                  <img
                    src={editPreview}
                    alt="Preview"
                    className="w-32 h-32 object-contain border rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleEditRemovePhoto}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
            {editError && (
              <p className="text-sm text-red-600">
                {editError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                disabled={savingEdit}
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
