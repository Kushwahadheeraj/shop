"use client";
import React, { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ProductView({ api, id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (id && api) fetchProduct();
    // eslint-disable-next-line
  }, [id, api]);

  const fetchProduct = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/${api}/getOne/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      setProduct(data);
      setEditForm(data);
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

  const handleEditSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/${api}/update:${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update product");
      await fetchProduct();
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
      const res = await fetch(`${API_BASE_URL}/${api}/delete:${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setDeleteOpen(false);
      // Optionally redirect or show a message
      setProduct(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-8 text-center">Product not found.</div>;

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {product.name} <span className="text-muted-foreground text-sm">({api})</span>
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">Category: {product.category}</div>
        <div className="mb-2">Price: {product.fixPrice}</div>
        <div className="mb-2">Discount: {product.discount}</div>
        <div className="mb-2">Discount Price: {product.discountPrice}</div>
        <div className="mb-2">Total Product: {product.totalProduct}</div>
        <div className="mb-2">Description: {product.description}</div>
        <div className="mb-2">Tags: {product.tags && product.tags.join(', ')}</div>
        <div className="flex flex-row gap-2 flex-wrap mb-2">
          {product.photos && product.photos.map((url, idx) => (
            <img key={idx} src={url} alt="photo" className="w-16 h-16 object-cover rounded" />
          ))}
        </div>
        <div className="mb-2">Created At: {product.createdAt}</div>
        <div className="mb-2">Updated At: {product.updatedAt}</div>
      </CardContent>
      <CardFooter>
        {/* Optionally add more actions or info here */}
      </CardFooter>

      {/* Edit Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="max-w-md w-full">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
          </SheetHeader>
          {editForm && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleEditSave(); }}>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input name="name" value={editForm.name || ""} onChange={handleEditChange} required />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input name="category" value={editForm.category || ""} onChange={handleEditChange} />
              </div>
              <div>
                <Label htmlFor="fixPrice">Price</Label>
                <Input name="fixPrice" value={editForm.fixPrice || ""} onChange={handleEditChange} type="number" />
              </div>
              <div>
                <Label htmlFor="discount">Discount</Label>
                <Input name="discount" value={editForm.discount || ""} onChange={handleEditChange} type="number" />
              </div>
              <div>
                <Label htmlFor="discountPrice">Discount Price</Label>
                <Input name="discountPrice" value={editForm.discountPrice || ""} onChange={handleEditChange} type="number" />
              </div>
              <div>
                <Label htmlFor="totalProduct">Total Product</Label>
                <Input name="totalProduct" value={editForm.totalProduct || ""} onChange={handleEditChange} type="number" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea name="description" value={editForm.description || ""} onChange={handleEditChange} />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input name="tags" value={Array.isArray(editForm.tags) ? editForm.tags.join(", ") : (editForm.tags || "")} onChange={e => setEditForm(prev => ({ ...prev, tags: e.target.value.split(",").map(t => t.trim()) }))} />
              </div>
              <SheetFooter>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
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
            <div className="text-lg font-semibold mb-4">Delete Product</div>
            <div className="mb-6">Are you sure you want to delete <span className="font-bold">{product.name}</span>? This action cannot be undone.</div>
            <div className="flex gap-2 justify-end">
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</Button>
              <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
            </div>
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </div>
      )}
    </Card>
  );
}
