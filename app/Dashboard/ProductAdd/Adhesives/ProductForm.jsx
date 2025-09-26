"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

const TAG_OPTIONS = [
  "Apsara",
  "Apsara Glass Marking White Pencil Pack 0f 2",
  "glass marking white pencil",
  "pencil",
  "white pencil"
];

export default function ProductForm({ product, onSave }) {
  const [form, setForm] = useState(product || {
    name: '',
    sku: 'N/A', // Default SKU
    fixPrice: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    discountPrice: '',
    description: '',
    totalProduct: '',
    category: 'Adhesives', // Default category
    tags: [],
    weights: [], // array of { weight: '', price: '', discountPrice: '' }
    photos: []
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Add state for weights if not present in product
  const [weights, setWeights] = useState(product?.weights || []);

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!form.name.trim()) return false;
    // Price, Min, Max optional now
    if (!form.totalProduct || isNaN(Number(form.totalProduct))) return false;
    if (!form.tags || !Array.isArray(form.tags) || form.tags.length === 0) return false;
    // if (!weights || !Array.isArray(weights) || weights.length === 0) return false;
    // for (const w of weights) {
    //   if (!w.weight || !w.price || isNaN(Number(w.price))) return false;
    // }
    if (!files || files.length === 0) return false;
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-calc discountPrice from fixPrice + discount if present
      if (name === 'fixPrice' || name === 'discount') {
        const price = parseFloat(name === 'fixPrice' ? value : prev.fixPrice);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        updated.discountPrice = (!isNaN(price) && !isNaN(discount))
          ? (price - (price * discount / 100)).toFixed(2)
          : '';
      }
      return updated;
    });
    if (name === 'discount') {
      const discount = parseFloat(value);
      setWeights((prev) => prev.map(w => {
        const price = parseFloat(w.price);
        return {
          ...w,
          discountPrice: (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : ''
        };
      }));
    }
  };

  // Handle weight row change
  const handleWeightChange = (idx, field, value) => {
    setWeights(prev => {
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

  // Add new weight row
  const handleAddWeight = () => {
    setWeights(prev => [...prev, { weight: '', price: '', discountPrice: '' }]);
  };

  // Remove weight row
  const handleRemoveWeight = (idx) => {
    setWeights(prev => prev.filter((_, i) => i !== idx));
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
      const already = prev.tags.includes(option);
      return {
        ...prev,
        tags: already ? prev.tags.filter(t => t !== option) : [...prev.tags, option]
      };
    });
  };

  // Custom tag input handlers
  const handleAddCustomTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };

  const handleRemoveCustomTag = (idx) => {
    setForm(prev => {
      const updated = prev.tags.filter((_, i) => i !== idx);
      return { ...prev, tags: updated };
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
    console.log('Form submission started');
    console.log('Form data:', form);
    console.log('Weights:', weights);
    console.log('Files:', files);
    
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    
    // Use whatever is in the form for SKU and category
    const formToSubmit = { ...form };
    const data = new FormData();
    
    console.log('Building FormData...');
    Object.entries(formToSubmit).forEach(([k, v]) => {
      if (k === 'tags') {
        console.log('Adding tags:', v);
        v.forEach(val => data.append('tags', val));
      } else if (k === 'weights') {
        // skip, we will append normalized weights from state below
      } else {
        console.log(`Adding ${k}:`, v);
        data.append(k, v);
      }
    });
    
    // Add weights as JSON string
    console.log('Adding weights as JSON:', weights);
    // Normalize weights: keep array of objects {weight, price, discountPrice}
    const normWeights = Array.isArray(weights) ? weights.filter(w=>w && (w.weight||w.price)).map(w=>({
      weight: String(w.weight || '').trim(),
      price: w.price !== '' && w.price != null ? Number(w.price) : undefined,
      discountPrice: w.discountPrice !== '' && w.discountPrice != null ? Number(w.discountPrice) : undefined
    })) : [];
    data.append('weights', JSON.stringify(normWeights));
    
    // Add files
    console.log('Adding files to FormData...');
    files.forEach((f, index) => {
      console.log(`Adding file ${index}:`, f.name);
      data.append('photos', f);
    });
    
    console.log('FormData built, sending request...');
    console.log('API URL:', `${API_BASE_URL}/adhesives/create`);
    
    try {
      const endpoint = product ? `${API_BASE_URL}/adhesives/update/${product._id || product.id}` : `${API_BASE_URL}/adhesives/create`;
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(endpoint, { 
        method, 
        body: data 
      });
      
      console.log('Response status:', res.status);
      console.log('Response headers:', res.headers);
      
      if (res.ok) {
        const result = await res.json();
        console.log('Success response:', result);
        alert('Product created successfully!');
        onSave && onSave();
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        alert(`Error creating product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert(`Network error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Add Adhesive Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" required />
        </div>
      <div>
        <label className="block text-sm font-medium mb-1">Price</label>
        <Input name="fixPrice" type="number" value={form.fixPrice} onChange={handleChange} placeholder="Price" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Discounted Price (auto)</label>
        <Input name="discountPrice" type="number" value={form.discountPrice} readOnly placeholder="Discounted Price" />
      </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
        <Input name="minPrice" type="number" value={form.minPrice} onChange={handleChange} placeholder="Min Price" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
        <Input name="maxPrice" type="number" value={form.maxPrice} onChange={handleChange} placeholder="Max Price" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Weights (Add multiple weights and prices)</label>
          <div className="space-y-2">
            {weights.map((w, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  className="w-1/3"
                  placeholder="Weight (e.g. 500g, 1kg)"
                  value={w.weight}
                  onChange={e => handleWeightChange(idx, 'weight', e.target.value)}
                  required
                />
                <Input
                  className="w-1/3"
                  type="number"
                  placeholder="Price"
                  value={w.price}
                  onChange={e => handleWeightChange(idx, 'price', e.target.value)}
                  required
                />
                <Input
                  className="w-1/3"
                  type="number"
                  placeholder="Discounted Price (auto)"
                  value={w.discountPrice}
                  readOnly
                />
                <Button type="button" onClick={() => handleRemoveWeight(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={handleAddWeight} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 mt-2">Add Weight</Button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
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
                    �
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tags (Select multiple)</label>
          
          {/* Custom Tag Input */}
          <div className="flex gap-2 mb-3">
            <Input 
              value={tagInput} 
              onChange={e => setTagInput(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomTag(); }}} 
              placeholder="Type custom tag and press Enter or Add" 
            />
            <Button type="button" onClick={handleAddCustomTag} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add</Button>
          </div>

          {/* Selected Tags Display */}
          <div className="flex flex-wrap gap-2 mb-3">
            {form.tags.map((t, idx) => (
              <span key={t} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                {t}
                <button type="button" onClick={() => handleRemoveCustomTag(idx)} className="ml-2 text-red-500">×</button>
              </span>
            ))}
            {form.tags.length === 0 && <span className="text-gray-400 text-xs">No tags selected</span>}
          </div>

          {/* Predefined Tags */}
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map(option => (
              <button
                type="button"
                key={option}
                className={`px-3 py-1 rounded-full border text-xs font-medium transition ${form.tags.includes(option) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                onClick={() => handleTagChange(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full mt-4"
        disabled={!isFormValid()}
      >{product ? 'Update' : 'Create'} Product</Button>
    </form>
  );
} 
