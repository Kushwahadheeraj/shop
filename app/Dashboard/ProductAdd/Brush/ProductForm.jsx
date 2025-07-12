"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

const categories = ["Paint Brush", "Roller", "Artist Brush"];
const tagsList = ["Soft", "Hard", "Synthetic", "Natural"];

export default function ProductForm() {
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);
  const [description, setDescription] = useState("");
  const [fixPrice, setFixPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [photoError, setPhotoError] = useState("");

  // Auto-calculate discount price
  React.useEffect(() => {
    if (fixPrice && discount) {
      const dp = Math.max(Number(fixPrice) - Number(discount), 0);
      setDiscountPrice(dp);
    } else {
      setDiscountPrice("");
    }
  }, [fixPrice, discount]);

  // Handle photo selection
  const handleFiles = e => {
    let selected = Array.from(e.target.files);
    let newFiles = [...photos, ...selected];
    // Remove duplicates
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
    setPhotos(newFiles);
    setPreview(newFiles.map(file => URL.createObjectURL(file)));
  };

  // Remove photo
  const handleRemovePhoto = idx => {
    const newFiles = photos.filter((_, i) => i !== idx);
    setPhotos(newFiles);
    setPreview(newFiles.map(file => URL.createObjectURL(file)));
  };

  // Handle tag selection
  const handleTag = tag => {
    setTags(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  };

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    if (photos.length === 0) {
      setPhotoError("At least one photo is required.");
      return;
    }
    // For demo: skip actual upload, just send dummy URLs
    const photoUrls = photos.map((_, i) => `/uploads/brush/photo${i + 1}.jpg`);
    const payload = {
      name,
      photos: photoUrls,
      description,
      fixPrice,
      discount,
      discountPrice,
      totalProduct,
      category,
      tags,
    };
    const res = await fetch(`${API_BASE_URL}/brush-products/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      alert("Product created!");
      // Reset form
      setName(""); setPhotos([]); setPreview([]); setDescription("");
      setFixPrice(""); setDiscount(""); setDiscountPrice("");
      setTotalProduct(""); setCategory(""); setTags([]);
    } else {
      alert("Error creating product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Add Brush Product</h2>
      <Input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
      <div>
        <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        {preview.length > 0 && (
          <div className="flex flex-row gap-3 mt-2 flex-wrap">
            {preview.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={`Preview ${idx + 1}`} className="w-24 h-24 object-cover rounded border" />
                <button type="button" onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <Input type="number" placeholder="Fix Price" value={fixPrice} onChange={e => setFixPrice(e.target.value)} required />
        <Input type="number" placeholder="Discount" value={discount} onChange={e => setDiscount(e.target.value)} />
        <Input type="number" placeholder="Discount Price" value={discountPrice} readOnly />
      </div>
      <Input type="number" placeholder="Total Product" value={totalProduct} onChange={e => setTotalProduct(e.target.value)} required />
      <select className="w-full border rounded p-2" value={category} onChange={e => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
      <div>
        <div className="mb-1">Tags:</div>
        <div className="flex flex-wrap gap-2">
          {tagsList.map(tag => (
            <button type="button" key={tag}
              className={`px-2 py-1 rounded-full border ${tags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              onClick={() => handleTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">Create Product</Button>
    </form>
  );
} 
