"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    discount: '',
    brand: '',
  });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  // Discount price auto-calc
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      
      // Auto calculate final price when original price or discount changes
      if (name === 'originalPrice' || name === 'discount') {
        const originalPrice = parseFloat(name === 'originalPrice' ? value : prev.originalPrice);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        
        if (!isNaN(originalPrice) && !isNaN(discount)) {
          const finalPrice = originalPrice - (originalPrice * discount / 100);
          updated.price = finalPrice.toFixed(2);
        } else if (!isNaN(originalPrice)) {
          updated.price = originalPrice.toFixed(2);
        }
      }
      
      return updated;
    });
  };

  // Handle adding new tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Handle Enter key for adding tags
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Image handling - only 1 image
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPhotoError("");
    }
  };

  const handleRemovePhoto = () => {
    setFile(null);
    setPreview(null);
  };

  const isFormValid = () => {
    return form.name && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    setPhotoError("");
    const data = new FormData();
    
    // Only send fields that exist in the model schema
    const modelFields = ['name', 'description', 'category', 'price', 'originalPrice', 'discount', 'brand'];
    
    Object.entries(form).forEach(([k, v]) => {
      if (modelFields.includes(k) && v) {
        data.append(k, v);
      }
    });
    
    // Add tags separately
    if (tags.length > 0) {
      tags.forEach(tag => data.append('tags', tag));
    }
    
    // Add image
    data.append('image', file);
    
    try {
      const res = await fetch(`${API_BASE_URL}/home/electrical/create`, { method: 'POST', body: data });
      if (res.ok) {
        alert('Electrical product created successfully!');
        setForm({
          name: '',
          description: '',
          category: '',
          price: '',
          originalPrice: '',
          discount: '',
          brand: '',
        });
        setTags([]);
        setNewTag('');
        setFile(null);
        setPreview(null);
      } else {
        const errorData = await res.json();
        alert(`Error creating product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Add Electrical Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} onChange={handleChange} placeholder="Category" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <Input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <Input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="Enter original price" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Enter discount %" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Final Price (auto calculated)</label>
          <Input name="price" type="number" value={form.price} readOnly className="bg-gray-50" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={newTag} 
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add tag (e.g., LED, Energy Efficient)" 
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Display added tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
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
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Product Image</label>
        <Input name="image" type="file" onChange={handleFile} accept="image/*" required />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        {preview && (
          <div className="mt-4 relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded border"
            />
            <button 
              type="button" 
              onClick={handleRemovePhoto} 
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isFormValid()}
      >
        Create Electrical Product
      </Button>
    </form>
  );
}
