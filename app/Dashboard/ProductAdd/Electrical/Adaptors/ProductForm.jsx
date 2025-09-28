"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm({ onSave }) {
  const [form, setForm] = useState({
    name: '',
    sku: 'N/A',
    price: '',
    discount: '',
    discountPrice: '',
    totalProduct: '',
    category: 'Adaptors',
    description: '',
    tag: [],
    amps: [], // { amps: '', price: '', discountPrice: '' }
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Tag logic
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tag.includes(tagInput.trim())) {
      setForm(prev => ({
        ...prev,
        tag: [...prev.tag, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tag: prev.tag.filter(t => t !== tagToRemove)
    }));
  };

  // Discount price auto-calc
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'price' || name === 'discount') {
        const price = parseFloat(name === 'price' ? value : prev.price);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        updated.discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return updated;
    });
  };



  // Amps logic
  const handleAddAmp = () => {
    setForm(prev => ({ ...prev, amps: [...prev.amps, { amps: '', price: '', discountPrice: '' }] }));
  };
  const handleAmpChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...prev.amps];
      updated[idx][field] = value;
      // auto discountPrice
      if (field === 'price' || field === 'discount') {
        const price = parseFloat(field === 'price' ? value : updated[idx].price);
        const discount = parseFloat(form.discount);
        updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return { ...prev, amps: updated };
    });
  };
  const handleRemoveAmp = idx => {
    setForm(prev => {
      const updated = prev.amps.filter((_, i) => i !== idx);
      return { ...prev, amps: updated };
    });
  };



  // Images
  const handleFiles = e => {
    let selected = Array.from(e.target.files);
    let newFiles = [...files, ...selected];
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
  const handleRemovePhoto = idx => {
    const newFiles = files.filter((_, i) => i !== idx);
    const newPreview = preview.filter((_, i) => i !== idx);
    setFiles(newFiles);
    setPreview(newPreview);
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tag') {
        v.forEach(val => data.append('tag', val));
      } else if (k === 'amps') {
        data.append(k, JSON.stringify(v));
      } else {
        data.append(k, v);
      }
    });
    files.forEach(f => data.append('photos', f));
    const res = await fetch(`${API_BASE_URL}/electrical/adaptors/create`, { method: 'POST', body: data });
    if (res.ok) {
      alert('Product created successfully!');
      if (onSave) onSave();
    } else {
      const errorData = await res.json();
      alert(`Error creating product: ${errorData.error || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Add Adaptors Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discounted Price (auto)</label>
          <Input name="discountPrice" type="number" value={form.discountPrice} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Price (optional)</label>
          <Input name="minPrice" type="number" value={form.minPrice} onChange={handleChange} placeholder="Min Price" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price (optional)</label>
          <Input name="maxPrice" type="number" value={form.maxPrice} onChange={handleChange} placeholder="Max Price" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} readOnly />
        </div>
      </div>

      {/* Amps Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Amps</label>
          <Button type="button" onClick={handleAddAmp} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Amp</Button>
        </div>
        {form.amps.map((a, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input className="w-1/3" placeholder="Amp Value" value={a.amps} onChange={e => handleAmpChange(idx, 'amps', e.target.value)} />
            <Input className="w-1/3" type="number" placeholder="Price" value={a.price} onChange={e => handleAmpChange(idx, 'price', e.target.value)} />
            <Input className="w-1/3" type="number" placeholder="Discounted Price (auto)" value={a.discountPrice} readOnly />
            <Button type="button" onClick={() => handleRemoveAmp(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
          </div>
        ))}
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      </div>
      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-1">Photos <span className="text-xs text-gray-400">(1-5 allowed)</span></label>
        <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        {preview.length > 0 && (
          <div className="flex flex-row gap-3 mt-2 flex-wrap">
            {preview.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={'Preview ' + (idx + 1)} className="w-24 h-24 object-cover rounded border" />
                <button type="button" onClick={() => handleRemovePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}} placeholder="Type tag and press Enter or Add" />
          <Button type="button" onClick={handleAddTag} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
                  {form.tag.map((tag, idx) => (
          <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 text-red-500">×</button>
          </span>
        ))}
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">Create Product</Button>
    </form>
  );
}
