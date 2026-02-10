"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    tag: '',
    link: ''
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
    if (!file) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('name', form.name);
    data.append('tag', form.tag);
    data.append('link', form.link);
    data.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/bestquality/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Item created successfully!');
        setForm({ name: '', tag: '', link: '' });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating item');
      }
    } catch (error) {
            alert('Error creating item');
    }
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Best Quality Item</h1>
        </div>
        <p className="text-xs sm:text-sm text-emerald-50">Fill in the item details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* name */}
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input 
        name="name" 
        value={form.name} 
        onChange={handleChange} 
        placeholder="Enter item name" 
        required 
        className="w-full focus:ring-emerald-300 focus:border-emerald-500 text-sm sm:text-base"
        />
      </div>

      {/* tag */}
      <div>
        <label className="block text-sm font-medium mb-2">Tag (Optional)</label>
        <Input 
        name="tag" 
        value={form.tag} 
        onChange={handleChange} 
        placeholder="Enter tag (e.g. New, Hot)" 
        className="w-full focus:ring-emerald-300 focus:border-emerald-500 text-sm sm:text-base"
        />
      </div>

      {/* link */}
      <div>
        <label className="block text-sm font-medium mb-2">Link (Optional)</label>
        <Input 
        name="link" 
        value={form.link} 
        onChange={handleChange} 
        placeholder="Enter redirect link" 
        className="w-full focus:ring-emerald-300 focus:border-emerald-500 text-sm sm:text-base"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
            </div>
            <Input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>
        {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
        {preview && (
          <div className="mt-4 relative w-full h-48">
            <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={handleRemovePhoto}>Remove</Button>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Create Item</Button>
    </form>
    </div>
  );
}
