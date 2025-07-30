"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductUpdateForm({ product, category, onUpdate, onClose }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    description: '',
    totalProduct: '',
    category: '',
    tag: [],
    weights: [],
    photos: []
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        minPrice: product.minPrice || '',
        maxPrice: product.maxPrice || '',
        discount: product.discount || '',
        description: product.description || '',
        totalProduct: product.totalProduct || '',
        category: product.category || category,
        tag: product.tag || [],
        weights: product.weights || [],
        photos: product.photos || []
      });
      setPreview(product.photos || []);
    }
  }, [product, category]);

  // Check if all required fields are filled
  const isFormValid = () => {
    if (!form.name.trim()) return false;
    if (!form.minPrice || isNaN(Number(form.minPrice))) return false;
    if (!form.maxPrice || isNaN(Number(form.maxPrice))) return false;
    if (form.discount === '' || isNaN(Number(form.discount))) return false;
    if (!form.totalProduct || isNaN(Number(form.totalProduct))) return false;
    if (!form.tag || !Array.isArray(form.tag) || form.tag.length === 0) return false;
    if (!form.weights || !Array.isArray(form.weights) || form.weights.length === 0) return false;
    for (const w of form.weights) {
      if (!w.weight || !w.price || isNaN(Number(w.price))) return false;
    }
    return true;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };
    
    // If discount changes, update all weights' discountPrice
    if (name === 'discount') {
      const discount = parseFloat(value);
      updatedForm.weights = updatedForm.weights.map(w => {
        const price = parseFloat(w.price);
        return {
          ...w,
          discountPrice: (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : ''
        };
      });
    }
    
    setForm(updatedForm);
  };

  // Handle weight row change
  const handleWeightChange = (idx, field, value) => {
    setForm(prev => {
      const updated = { ...prev };
      updated.weights = [...updated.weights];
      updated.weights[idx] = {
        ...updated.weights[idx],
        [field]: value,
      };
      
      // Update discountPrice if price or discount changes
      const price = parseFloat(updated.weights[idx].price);
      const discount = parseFloat(updated.discount);
      updated.weights[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      
      return updated;
    });
  };

  // Add new weight row
  const handleAddWeight = () => {
    setForm(prev => ({
      ...prev,
      weights: [...prev.weights, { weight: '', price: '', discountPrice: '' }]
    }));
  };

  // Remove weight row
  const handleRemoveWeight = (idx) => {
    setForm(prev => ({
      ...prev,
      weights: prev.weights.filter((_, i) => i !== idx)
    }));
  };

  const handleFiles = e => {
    let selected = Array.from(e.target.files);
    let newFiles = [...files, ...selected];
    
    // Remove duplicates by name+size
    newFiles = newFiles.filter(
      (file, idx, arr) =>
        arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
    );
    
    if (newFiles.length > 5) {
      setPhotoError("You can upload up to 5 photos only.");
      newFiles = newFiles.slice(0, 5);
    } else {
      setPhotoError("");
    }
    
    setFiles(newFiles);
    setPreview(newFiles.map(file => URL.createObjectURL(file)));
  };

  const handleTagChange = (option) => {
    setForm((prev) => {
      const already = prev.tag.includes(option);
      return {
        ...prev,
        tag: already ? prev.tag.filter(t => t !== option) : [...prev.tag, option]
      };
    });
  };

  const handleRemovePhoto = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreview(newPreview);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const formToSubmit = { ...form };
      const data = new FormData();
      
      Object.entries(formToSubmit).forEach(([k, v]) => {
        if (k === 'tag') {
          v.forEach(val => data.append('tag', val));
        } else if (k === 'photos') {
          // Don't append existing photos here
        } else {
          data.append(k, v);
        }
      });
      
      // Add weights as JSON string
      data.append('weights', JSON.stringify(form.weights));
      
      // Add new files
      files.forEach(f => data.append('photos', f));
      
      const res = await fetch(`${API_BASE_URL}/${category.toLowerCase()}/update:${product._id}`, { 
        method: 'PUT', 
        body: data 
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      onUpdate && onUpdate(result);
      setIsOpen(false);
      
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose && onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update {category} Product</DialogTitle>
          <DialogDescription>
            Update the product information. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error: {error}</p>
            </div>
          )}
          
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name"
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Product Name" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku"
                  name="sku" 
                  value={form.sku} 
                  onChange={handleChange} 
                  placeholder="SKU" 
                />
              </div>
              <div>
                <Label htmlFor="minPrice">Min Price *</Label>
                <Input 
                  id="minPrice"
                  name="minPrice" 
                  type="number" 
                  value={form.minPrice} 
                  onChange={handleChange} 
                  placeholder="Min Price" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price *</Label>
                <Input 
                  id="maxPrice"
                  name="maxPrice" 
                  type="number" 
                  value={form.maxPrice} 
                  onChange={handleChange} 
                  placeholder="Max Price" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="discount">Discount (%)</Label>
                <Input 
                  id="discount"
                  name="discount" 
                  type="number" 
                  value={form.discount} 
                  onChange={handleChange} 
                  placeholder="Discount (%)" 
                />
              </div>
              <div>
                <Label htmlFor="totalProduct">Total Product *</Label>
                <Input 
                  id="totalProduct"
                  name="totalProduct" 
                  type="number" 
                  value={form.totalProduct} 
                  onChange={handleChange} 
                  placeholder="Total Product" 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category"
                  name="category" 
                  value={form.category} 
                  onChange={handleChange} 
                  placeholder="Category" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Weights and Prices */}
          <Card>
            <CardHeader>
              <CardTitle>Weights and Prices *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {form.weights.map((w, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-4 border rounded-lg">
                    <Input
                      className="w-1/3"
                      placeholder="Weight (e.g. 500g, 1kg)"
                      value={w.weight}
                      onChange={e => handleWeightChange(idx, 'weight', e.target.value)}
                      required
                    />
                    <Input
                      className="w-1/3"
                      type="number"
                      placeholder="Price"
                      value={w.price}
                      onChange={e => handleWeightChange(idx, 'price', e.target.value)}
                      required
                    />
                    <Input
                      className="w-1/3"
                      type="number"
                      placeholder="Discounted Price (auto)"
                      value={w.discountPrice}
                      readOnly
                    />
                    <Button 
                      type="button" 
                      onClick={() => handleRemoveWeight(idx)} 
                      variant="destructive" 
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={handleAddWeight} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Weight
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Product description..." 
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Add New Photos (1-5 allowed)</Label>
                  <Input 
                    name="photos" 
                    type="file" 
                    multiple 
                    onChange={handleFiles} 
                    accept="image/*" 
                  />
                  {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
                </div>
                
                {/* Existing Photos */}
                {form.photos.length > 0 && (
                  <div>
                    <Label>Existing Photos</Label>
                    <div className="flex flex-row gap-3 mt-2 flex-wrap">
                      {form.photos.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`Product ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded border"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Photo Previews */}
                {preview.length > 0 && (
                  <div>
                    <Label>New Photo Previews</Label>
                    <div className="flex flex-row gap-3 mt-2 flex-wrap">
                      {preview.map((url, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags *</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.tag.map((t) => (
                    <Badge key={t} variant="secondary" className="px-3 py-1">
                      {t}
                    </Badge>
                  ))}
                  {form.tag.length === 0 && <span className="text-gray-400 text-sm">No tags selected</span>}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {['Apsara', 'Glass Marking', 'White Pencil', 'Pencil', 'Adhesive', 'Glue', 'Sealant'].map(option => (
                    <button
                      type="button"
                      key={option}
                      className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                        form.tag.includes(option) 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                      }`}
                      onClick={() => handleTagChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid() || loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 