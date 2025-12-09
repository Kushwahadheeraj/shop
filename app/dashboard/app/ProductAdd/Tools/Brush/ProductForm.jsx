"use client";
import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const tagsList = ["Heavy Duty", "Lightweight", "Universal", "Child Safe"];

export default function ProductForm({ onSave }) {
  const [name, setName] = useState("");
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);
  const [description, setDescription] = useState("");
  const [fixPrice, setFixPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    fetch("/api/get-categories?dir=Tools%5CBrush")
      .then(res => res.json())
      .then(data => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    const valid =
      name.trim() &&
      fixPrice &&
      description.trim() &&
      category &&
      photos.length >= 1 &&
      photos.length <= 5 &&
      totalProduct;
    setIsFormValid(!!valid);
  }, [name, fixPrice, description, category, photos, totalProduct]);

  useEffect(() => {
    if (fixPrice && discount) {
      const dp = Math.max(Number(fixPrice) - Number(discount), 0);
      setDiscountPrice(dp);
    } else {
      setDiscountPrice("");
    }
  }, [fixPrice, discount]);

  const handleFiles = e => {
    let selected = Array.from(e.target.files);
    let newFiles = [...photos, ...selected];
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

  const handleRemovePhoto = idx => {
    const newFiles = photos.filter((_, i) => i !== idx);
    setPhotos(newFiles);
    setPreview(newFiles.map(file => URL.createObjectURL(file)));
  };

  const handleTag = tag => {
    setTags(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (photos.length === 0) {
      setPhotoError("At least one photo is required.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("fixPrice", fixPrice);
    formData.append("discount", discount);
    formData.append("discountPrice", discountPrice);
    formData.append("totalProduct", totalProduct);
    formData.append("category", category);
    tags.forEach(tag => formData.append("tags", tag));
    photos.forEach(photo => formData.append("photos", photo));
    const res = await fetch(`${API_BASE_URL}/tools/brush/create`, { method: 'POST', body: formData });
    if (res.ok) onSave && onSave();
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Product</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <Input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
      <div>
        <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        {preview.length > 0 && (
          <div className="flex flex-row gap-2 sm:gap-3 mt-2 flex-wrap">
            {preview.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={'Preview ' + (idx + 1)} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border" />
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
              className={`px-2 py-1 rounded-full border ${tags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              onClick={() => handleTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!isFormValid}>Create Product</Button>
    </form>
    </div>
  );
} 