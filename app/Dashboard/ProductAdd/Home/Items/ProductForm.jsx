"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    id: '',
    image: '',
    alt: '',
    overlay: false,
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    textColor: 'text-white',
    content: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked) => {
    setForm(prev => ({ ...prev, overlay: checked }));
  };

  const handleSelectChange = (value) => {
    setForm(prev => ({ ...prev, textColor: value }));
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
    return form.id && form.title && form.description && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('id', form.id);
    data.append('image', form.image);
    data.append('alt', form.alt);
    data.append('overlay', form.overlay);
    data.append('title', form.title);
    data.append('subtitle', form.subtitle);
    data.append('description', form.description);
    data.append('buttonText', form.buttonText);
    data.append('textColor', form.textColor);
    data.append('content', form.content);
    data.append('uploadedImage', file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/items/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Item created successfully!');
        setForm({
          id: '',
          image: '',
          alt: '',
          overlay: false,
          title: '',
          subtitle: '',
          description: '',
          buttonText: '',
          textColor: 'text-white',
          content: '',
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Items Product</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Path */}
        <div>
          <label className="block text-sm font-medium mb-2">Image Path</label>
          <Input 
            name="image" 
            value={form.image} 
            onChange={handleChange} 
            placeholder="/images/banner1.jpg" 
            className="w-full"
          />
        </div>

        {/* Alt Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Alt Text</label>
          <Input 
            name="alt" 
            value={form.alt} 
            onChange={handleChange} 
            placeholder="Enter alt text" 
            className="w-full"
          />
        </div>

        {/* Overlay */}
        <div className="flex items-center space-x-2">
          <Switch 
            checked={form.overlay} 
            onCheckedChange={handleSwitchChange}
          />
          <label className="text-sm font-medium">Has Overlay</label>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="Enter title" 
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
            placeholder="Enter subtitle" 
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description </label>
          <Textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Enter description" 
            required 
            className="w-full"
            rows={3}
          />
        </div>
        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium mb-2">Text Color</label>
          <Select value={form.textColor} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select text color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text-white">White</SelectItem>
              <SelectItem value="text-black">Black</SelectItem>
              <SelectItem value="text-gray-800">Dark Gray</SelectItem>
              <SelectItem value="text-blue-600">Blue</SelectItem>
              <SelectItem value="text-red-600">Red</SelectItem>
            </SelectContent>
          </Select>
        </div>
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Upload Image *</label>
        <Input 
          name="uploadedImage" 
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
        Create Item
      </Button>
      </div>
    </form>
  );
}
