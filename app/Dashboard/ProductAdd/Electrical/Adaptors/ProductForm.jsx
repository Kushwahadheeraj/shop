"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CATEGORY_OPTIONS = ["Adaptors"];
const TAG_OPTIONS = [
  "3 Pin Multi Plug Adaptor",
  "Adaptor",
  "Fybros",
  "Fybros 3 Pin Multi Plug Adaptor",
  "Fybros Plug",
  "Multi Plug Adaptor"
];

export default function ProductForm({ product, onSave }) {
  const [form, setForm] = useState(product || {
    name: '',
    productNo: '',
    productQualityName: '',
    price: '',
    discount: '',
    discountPrice: '',
    description: '',
    totalProduct: '',
    category: CATEGORY_OPTIONS[0],
    tag: [],
    photos: []
  });
  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");

  React.useEffect(() => {
    if (form.price && form.discount) {
      const dp = Math.max(Number(form.price) - Number(form.discount), 0);
      setForm(prev => ({ ...prev, discountPrice: dp }));
    } else {
      setForm(prev => ({ ...prev, discountPrice: '' }));
    }
  }, [form.price, form.discount]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  const handleTagChange = tag => {
    setForm(prev => ({
      ...prev,
      tag: prev.tag.includes(tag) ? prev.tag.filter(t => t !== tag) : [...prev.tag, tag]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (photos.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tag') {
        v.forEach(val => data.append('tag', val));
      } else {
        data.append(k, v);
      }
    });
    photos.forEach(f => data.append('photos', f));
    const res = await fetch('/api/electrical/adaptors', { method: product ? 'PUT' : 'POST', body: data });
    if (res.ok) {
      onSave && onSave();
      setForm({
        name: '',
        productNo: '',
        productQualityName: '',
        price: '',
        discount: '',
        discountPrice: '',
        description: '',
        totalProduct: '',
        category: CATEGORY_OPTIONS[0],
        tag: [],
        photos: []
      });
      setPhotos([]);
      setPreview([]);
    } else {
      alert("Error creating product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Add Adaptors Product</h2>
      <Input placeholder="Product Name" value={form.name} onChange={handleChange} required />
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
      <Textarea placeholder="Description" value={form.description} onChange={handleChange} />
      <div className="flex gap-2">
        <Input type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <Input type="number" placeholder="Discount" value={form.discount} onChange={handleChange} />
        <Input type="number" placeholder="Discount Price" value={form.discountPrice} readOnly />
      </div>
      <Input type="number" placeholder="Total Product" value={form.totalProduct} onChange={handleChange} required />
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
          disabled
        >
          <option value="Adaptors">Adaptors</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Product No</label>
        <Input name="productNo" value={form.productNo} onChange={handleChange} placeholder="Product No" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Product Quality Name</label>
        <Input name="productQualityName" value={form.productQualityName} onChange={handleChange} placeholder="Product Quality Name" required />
      </div>
      <div>
        <div className="mb-1">Tags:</div>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map(option => (
            <button
              type="button"
              key={option}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition ${form.tag.includes(option) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
              onClick={() => handleTagChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {form.tag.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">Create Product</Button>
    </form>
  );
} 