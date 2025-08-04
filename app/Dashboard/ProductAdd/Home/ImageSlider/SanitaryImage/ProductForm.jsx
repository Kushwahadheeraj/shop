"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    mainText: '',
    subtext: '',
    descText: '',
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
    return form.mainText && form.subtext && form.descText && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('mainText', form.mainText);
    data.append('subtext', form.subtext);
    data.append('descText', form.descText);
    data.append('uploadedImage', file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/imageslider/sanitaryimage/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Image Slider item created successfully!');
        setForm({
          mainText: '',
          subtext: '',
          descText: '',
        });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating image slider item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating image slider item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Sanitary Image Slider</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Main Text</label>
          <Input 
            name="mainText" 
            value={form.mainText} 
            onChange={handleChange} 
            placeholder="Enter main text" 
            required 
            className="w-full"
          />
        </div>

        {/* Sub Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Sub Text </label>
          <Input 
            name="subtext" 
            value={form.subtext} 
            onChange={handleChange} 
            placeholder="Enter sub text" 
            required 
            className="w-full"
          />
        </div>
      
      </div>

      {/* Description Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Description Text </label>
        <Textarea 
          name="descText" 
          value={form.descText} 
          onChange={handleChange} 
          placeholder="Enter description text" 
          required 
          className="w-full"
          rows={3}
        />
      </div>


      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Upload Image</label>
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

      {/* Preview Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            {preview && (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{form.mainText || 'Main Text'}</h3>
            <p className="text-lg mb-2">{form.subtext || 'Sub Text'}</p>
            <p className="text-sm text-gray-600 mb-2">{form.descText || 'Description Text'}</p>
            {form.descText && <p className="text-xs text-gray-500">{form.descText}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isFormValid()}
      >
        Create Image Slider Item
      </Button>
    </form>
  );
}
