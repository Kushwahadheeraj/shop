"use client";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('id');
  const isEditing = !!editId;

  const [form, setForm] = useState({
    name: '',
  });
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState("");

  // Load existing data if editing
  useEffect(() => {
    if (isEditing && editId) {
      fetchCategoryData();
    }
  }, [isEditing, editId]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/home/categories/getOne/${editId}`);
      if (res.ok) {
        const data = await res.json();
        const category = data.data || data;
        
        setForm({ name: category.name || '' });
        setItems(category.items || []);
        setExistingImage(category.image || '');
        if (category.image) {
          setPreview(category.image);
        }
      } else {
        alert('Error loading category data');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error loading category data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle adding new item
  const handleAddItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      setItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  // Handle removing item
  const handleRemoveItem = (itemToRemove) => {
    setItems(prev => prev.filter(item => item !== itemToRemove));
  };

  // Handle Enter key for adding items
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
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
    setExistingImage("");
  };

  const isFormValid = () => {
    return form.name && items.length > 0 && (file || existingImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields, add at least one item, and upload an image");
      return;
    }

    const data = new FormData();
    data.append('name', form.name);
    // Add each item separately
    items.forEach(item => {
      data.append('items', item);
    });
    
    // Only append image if a new file is selected
    if (file) {
      data.append('image', file);
    }

    try {
      const url = isEditing 
        ? `${API_BASE_URL}/home/categories/update/${editId}`
        : `${API_BASE_URL}/home/categories/create`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, { 
        method, 
        body: data 
      });
      
      if (res.ok) {
        alert(isEditing ? 'Category updated successfully!' : 'Category created successfully!');
        if (isEditing) {
          router.push('/ProductList/Home/Categories');
        } else {
          setForm({ name: ''});
          setItems([]);
          setNewItem('');
          setFile(null);
          setPreview(null);
          setExistingImage("");
        }
      } else {
        alert(isEditing ? 'Error updating category' : 'Error creating category');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(isEditing ? 'Error updating category' : 'Error creating category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading category data...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{isEditing ? 'Edit Category' : 'Add Category'}</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center gap-4 mb-6">
        {isEditing && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/ProductList/Home/Categories')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        </div>
      
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Category Name</label>
        <Input 
          name="name" 
          value={form.name} 
          onChange={handleChange} 
          placeholder="Enter category name" 
          required 
          className="w-full focus:ring-amber-300 focus:border-amber-500 text-sm sm:text-base"
        />
      </div>

      {/* Items */}
      <div>
        <label className="block text-sm font-medium mb-2">Items</label>
        <div className="flex gap-2 mb-2">
          <Input 
            value={newItem} 
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add item (e.g., Wallpaper)" 
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddItem}
            disabled={!newItem.trim()}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Display added items */}
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {items.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Category Image</label>
        <Input 
          name="image" 
          type="file" 
          onChange={handleFile} 
          accept="image/*" 
          required={!isEditing || !existingImage}
          className="w-full focus:ring-amber-300 focus:border-amber-500 text-sm sm:text-base"
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
        {isEditing ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
    </div>
  );
}
