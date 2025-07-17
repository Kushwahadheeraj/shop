"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CATEGORY_OPTIONS = [
  "Fine Thread Screws",
  "Coarse Thread Screws",
  "Collated Screws",
  "Self-Drilling Screws",
  "Bugle Head Screws"
];

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

export default function ProductForm({
  return (<h2 className="text-xl font-bold mb-2">Add Dry Product</h2>) product, onSave }) {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const resource = pathParts[pathParts.length - 1].toLowerCase();
  const apiUrl = ${API_BASE_URL}/productadd//create;
  const [form, setForm] = useState(product || {
    name: '',
    price: '',
    discount: '',
    discountPrice: '',
    description: '',
    totalProduct: '',
    category: '',
    tag: [],
    photos: []
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };
    if ((name === 'price' || name === 'discount') && updatedForm.price && updatedForm.discount) {
      const price = parseFloat(updatedForm.price);
      const discount = parseFloat(updatedForm.discount);
      if (!isNaN(price) && !isNaN(discount)) {
        updatedForm.discountPrice = (price - (price * discount / 100)).toFixed(2);
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
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tag') {
        v.forEach(val => data.append('tag', val));
      } else {
        data.append(k, v);
      }
    });
    files.forEach(f => data.append('photos', f));
    const res = await fetch(`${API_BASE_URL}/dry/create`, { method: product ? 'PUT' : 'POST', body: data });
    if (res.ok) onSave && onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Add / Update Dry Wall Gypsum Screws Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fix Price</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Fix Price" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount Price (auto)</label>
          <Input name="discountPrice" type="number" value={form.discountPrice} readOnly placeholder="Discount Price (auto)" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {CATEGORY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Photos <span className="text-xs text-gray-400">(1-5 allowed)</span></label>
          <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
          {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
          {preview.length > 0 && (
            <div className="flex flex-row gap-3 mt-2 flex-wrap">
              {preview.map((url, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${idx + 1}`}
                    className="w-24 h-24 object-cover rounded border"
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
          <label className="block text-sm font-medium mb-1">Tags (Select multiple)</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.tag.map((t) => (
              <span key={t} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{t}</span>
            ))}
            {form.tag.length === 0 && <span className="text-gray-400 text-xs">No tag selected</span>}
          </div>
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
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">{product ? 'Update' : 'Create'} Product</Button>
    </form>
  );
} 

