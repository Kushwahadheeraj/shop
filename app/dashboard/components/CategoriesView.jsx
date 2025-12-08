"use client";
import React, { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoriesView({ id }) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    if (id) fetchCategory();
    // eslint-disable-next-line
  }, [id]);

  const fetchCategory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/home/categories/getOne/${id}`);
      if (!res.ok) throw new Error("Failed to fetch category");
      const data = await res.json();
      setCategory(data.data || data);
      setEditForm(data.data || data);
      setEditItems(data.data?.items || data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding new item in edit mode
  const handleAddEditItem = () => {
    if (newItem.trim() && !editItems.includes(newItem.trim())) {
      setEditItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  // Handle removing item in edit mode
  const handleRemoveEditItem = (itemToRemove) => {
    setEditItems(prev => prev.filter(item => item !== itemToRemove));
  };

  // Handle Enter key for adding items in edit mode
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEditItem();
    }
  };

  const handleEditSave = async () => {
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      
      // Add each item separately
      editItems.forEach(item => {
        formData.append('items', item);
      });

      const res = await fetch(`${API_BASE_URL}/home/categories/update/${id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to update category");
      await fetchCategory();
      setEditOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/home/categories/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      setDeleteOpen(false);
      router.push('/ProductList/Home/Categories');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-2">Loading category...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-center">
      <div className="text-red-500 mb-4">{error}</div>
      <Button onClick={fetchCategory} variant="outline">Try Again</Button>
    </div>
  );
  
  if (!category) return (
    <div className="p-8 text-center">
      <p className="text-gray-500 mb-4">Category not found.</p>
      <Button onClick={() => router.push('/ProductList/Home/Categories')} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Categories
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/ProductList/Home/Categories')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl">
              {category.name}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Image */}
          {category.image && (
            <div>
              <Label className="text-sm font-medium">Category Image</Label>
              <div className="mt-2">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <Label className="text-sm font-medium">Items</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {category.items && category.items.length > 0 ? (
                category.items.map((item, index) => (
                  <Badge key={index} variant="secondary">
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-400">No items</span>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <Label className="text-sm font-medium">Created At</Label>
              <p>{formatDate(category.createdAt)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Updated At</Label>
              <p>{formatDate(category.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
          </SheetHeader>
          {editForm && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input 
                  name="name" 
                  value={editForm.name || ""} 
                  onChange={handleEditChange} 
                  required 
                />
              </div>
              
              <div>
                <Label>Items</Label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    value={newItem} 
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add item" 
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddEditItem}
                    disabled={!newItem.trim()}
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Display edit items */}
                {editItems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editItems.map((item, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveEditItem(item)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <SheetFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                  Cancel
                </Button>
              </SheetFooter>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 max-w-sm w-full">
            <div className="text-lg font-semibold mb-4">Delete Category</div>
            <div className="mb-6">
              Are you sure you want to delete <span className="font-bold">{category.name}</span>? 
              This action cannot be undone.
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
              <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
                Cancel
              </Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 