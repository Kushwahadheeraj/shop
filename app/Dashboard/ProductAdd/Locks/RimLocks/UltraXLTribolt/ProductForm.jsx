"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    category: 'UltraXLTribolt',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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

    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/locks/rim-locks/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Product created successfully!');
        setForm({ name: '', category: 'UltraXLTribolt' });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Add UltraXLTribolt Product</h2>
      
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name</label>
        <Input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Enter product name" 
          required 
          className="w-full"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <Input 
          name="category" 
          value={form.category} 
          readOnly 
          className="w-full bg-gray-50"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Image</label>
        <Input 
          name="image" 
          type="file" 
          onChange={handleFile} 
          accept="image/*" 
          required 
          className="w-full"
        />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        
        {/* Image Preview */}
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
        Create Product
      </Button>
    </form>
  );
}
