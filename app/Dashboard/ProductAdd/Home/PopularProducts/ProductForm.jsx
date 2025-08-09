"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, Trash2 } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  // 3 custom fields, each with a name and multiple values
  const [customFields, setCustomFields] = useState([
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
  ]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    discountPrice: '',
    rating: '',
    tags: [],
    isActive: true
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [variants, setVariants] = useState([]);

  // Auto-calculate discount price
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'price' || name === 'discount') {
        const price = parseFloat(name === 'price' ? value : prev.price);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        if (!isNaN(price) && !isNaN(discount)) {
          updated.discountPrice = (price - (price * discount / 100)).toFixed(2);
        } else if (!isNaN(price)) {
          updated.discountPrice = price.toFixed(2);
        } else {
          updated.discountPrice = '';
        }
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
    setVariants(prev => [...prev, { variantName: '', price: '', discountPrice: '' }]);
  };
  const handleVariantChange = (idx, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[idx][field] = value;
      // auto discountPrice
      if (field === 'price' || field === 'discount') {
        const price = parseFloat(field === 'price' ? value : updated[idx].price);
        const discount = parseFloat(form.discount);
        updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return updated;
    });
  };
  const handleRemoveVariant = idx => {
    setVariants(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      return updated;
    });
  };

  // Multiple image handling
  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    
    // Check if adding these files would exceed the limit
    if (files.length + fileArray.length > 8) {
      setPhotoError("You can upload maximum 8 images only.");
      return;
    }

    // Filter valid image files
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        setPhotoError("Please select only image files.");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setPhotoError("Each image should be less than 10MB.");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews for new files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setPhotoError("");
  };

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleRemoveImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
    setPhotoError("");
  };

  const handleFileButtonClick = (inputId) => {
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      fileInput.click();
    }
  };

  // Tags handling
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const isFormValid = () => {
    return form.name && form.price && files.length >= 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload at least 1 image");
      return;
    }

    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('price', form.price);
    data.append('minPrice', form.minPrice);
    data.append('maxPrice', form.maxPrice);
    data.append('discount', form.discount);
    data.append('rating', form.rating);
    data.append('tags', form.tags.join(','));
    data.append('customFields', JSON.stringify(customFields));
    data.append('variants', JSON.stringify(variants));
    data.append('isActive', form.isActive);
    
    // Append all images
    files.forEach(file => {
      data.append('images', file);
    });

    try {
      const res = await fetch(`${API_BASE_URL}/home/popularProducts/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Popular product created successfully!');
        setForm({
          name: '',
          description: '',
          category: '',
          price: '',
          minPrice: '',
          maxPrice: '',
          discount: '',
          discountPrice: '',
          rating: '',
          tags: [],
          isActive: true
        });
        setFiles([]);
        setPreviews([]);
        setTagInput("");
        setPhotoError("");
        setCustomFields([
          { fieldName: '', fieldValues: [''] },
          { fieldName: '', fieldValues: [''] },
          { fieldName: '', fieldValues: [''] },
        ]);
        setVariants([]);
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error creating popular product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating popular product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Popular Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Multiple Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Product Images * (Min: 1, Max: 8)
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {previews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  {files.length < 8 && (
                    <div className="flex gap-2 justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        multiple
                        className="hidden"
                        id="image-upload-more"
                      />
                      <label htmlFor="image-upload-more" className="cursor-pointer">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => handleFileButtonClick('image-upload-more')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add More Images
                        </Button>
                      </label>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {files.length}/8 images uploaded
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-gray-600 mb-4">
                    <p className="font-medium">Drag and drop images here</p>
                    <p className="text-sm">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG up to 10MB each (Max 8 images)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    multiple
                    className="hidden"
                    id="image-upload-main"
                  />
                  <label htmlFor="image-upload-main" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleFileButtonClick('image-upload-main')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Images
                    </Button>
                  </label>
                </div>
              )}
            </div>
            {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Enter category"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Price (₹) *</label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Minimum Price (₹)</label>
            <Input
              type="number"
              name="minPrice"
              value={form.minPrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Maximum Price (₹)</label>
            <Input
              type="number"
              name="maxPrice"
              value={form.maxPrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium mb-2">Discount (%)</label>
            <Input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          {/* Discount Price (Auto-calculated) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Discounted Price (₹)</label>
            <Input
              type="text"
              value={form.discountPrice}
              readOnly
              className="bg-gray-50"
              placeholder="Auto-calculated"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating (0-5)</label>
            <Input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              placeholder="0.0"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Enter tag and press Enter"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Variants</label>
            <Button type="button" onClick={handleAddVariant} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </div>
          {variants.map((variant, idx) => (
            <div key={idx} className="border p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Variant {idx + 1}</h4>
                <Button 
                  type="button" 
                  onClick={() => handleRemoveVariant(idx)} 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Variant Name</label>
                  <Input
                    type="text"
                    value={variant.variantName}
                    onChange={(e) => handleVariantChange(idx, 'variantName', e.target.value)}
                    placeholder="e.g., Size, Color, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <Input
                    type="number"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discounted Price (₹)</label>
                  <Input
                    type="text"
                    value={variant.discountPrice}
                    readOnly
                    className="bg-gray-50"
                    placeholder="Auto-calculated"
                  />
                </div>
              </div>
            </div>
          ))}
          {variants.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              <p>No variants added yet</p>
              <p className="text-sm">Click "Add Variant" to create product variants</p>
            </div>
          )}
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

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!isFormValid()}>
          Create Popular Product
        </Button>
      </form>
    </div>
  );
}
