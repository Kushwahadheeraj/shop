"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    image: '',
    link: '',
    title: '',
    subtitle: '',
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
    return form.title && form.link && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setPhotoError("");
    
    // Validate all required fields
    if (!form.title || !form.title.trim()) {
      setPhotoError("Title is required");
      return;
    }
    
    if (!form.link || !form.link.trim()) {
      setPhotoError("Link is required");
      return;
    }
    
    if (!file) {
      setPhotoError("Please upload an image");
      return;
    }

    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('title', form.title.trim());
    data.append('link', form.link.trim());
    data.append('subtitle', form.subtitle.trim());
    data.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/items/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Item created successfully!');
        setForm({
          image: '',
          link: '',
          title: '',
          subtitle: '',
        });
        setFile(null);
        setPreview(null);
      } else {
        const errorData = await res.json();
        setPhotoError(errorData.message || 'Error creating item');
      }
    } catch (error) {
      console.error('Error:', error);
      setPhotoError('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
      
      
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Product</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Image *</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {preview ? (
              <div className="space-y-4">
                <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded" />
                <Button type="button" variant="outline" onClick={handleRemovePhoto}>
                  Remove Image
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="text-gray-600">
                    <p>Click to upload image</p>
                    <p className="text-sm">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </label>
              </div>
            )}
          </div>
          {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter title"
            required
          />
        </div>

        {/* Link */}
        <div>
          <label className="block text-sm font-medium mb-2">Link *</label>
          <Input
            type="url"
            name="link"
            value={form.link}
            onChange={handleChange}
            placeholder="Enter link URL"
            required
          />
        </div>

        {/* Subtitle */}
        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <Textarea
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Enter subtitle"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!isFormValid()}>
          Create Item
        </Button>
      </form>
    </div>
  );
}
