"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const tagsList = ["Heavy Duty", "Lightweight", "Universal", "Child Safe"];

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
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    fetch("/api/get-categories?dir=Locks%5CRimLocks%5CUltraLatchboltCarton")
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
    // TODO: Update API endpoint for each product type
    // const res = await fetch(`/api/your-endpoint`, { method: "POST", body: formData });
    // if (res.ok) { ... }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Add Product</h2>
      <Input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
      <div>
        <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        {preview.length > 0 && (
          <div className="flex flex-row gap-3 mt-2 flex-wrap">
            {preview.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={'Preview ' + (idx + 1)} className="w-24 h-24 object-cover rounded border" />
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
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!isFormValid}>Create Product</Button>
    </form>
  );
} 