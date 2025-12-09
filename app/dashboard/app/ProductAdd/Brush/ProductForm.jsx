"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

const TAG_OPTIONS = [
  "Black Phosphate",
  "Zinc Coated",
  "Corrosion Resistant",
  "For Metal Studs",
  "For Wood Studs",
  "Sharp Point",
  "Phillips Head",
  "High Strength"
];

export default function ProductForm({ product, onSave }) {
  const [form, setForm] = useState(product || {
    name: '',
    sku: 'N/A', // Default SKU
    minPrice: '',
    maxPrice: '',
    discount: '',
    description: '',
    totalProduct: '',
    category: 'Dry', // Default category
    tag: [],
    sizes: [], // array of { size: '', price: '', discountPrice: '' }
    photos: []
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");

  // Add state for weights if not present in product
  const [sizes, setSizes] = useState(product?.sizes || []);

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (!form.minPrice || isNaN(Number(form.minPrice))) return false;
    if (!form.maxPrice || isNaN(Number(form.maxPrice))) return false;
    if (form.discount === '' || isNaN(Number(form.discount))) return false;
    if (!form.totalProduct || isNaN(Number(form.totalProduct))) return false;
    if (!form.tag || !Array.isArray(form.tag) || form.tag.length === 0) return false;
    if (!sizes || !Array.isArray(sizes) || sizes.length === 0) return false;
    for (const s of sizes) {
      if (!s.size || !s.price || isNaN(Number(s.price))) return false;
    }
    if (!files || files.length === 0) return false;
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };
    // No auto-calculation for min/max price
    setForm(updatedForm);
    // If discount changes, update all sizes' discountPrice
    if (name === 'discount') {
      const discount = parseFloat(value);
      setSizes((prev) => prev.map(s => {
        const price = parseFloat(s.price);
        return {
          ...s,
          discountPrice: (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : ''
        };
      }));
    }
  };

  // Handle size row change
  const handleSizeChange = (idx, field, value) => {
    setSizes(prev => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [field]: value,
      };
      // Update discountPrice if price or discount changes
      const price = parseFloat(updated[idx].price);
      const discount = parseFloat(form.discount);
      updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      return updated;
    });
  };

  // Add new size row
  const handleAddSize = () => {
    setSizes(prev => [...prev, { size: '', price: '', discountPrice: '' }]);
  };

  // Remove size row
  const handleRemoveSize = (idx) => {
    setSizes(prev => prev.filter((_, i) => i !== idx));
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

  const handleTagChange = (option) => {
    setForm((prev) => {
      const already = prev.tag.includes(option);
      return {
        ...prev,
        tag: already ? prev.tag.filter(t => t !== option) : [...prev.tag, option]
      };
    });
  };

  const handleRemovePhoto = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreview(newPreview);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    // Use whatever is in the form for SKU and category
    const formToSubmit = { ...form };
    const data = new FormData();
    Object.entries(formToSubmit).forEach(([k, v]) => {
      if (k === 'tag') {
        v.forEach(val => data.append('tag', val));
      } else {
        data.append(k, v);
      }
    });
    // Add sizes as JSON string
    data.append('sizes', JSON.stringify(sizes));
    files.forEach(f => data.append('photos', f));
    const res = await fetch(`${API_BASE_URL}/brush/create`, { method: product ? 'PUT' : 'POST', body: data });
    if (res.ok) onSave && onSave();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Brush Product</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">SKU</label>
          <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Min Price</label>
          <Input name="minPrice" type="number" value={form.minPrice} onChange={handleChange} placeholder="Min Price" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Max Price</label>
          <Input name="maxPrice" type="number" value={form.maxPrice} onChange={handleChange} placeholder="Max Price" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" required />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Sizes (Add multiple sizes and prices)</label>
          <div className="space-y-2">
            {sizes.map((s, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <Input
                  className="w-full sm:w-1/3 text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500"
                  placeholder="Size (e.g. Small, Medium, Large)"
                  value={s.size}
                  onChange={e => handleSizeChange(idx, 'size', e.target.value)}
                  required
                />
                <Input
                  className="w-full sm:w-1/3 text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500"
                  type="number"
                  placeholder="Price"
                  value={s.price}
                  onChange={e => handleSizeChange(idx, 'price', e.target.value)}
                  required
                />
                <Input
                  className="w-full sm:w-1/3 text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500"
                  type="number"
                  placeholder="Discounted Price (auto)"
                  value={s.discountPrice}
                  readOnly
                />
                <Button type="button" onClick={() => handleRemoveSize(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm w-full sm:w-auto">Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddSize} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3 py-1 mt-2 text-xs sm:text-sm font-medium shadow-md">Add Size</Button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Description</label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium mb-1">Photos <span className="text-xs text-gray-400">(1-5 allowed)</span></label>
          <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" className="text-xs sm:text-sm" />
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
          <label className="block text-xs sm:text-sm font-medium mb-1">Tags (Select multiple)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tag.map((t) => (
              <span key={t} className="bg-amber-100 text-amber-700 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">{t}</span>
            ))}
            {form.tag.length === 0 && <span className="text-gray-400 text-xs">No tag selected</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(option => (
              <button
                type="button"
                key={option}
                className={`px-2 sm:px-3 py-1 rounded-full border text-xs font-medium transition ${form.tag.includes(option) ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-amber-50'}`}
                onClick={() => handleTagChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg"
        disabled={!isFormValid()}
      >{product ? 'Update' : 'Create'} Product</Button>
    </form>
    </div>
  );
} 
