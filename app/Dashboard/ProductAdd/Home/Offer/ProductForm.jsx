"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    title: '',
    offer: '',
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
    return form.title && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('offer', form.offer);
    data.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/offer/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Offer created successfully!');
        setForm({ title: '', offer: 'Offer' });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating offer');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating offer');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Offer</h2>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <Input 
          name="title" 
          value={form.title} 
          onChange={handleChange} 
          placeholder="Enter offer title" 
          required 
          className="w-full"
        />
      </div>

      {/* Offer Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Offer Type</label>
        <Input 
          name="offer" 
          value={form.offer} 
          onChange={handleChange} 
          placeholder="Enter offer type" 
          className="w-full bg-gray-50"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Offer Image *</label>
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

      {/* Preview Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            {preview && (
              <img 
                src={preview} 
                alt="Offer Preview" 
                className="w-20 h-20 object-cover rounded mx-auto mb-3"
              />
            )}
            <h3 className="text-lg font-bold mb-2">{form.title || 'Offer Title'}</h3>
            <p className="text-gray-600 text-sm">{form.offer}</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isFormValid()}
      >
        Create Offer
      </Button>
    </form>
  );
} 