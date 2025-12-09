"use client";
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

const categories = ["Surface Cleaner", "Toilet Cleaner", "Glass Cleaner"];

export default function ProductForm({ product, onSave }) {
  const [form, setForm] = useState(product || {
    name: '',
    price: '',
    discount: '',
    fixPrice: '',
    minPrice: '',
    maxPrice: '',
    minPrice: '',
    maxPrice: '',
    minPrice: '',
    maxPrice: '',
    totalProduct: '',
    sku: 'N/A',
    category: 'Cleaning',
    tags: [],
    description: '',
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };
    if ((name === 'price' || name === 'discount') && updatedForm.price && updatedForm.discount) {
      const price = parseFloat(updatedForm.price);
      const discount = parseFloat(updatedForm.discount);
      if (!isNaN(price) && !isNaN(discount)) {
        updatedForm.fixPrice = (price - (price * discount / 100)).toFixed(2);
      } else {
        updatedForm.fixPrice = '';
      }
    }
    setForm(updatedForm);
  };

  const handleFiles = e => {
    let selected = Array.from(e.target.files);
    let newFiles = [...files, ...selected];
    // Remove duplicates by name+size
    newFiles = newFiles.filter(
      (file, idx, arr) =>
        arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
    );
    if (newFiles.length > 5) {
      setPhotoError("You can upload up to 5 photos only.");
      newFiles = newFiles.slice(0, 5);
    } else {
      setPhotoError("");
    }
    setFiles(newFiles);
    setPreview(newFiles.map(file => URL.createObjectURL(file)));
  };

  const handleRemovePhoto = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreview(newPreview);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tags => tags !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    const formToSubmit = { ...form };
    const data = new FormData();
    Object.entries(formToSubmit).forEach(([k, v]) => {
      if (k === 'tags') {
        v.forEach(val => data.append('tags', val));
      } else {
        data.append(k, v);
      }
    });
    files.forEach(f => data.append('photos', f));
    const res = await fetch(`${API_BASE_URL}/cleaning/create`, { method: 'POST', body: data });
    if (res.ok) {
      if (onSave) onSave();
    }
  };

  // Check if all required fields (except SKU and Category) are filled
  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (!form.price || isNaN(Number(form.price))) return false;
    if (form.discount === '' || isNaN(Number(form.discount))) return false;
    if (form.fixPrice === '' || isNaN(Number(form.fixPrice))) return false;
    if (!form.totalProduct || isNaN(Number(form.totalProduct))) return false;
    if (!form.tags || !Array.isArray(form.tags) || form.tags.length === 0) return false;
    if (!form.description.trim()) return false;
    if (!files || files.length === 0) return false;
    return true;
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Cleaning Product</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Price</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Fix Price (auto)</label>
          <Input name="fixPrice" type="number" value={form.fixPrice} readOnly placeholder="Fix Price (auto)" className="bg-gray-100 focus:ring-amber-300 focus:border-amber-500 text-sm sm:text-base" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Min Price (optional)</label>
          <Input name="minPrice" type="number" value={form.minPrice} onChange={handleChange} placeholder="Min Price" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Max Price (optional)</label>
          <Input name="maxPrice" type="number" value={form.maxPrice} onChange={handleChange} placeholder="Max Price" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">SKU</label>
          <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Photos <span className="text-xs text-gray-400">(1-5 allowed)</span></label>
          <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
          {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
          {preview.length > 0 && (
            <div className="flex flex-row gap-2 sm:gap-3 mt-2 flex-wrap">
              {preview.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Description</label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Tags (Add custom tags)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tags.map((t) => (
              <span key={t} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-blue-500 hover:text-blue-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
            {form.tags.length === 0 && <span className="text-gray-400 text-xs">No tags added</span>}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a tags and press Enter or click Add"
              className="flex-1"
            />
            <Button 
              type="button" 
              onClick={handleAddTag}
              disabled={!newTag.trim() || form.tags.includes(newTag.trim())}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add
            </Button>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg" disabled={!isFormValid()}>Create Product</Button>
    </form>
    </div>
  );
} 

