"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm({ productId }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    section: 'Construction',
    name: '',
    link: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/home/heroproductcard/getOne/${productId}`);
      const data = await res.json();
      if (data.success) {
        setForm({
          section: data.data.section,
          name: data.data.name,
          link: data.data.link
        });
        setPreview(data.data.image);
      } else {
        alert("Failed to fetch product details");
      }
    } catch (error) {
            alert("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

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
    // If editing (productId exists), image is optional if we already have a preview (existing image)
    const hasImage = file || (productId && preview);
    return form.name && form.section && form.link && hasImage;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }
    
    setLoading(true);
    setPhotoError("");

    const data = new FormData();
    data.append('section', form.section);
    data.append('name', form.name);
    data.append('link', form.link);
    if (file) {
      data.append('image', file);
    }

    try {
      const url = productId 
        ? `${API_BASE_URL}/home/heroproductcard/update/${productId}`
        : `${API_BASE_URL}/home/heroproductcard/create`;
        
      const method = productId ? 'PUT' : 'POST';

      const res = await fetch(url, { 
        method: method, 
        body: data 
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        alert(productId ? 'Item updated successfully!' : 'Item created successfully!');
        if (!productId) {
          setForm({ ...form, name: '', link: '' }); // Keep section
          setFile(null);
          setPreview(null);
        }
      } else {
        alert(result.message || 'Error saving item');
      }
    } catch (error) {
            alert('Error saving item');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            {productId ? 'Edit Hero Product Card' : 'Add Hero Product Card'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-blue-50">
          {productId ? 'Update details for this product card' : 'Add products to the hero section cards on homepage'}
        </p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Section Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Section</label>
        <select
          name="section"
          value={form.section}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="Construction">Construction</option>
          <option value="Home Decor">Home Decor</option>
          <option value="Electrical">Electrical</option>
          <option value="Tools">Tools</option>
        </select>
      </div>

      {/* name */}
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input 
        name="name" 
        value={form.name} 
        onChange={handleChange} 
        placeholder="Enter product name" 
        required 
        />
      </div>

      {/* link */}
      <div>
        <label className="block text-sm font-medium mb-2">Shop Page Link</label>
        <Input 
        name="link" 
        value={form.link} 
        onChange={handleChange} 
        placeholder="e.g. /ShopPage/Construction" 
        required
        />
        <p className="text-xs text-gray-500 mt-1">Enter the path where this card should navigate to</p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Product Image</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="text-xs text-gray-500">Click to upload image</p>
            </div>
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
        </div>
        {photoError && <p className="text-sm text-red-500">{photoError}</p>}
      </div>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]">
        {loading ? 'Processing...' : (productId ? 'Update Product' : 'Add Product')}
      </Button>
    </form>
    </div>
  );
}