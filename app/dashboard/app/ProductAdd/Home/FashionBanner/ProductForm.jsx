"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    link: '',
    buttonText: 'Shop Now',
    backgroundColor: '#f3f4f6',
    contentPosition: 'left',
    verticalAlign: 'center'
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
    data.append('title', form.title);
    data.append('subtitle', form.subtitle);
    data.append('link', form.link);
    data.append('buttonText', form.buttonText);
    data.append('backgroundColor', form.backgroundColor);
    data.append('contentPosition', form.contentPosition);
    data.append('verticalAlign', form.verticalAlign);
    data.append('image', file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/fashionbanner/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Item created successfully!');
        setForm({
          title: '',
          subtitle: '',
          link: '',
          buttonText: 'Shop Now',
          backgroundColor: '#f3f4f6',
          contentPosition: 'left',
          verticalAlign: 'center'
        });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating item');
    }
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Fashion Banner</h1>
        </div>
        <p className="text-xs sm:text-sm text-purple-50">Fill in the banner details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input 
        name="title" 
        value={form.title} 
        onChange={handleChange} 
        placeholder="Enter banner title" 
        required
        className="w-full"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium mb-2">Subtitle</label>
        <Input 
        name="subtitle" 
        value={form.subtitle} 
        onChange={handleChange} 
        placeholder="Enter banner subtitle" 
        className="w-full"
        />
      </div>

      {/* Link */}
      <div>
        <label className="block text-sm font-medium mb-2">Link (Optional)</label>
        <Input 
        name="link" 
        value={form.link} 
        onChange={handleChange} 
        placeholder="Enter redirect link" 
        className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Button Text</label>
        <Input 
        name="buttonText" 
        value={form.buttonText} 
        onChange={handleChange} 
        placeholder="Enter button text (e.g. Shop Now)" 
        className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Background Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            name="backgroundColor"
            value={form.backgroundColor}
            onChange={handleChange}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer bg-transparent"
          />
          <Input
            type="text"
            name="backgroundColor"
            value={form.backgroundColor}
            onChange={handleChange}
            placeholder="e.g. #f3f4f6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Image Position</label>
          <select
            name="contentPosition"
            value={form.contentPosition}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="left">Image Left, Text Right</option>
            <option value="right">Image Right, Text Left</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Vertical Alignment</label>
          <select
            name="verticalAlign"
            value={form.verticalAlign}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
          >
            <option value="start">Top</option>
            <option value="center">Center</option>
            <option value="end">Bottom</option>
          </select>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Banner Image (Required)</label>
        <div className="flex items-center justify-center w-full">
          {!preview ? (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Sparkles className="w-8 h-8 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload image</p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
          ) : (
            <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden group border border-gray-200">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  type="button"
                  variant="destructive" 
                  size="sm"
                  onClick={handleRemovePhoto}
                >
                  Remove Photo
                </Button>
              </div>
            </div>
          )}
        </div>
        {photoError && <p className="text-sm text-red-500">{photoError}</p>}
      </div>

      <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 rounded-lg transition-all transform hover:scale-[1.02]">
        Create Banner
      </Button>
    </form>
    </div>
  );
}
