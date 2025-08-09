"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Upload, Trash2 } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    finish: '',
    price: '',
    discount: '',
    discountPrice: '',
    tags: [],
    colors: [],
    isActive: true
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  // Predefined color options based on the image
  const colorOptions = [
    "Aquamarine", "Blue Bell White", "Brandy", "Brilliant White", "Cascade Green",
    "Dark Green", "Dawn", "Deep Mahogany", "Deep Orange", "French Blue",
    "Golden Yellow", "Imperial Crimson", "Lemon Yellow", "Mid Buff", "Mint Green",
    "Off White", "P.O. Red", "Pale Cream", "Pale Rose", "Pista",
    "Raw Silk", "Royal Ivory", "Sandstone", "Satin Blue", "Signal Red",
    "T-Dawn Glow", "Wild Lilac", "Wild Purple"
  ];

  // Auto-calculate discount price
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'price' || name === 'discount') {
        const price = parseFloat(name === 'price' ? value : prev.price);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        if (!isNaN(price) && !isNaN(discount)) {
          updated.discountPrice = (price - (price * discount / 100)).toFixed(2);
        } else if (!isNaN(price)) {
          updated.discountPrice = price.toFixed(2);
        } else {
          updated.discountPrice = '';
        }
      }
      return updated;
    });
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Multiple image handling
  const handleFiles = (selectedFiles) => {
    console.log('handleFiles called with:', selectedFiles);
    const fileArray = Array.from(selectedFiles);
    console.log('File array:', fileArray);
    
    // Check if adding these files would exceed the limit
    if (files.length + fileArray.length > 8) {
      setPhotoError("You can upload maximum 8 images only.");
      return;
    }

    // Filter valid image files
    const validFiles = fileArray.filter(file => {
      console.log('Checking file:', file.name, file.type, file.size);
      if (!file.type.startsWith('image/')) {
        setPhotoError("Please select only image files.");
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setPhotoError("Each image should be less than 10MB.");
        return false;
      }
      return true;
    });

    console.log('Valid files:', validFiles.length);

    if (validFiles.length === 0) return;

    // Create previews for new files
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
    setPhotoError("");
    console.log('Files and previews updated');
  };

  const handleFileInput = (e) => {
    console.log('File input changed:', e.target.files);
    handleFiles(e.target.files);
  };

  const handleFileButtonClick = (inputId) => {
    console.log('File button clicked for:', inputId);
    const fileInput = document.getElementById(inputId);
    if (fileInput) {
      console.log('File input found, triggering click');
      fileInput.click();
    } else {
      console.log('File input not found for ID:', inputId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    console.log('Files dropped:', droppedFiles);
    handleFiles(droppedFiles);
  };

  const handleRemoveImage = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
    setPhotoError("");
  };

  // Tags handling
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Colors handling
  const handleAddColor = () => {
    if (colorInput.trim() && !form.colors.includes(colorInput.trim())) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, colorInput.trim()] }));
      setColorInput("");
    }
  };

  const handleRemoveColor = (colorToRemove) => {
    setForm(prev => ({ ...prev, colors: prev.colors.filter(color => color !== colorToRemove) }));
  };

  const handleColorKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddColor();
    }
  };

  const handleColorSelect = (color) => {
    if (!form.colors.includes(color)) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
  };

  const isFormValid = () => {
    return form.name && form.price && files.length >= 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload at least 1 image");
      return;
    }

    console.log('Form validation passed');
    console.log('Files to upload:', files.length);

    const data = new FormData();
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('brand', form.brand);
    data.append('finish', form.finish);
    data.append('price', form.price);
    data.append('discount', form.discount);
    data.append('tags', form.tags.join(','));
    data.append('colors', form.colors.join(','));
    data.append('isActive', form.isActive);
    
    // Append all images
    files.forEach((file, index) => {
      console.log(`Appending file ${index + 1}:`, file.name, file.size);
      data.append('images', file);
    });

    try {
      const res = await fetch(`${API_BASE_URL}/home/paints/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Paint product created successfully!');
        setForm({
          name: '',
          description: '',
          category: '',
          brand: '',
          finish: '',
          price: '',
          discount: '',
          discountPrice: '',
          tags: [],
          colors: [],
          isActive: true
        });
        setFiles([]);
        setPreviews([]);
        setTagInput("");
        setColorInput("");
        setPhotoError("");
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Error creating paint product');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating paint product');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Paint Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Multiple Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Product Images * (Min: 1, Max: 8)
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => {
                if (previews.length === 0) {
                  handleFileButtonClick('image-upload-main');
                }
              }}
            >
              {previews.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {previews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  {files.length < 8 && (
                    <div className="flex gap-2 justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        multiple
                        className="hidden"
                        id="image-upload-more"
                      />
                      <label htmlFor="image-upload-more" className="cursor-pointer">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => handleFileButtonClick('image-upload-more')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add More Images
                        </Button>
                      </label>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    {files.length}/8 images uploaded
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-gray-600 mb-4">
                    <p className="font-medium">Drag and drop images here</p>
                    <p className="text-sm">or click to browse</p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG up to 10MB each (Max 8 images)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    multiple
                    className="hidden"
                    id="image-upload-main"
                  />
                  <label htmlFor="image-upload-main" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => handleFileButtonClick('image-upload-main')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Images
                    </Button>
                  </label>
                </div>
              )}
            </div>
            {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Product Name *</label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select value={form.category} onValueChange={(value) => handleSelectChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Acrylic Emulsion">Acrylic Emulsion</SelectItem>
                <SelectItem value="Enamel">Enamel</SelectItem>
                <SelectItem value="Distemper">Distemper</SelectItem>
                <SelectItem value="Primer">Primer</SelectItem>
                <SelectItem value="Wall Putty">Wall Putty</SelectItem>
                <SelectItem value="Exterior Paint">Exterior Paint</SelectItem>
                <SelectItem value="Interior Paint">Interior Paint</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
            />
          </div>

          {/* Finish */}
          <div>
            <label className="block text-sm font-medium mb-2">Finish</label>
            <Select value={form.finish} onValueChange={(value) => handleSelectChange('finish', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Matte">Matte</SelectItem>
                <SelectItem value="Satin">Satin</SelectItem>
                <SelectItem value="Semi-Gloss">Semi-Gloss</SelectItem>
                <SelectItem value="Gloss">Gloss</SelectItem>
                <SelectItem value="Textured">Textured</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-2">Price (₹) *</label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium mb-2">Discount (%)</label>
            <Input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>

          {/* Discount Price (Auto-calculated) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Discounted Price (₹)</label>
            <Input
              type="text"
              value={form.discountPrice}
              readOnly
              className="bg-gray-50"
              placeholder="Auto-calculated"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Enter tag and press Enter"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, index) => (
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
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium mb-2">Colors</label>
          
          {/* Color Input */}
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={handleColorKeyPress}
              placeholder="Enter custom color and press Enter"
            />
            <Button type="button" onClick={handleAddColor} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Predefined Colors */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Or select from predefined colors:</p>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <Button
                  key={color}
                  type="button"
                  variant={form.colors.includes(color) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleColorSelect(color)}
                  className="text-xs"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Colors */}
          <div className="flex flex-wrap gap-2">
            {form.colors.map((color, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {color}
                <button
                  type="button"
                  onClick={() => handleRemoveColor(color)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={!isFormValid()}>
          Create Paint Product
        </Button>
      </form>
    </div>
  );
}
