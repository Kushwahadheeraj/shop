"use client";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";
import { useSearchParams } from "next/navigation";

export default function ProductForm({ onSave }) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const isEditMode = !!id;

  // 3 custom fields, each with a name and multiple values
  const [customFields, setCustomFields] = useState([
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
  ]);
  const [form, setForm] = useState({
    name: '',
    sku: 'N/A',
    fixPrice: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    discountPrice: '',
    totalProduct: '',
    category: 'WastePipe',
    description: '',
    tags: [],
    variants: [], // { variantName: '', price: '', discountPrice: '' }
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/sanitary/waste-pipe/getOne/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      
      setForm({
        name: data.name || '',
        sku: data.sku || 'N/A',
        fixPrice: data.fixPrice || '',
        minPrice: data.minPrice || '',
        maxPrice: data.maxPrice || '',
        discount: data.discount || '',
        discountPrice: data.discountPrice || '',
        totalProduct: data.totalProduct || '',
        category: data.category || 'WastePipe',
        description: data.description || '',
        tags: data.tags || [],
        variants: data.variants || [],
      });

      if (data.customFields && Array.isArray(data.customFields)) {
          const loadedFields = data.customFields.map(f => ({
              fieldName: f.fieldName,
              fieldValues: Array.isArray(f.fieldValues) ? f.fieldValues : [f.fieldValues]
          }));
          while(loadedFields.length < 3) {
              loadedFields.push({ fieldName: '', fieldValues: [''] });
          }
          setCustomFields(loadedFields);
      }

      if (data.photos && data.photos.length > 0) {
        setExistingPhotos(data.photos);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Error loading product details");
    }
  };


  // Discount price auto-calc
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'fixPrice' || name === 'discount') {
        const price = parseFloat(name === 'fixPrice' ? value : prev.fixPrice);
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

  // Calculate min/max price from variants
  const calculatePriceRange = () => {
    if (form.variants.length === 0) {
      setForm(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
      return;
    }
    
    const prices = form.variants
      .map(v => parseFloat(v.price))
      .filter(price => !isNaN(price) && price > 0);
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setForm(prev => ({ 
        ...prev, 
        minPrice: minPrice.toString(), 
        maxPrice: maxPrice.toString() 
      }));
    }
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

  const handleRemoveExistingPhoto = (photoUrl) => {
    setExistingPhotos(prev => prev.filter(url => url !== photoUrl));
  };

  // Submit
  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim()) { 
      alert('Product name is required'); 
      return; 
    }
    if (!form.fixPrice || parseFloat(form.fixPrice) <= 0) { 
      alert('Valid fix price is required'); 
      return; 
    }
    if (!form.totalProduct || parseFloat(form.totalProduct) <= 0) { 
      alert('Valid total product is required'); 
      return; 
    }
    
    const totalPhotos = files.length + existingPhotos.length;
    if (totalPhotos === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    if (totalPhotos > 5) { 
      setPhotoError('Maximum 5 photos allowed.'); 
      return; 
    }
    
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

    // Append custom fields
    const validCustomFields = customFields.filter(f => f.fieldName.trim() !== '');
    data.append('customFields', JSON.stringify(validCustomFields));

    files.forEach(file => data.append('photos', file));
    existingPhotos.forEach(url => data.append('existingPhotos', url));

    try {
      const url = isEditMode 
        ? `${API_BASE_URL}/sanitary/waste-pipe/update/${id}`
        : `${API_BASE_URL}/sanitary/waste-pipe/create`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: data,
      });
      if (res.ok) {
        alert(isEditMode ? 'Product updated successfully!' : 'Product added successfully!');
        if (!isEditMode) {
            setForm({
              name: '',
              sku: 'N/A',
              fixPrice: '',
              minPrice: '',
              maxPrice: '',
              discount: '',
              discountPrice: '',
              totalProduct: '',
              category: 'WastePipe',
              description: '',
              tags: [],
              variants: [],
            });
            setFiles([]);
            setPreview([]);
            setExistingPhotos([]);
            setCustomFields([
                { fieldName: '', fieldValues: [''] },
                { fieldName: '', fieldValues: [''] },
                { fieldName: '', fieldValues: [''] },
            ]);
        }
        if (onSave) onSave();
      } else {
        const errData = await res.json();
        alert('Error: ' + (errData.error || 'Failed to save product'));
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        Add New Product (Waste Pipe)
      </h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Enter product name" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
          <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fix Price (₹)</label>
          <Input type="number" name="fixPrice" value={form.fixPrice} onChange={handleChange} placeholder="0.00" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
          <Input type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
          <Input type="number" name="discountPrice" value={form.discountPrice} readOnly className="bg-gray-100" />
        </div>
      </div>

      {/* Stock & Description */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Stock</label>
          <Input type="number" name="totalProduct" value={form.totalProduct} onChange={handleChange} placeholder="Quantity" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Product description..." rows={4} />
        </div>
      </div>

      {/* Custom Fields */}
      <div className="border p-4 rounded-md bg-gray-50">
        <h3 className="font-semibold mb-2">Custom Fields (Optional)</h3>
        {customFields.map((field, fIdx) => (
          <div key={fIdx} className="mb-4 border-b pb-4 last:border-0">
            <div className="flex gap-2 mb-2">
              <Input 
                placeholder={`Field Name ${fIdx + 1} (e.g. Color)`}
                value={field.fieldName}
                onChange={(e) => handleCustomFieldNameChange(fIdx, e.target.value)}
                className="font-medium"
              />
            </div>
            <div className="pl-4 space-y-2">
               {field.fieldValues.map((val, vIdx) => (
                 <div key={vIdx} className="flex gap-2 items-center">
                   <Input 
                     placeholder={`Value ${vIdx + 1}`}
                     value={val}
                     onChange={(e) => handleCustomFieldValueChange(fIdx, vIdx, e.target.value)}
                   />
                   <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCustomFieldValue(fIdx, vIdx)} disabled={field.fieldValues.length === 1}>X</Button>
                 </div>
               ))}
               <Button type="button" variant="outline" size="sm" onClick={() => handleAddCustomFieldValue(fIdx)}>+ Add Value</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Variants */}
      <div className="border p-4 rounded-md bg-gray-50">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Variants (Optional)</h3>
            <Button type="button" onClick={handleAddVariant} variant="outline" size="sm">+ Add Variant</Button>
        </div>
        {form.variants.map((variant, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 border-b pb-4 last:border-0">
            <Input 
                placeholder="Variant Name (e.g. Red, XL)" 
                value={variant.variantName} 
                onChange={(e) => handleVariantChange(idx, 'variantName', e.target.value)} 
            />
            <Input 
                type="number" 
                placeholder="Price" 
                value={variant.price} 
                onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                onBlur={calculatePriceRange}
            />
            <Input 
                type="number" 
                placeholder="Disc. Price" 
                value={variant.discountPrice} 
                readOnly 
                className="bg-gray-100" 
            />
            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveVariant(idx)}>Remove</Button>
          </div>
        ))}
        {form.variants.length > 0 && (
             <p className="text-sm text-gray-500 mt-2">
                Min Price: {form.minPrice || '-'} | Max Price: {form.maxPrice || '-'}
             </p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={tagInput} 
            onChange={(e) => setTagInput(e.target.value)} 
            placeholder="Add a tag and press Enter or Click Add"
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} 
          />
          <Button type="button" onClick={handleAddTag}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center gap-1">
              {tag} <button type="button" onClick={() => handleRemoveTag(idx)} className="text-red-500 hover:text-red-700">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Max 5)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
           <input 
             type="file" 
             multiple 
             accept="image/*"
             onChange={handleFiles} 
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
           />
           <p className="text-gray-500">Drag & drop or click to upload</p>
        </div>
        {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
        <div className="flex flex-wrap gap-4 mt-4">
          {existingPhotos.map((url, idx) => (
            <div key={`existing-${idx}`} className="relative w-24 h-24 border rounded overflow-hidden group">
              <img src={`${API_BASE_URL}/${url.replace(/\\/g, '/')}`} alt="Existing" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => handleRemoveExistingPhoto(url)} 
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
          {preview.map((src, idx) => (
            <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden group">
              <img src={src} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => handleRemovePhoto(idx)} 
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 text-lg">
        Save Product
      </Button>
    </form>
  );
}
