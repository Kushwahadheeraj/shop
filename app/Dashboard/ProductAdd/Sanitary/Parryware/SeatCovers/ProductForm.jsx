"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm({ onSave }) {
  // 3 custom fields, each with a name and multiple values
  const [customFields, setCustomFields] = useState([
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
  ]);
  const [form, setForm] = useState({
    name: '',
    sku: 'N/A',
    price: '',
    discount: '',
    discountPrice: '',
    totalProduct: '',
    category: 'SeatCovers',
    description: '',
    tags: [],
    variants: [], // { variantName: '', price: '', discountPrice: '' }
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");

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

  // Custom Fields logic
  const handleCustomFieldNameChange = (idx, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[idx].fieldName = value;
      return updated;
    });
  };
  const handleCustomFieldValueChange = (fieldIdx, valueIdx, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues[valueIdx] = value;
      return updated;
    });
  };
  const handleAddCustomFieldValue = (fieldIdx) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues.push('');
      return updated;
    });
  };
  const handleRemoveCustomFieldValue = (fieldIdx, valueIdx) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues = updated[fieldIdx].fieldValues.filter((_, i) => i !== valueIdx);
      if (updated[fieldIdx].fieldValues.length === 0) updated[fieldIdx].fieldValues = [''];
      return updated;
    });
  };

  // Variants logic
  const handleAddVariant = () => {
    setForm(prev => ({ ...prev, variants: [...prev.variants, { variantName: '', price: '', discountPrice: '' }] }));
  };
  const handleVariantChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...prev.variants];
      updated[idx][field] = value;
      // auto discountPrice
      if (field === 'price' || field === 'discount') {
        const price = parseFloat(field === 'price' ? value : updated[idx].price);
        const discount = parseFloat(form.discount);
        updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return { ...prev, variants: updated };
    });
  };
  const handleRemoveVariant = idx => {
    setForm(prev => {
      const updated = prev.variants.filter((_, i) => i !== idx);
      return { ...prev, variants: updated };
    });
  };

  // Tags
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };
  const handleRemoveTag = idx => {
    setForm(prev => {
      const updated = prev.tags.filter((_, i) => i !== idx);
      return { ...prev, tags: updated };
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
    setPhotoError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tags') {
        v.forEach(val => data.append('tags', val));
      } else if (k === 'variants') {
        data.append(k, JSON.stringify(v));
      } else {
        data.append(k, v);
      }
    });
    // Add custom fields
    customFields.forEach((f, idx) => {
      data.append('customFieldName' + (idx+1), f.fieldName);
      f.fieldValues.forEach(val => data.append('customFieldValue' + (idx+1), val));
    });
    files.forEach(f => data.append('photos', f));
    const res = await fetch(`${API_BASE_URL}/sanitary/parryware-seat-covers-seat-covers/create`, { method: 'POST', body: data });
    if (res.ok) onSave && onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Add SeatCovers Product</h2>
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
          <label className="block text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} readOnly />
        </div>
      </div>
      {/* Custom Fields */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Custom Fields</label>
        {customFields.map((f, idx) => (
          <div key={idx} className="mb-2 border p-2 rounded">
            <div className="flex gap-2 items-center mb-1">
              <Input className="w-1/3" placeholder="Field Name" value={f.fieldName} onChange={e => handleCustomFieldNameChange(idx, e.target.value)} />
            </div>
            {f.fieldValues.map((val, vIdx) => (
              <div key={vIdx} className="flex gap-2 items-center mb-1">
                <Input className="w-1/2" placeholder="Field Value" value={val} onChange={e => handleCustomFieldValueChange(idx, vIdx, e.target.value)} />
                <Button type="button" onClick={() => handleRemoveCustomFieldValue(idx, vIdx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => handleAddCustomFieldValue(idx)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Value</Button>
          </div>
        ))}
      </div>
      {/* Variants Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Variants</label>
          <Button type="button" onClick={handleAddVariant} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Variant</Button>
        </div>
        {form.variants.map((v, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input className="w-1/3" placeholder="Variant Name" value={v.variantName} onChange={e => handleVariantChange(idx, 'variantName', e.target.value)} />
            <Input className="w-1/3" type="number" placeholder="Price" value={v.price} onChange={e => handleVariantChange(idx, 'price', e.target.value)} />
            <Input className="w-1/3" type="number" placeholder="Discounted Price (auto)" value={v.discountPrice} readOnly />
            <Button type="button" onClick={() => handleRemoveVariant(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
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
          {form.tags.map((tag, idx) => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(idx)} className="ml-2 text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">Create Product</Button>
    </form>
  );
}
