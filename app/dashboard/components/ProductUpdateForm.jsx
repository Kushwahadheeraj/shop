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
import { colorOptions } from "@/lib/colorOptions";

// Function to map category display names to API endpoints
const getCategoryEndpoint = (category) => {
  // Special mappings for complex categories
  const categoryMap = {
    'Adhesives Products': 'adhesives',
    'Brush Products': 'brush',
    'Cements Products': 'cements',
    'Cleaning Products': 'cleaning',
    'Dry Products': 'dry',
    'Electrical Products': 'electrical',
    'Fiber Products': 'fiber',
    'Fitting Products': 'fitting',
    'Hardware Products': 'hardware',
    'Home Products': 'home',
    'Home Decor Products': 'homedecor',
    'Locks Products': 'locks',
    'Paint Products': 'paint',
    'Pipe Products': 'pipe',
    'PVC Mats Products': 'pvcmats',
    'Roofer Products': 'roofer',
    'Roofer - Shingles Products': 'roofer/shingles',
    'Roofer - Metal Products': 'roofer/metal',
    'Roofer - Cements Sheet Products': 'roofer/cements-sheet',
    'Roofer - Color Sheet Products': 'roofer/color-sheet',
    'Roofer - Fiber Sheet Products': 'roofer/fiber-sheet',
    'Roofer - Aluminium Sheet Products': 'roofer/aluminium-sheet',
    'Roofer - Teen Sheet Products': 'roofer/teen-sheet',
    'Sanitary Products': 'sanitary',
    'Tools Products': 'tools',
    'Uncategorized Products': 'uncategorized',
    'Water Proofing Products': 'waterproofing'
  };
  
  // Check if we have a direct mapping
  if (categoryMap[category]) {
    return categoryMap[category];
  }
  
  // Handle Sanitary subcategories automatically
  if (category.startsWith('Sanitary - ')) {
    const subcategory = category.replace('Sanitary - ', '').replace(' Products', '');
    
    // Convert to kebab-case and handle special cases
    let endpoint = subcategory
      .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
      .replace(/\s+/g, '-') // spaces to hyphens
      .toLowerCase();
    
    // Handle special cases
    if (endpoint.includes('kitchensinks')) {
      endpoint = endpoint.replace('kitchensinks', 'kitchen-sinks');
    }
    if (endpoint.includes('bathroomaccessories')) {
      endpoint = endpoint.replace('bathroomaccessories', 'bathroom-accessories');
    }
    if (endpoint.includes('waterclosets')) {
      endpoint = endpoint.replace('waterclosets', 'water-closets');
    }
    if (endpoint.includes('washbasins')) {
      endpoint = endpoint.replace('washbasins', 'washbasins');
    }
    
    return `sanitary/${endpoint}`;
  }
  
  // Default fallback
  return category.toLowerCase().replace(/\s+/g, '');
};

// Try to derive the correct Paint update sub-endpoint from product data
const getPaintUpdateSubEndpoint = (product) => {
  // Prefer explicit slug fields if present
  const candidates = [
    product?.endpointSlug,
    product?.categorySlug,
    product?.subCategorySlug,
    product?.subCategory,
    product?.category,
  ].filter(Boolean);

  let raw = candidates[0] || '';

  // Normalize camelCase/PascalCase to kebab-case
  let slug = String(raw)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
  

  // Known special cases mapping (extend as needed)
  if (["satinenamel", "satin-enamel"].includes(slug)) {
    return "enamel-satin-enamel";
  }
  if (["exterioremulsion", "exterior-emulsion"].includes(slug)) {
    return "emulsion-exterior-emulsion";
  }
  if (["interioremulsion", "interior-emulsion"].includes(slug)) {
    return "emulsion-interior-emulsion";
  }
  if (["exteriorpaints", "exterior-paints", "exteriorpaintsproducts", "exterior-paints-products"].includes(slug)) {
    return "exterior-paints";
  }
  if (["interiorpaints", "interior-paints"].includes(slug)) {
    return "interior-paints";
  }
  if (["floorpaints", "floor-paints"].includes(slug)) {
    return "floor-paints";
  }
  if (["acrylicemulsionpaint", "acrylic-emulsion-paint"].includes(slug)) {
    return "acrylic-emulsion-paint";
  }
  if (["aspapaints", "aspa-paints"].includes(slug)) {
    return "aspa-paints";
  }
  if (["spraypaints", "spray-paints"].includes(slug)) {
    return "spray-paints";
  }
  if (["paintingtools", "painting-tools"].includes(slug)) {
    return "painting-tools";
  }
  if (["brushesrollerspaintbrushes", "brushes-rollers-paint-brushes"].includes(slug)) {
    return "brushes-rollers-paint-brushes";
  }
  if (["brushesrollersspraypaints", "brushes-rollers-spray-paints"].includes(slug)) {
    return "brushes-rollers-spray-paints";
  }

  // Fallback: return slug as-is
  return slug;
};

// Try to derive the correct Electrical sub-endpoint from product data
const getElectricalUpdateSubEndpoint = (product) => {
  const text = [
    product?.endpointSlug,
    product?.categorySlug,
    product?.subCategorySlug,
    product?.subCategory,
    product?.type,
    product?.category,
    product?.name,
  ]
    .filter(Boolean)
    .join(' ') // merge for easier includes checks
    .toLowerCase();

  // Common mappings for Electrical routes
  if (text.includes('adaptor')) return 'adaptors';
  if (text.includes('switch and socket')) return 'switchAndSocket';
  if (text.includes('switch plate')) return 'switchPlates';
  if (text.includes('switches')) return 'switches';
  if (text.includes('socket')) return 'sockets';
  if (text.includes('plug')) return 'plug';
  if (text.includes('pin top')) return 'pinTop';
  if (text.includes('power strip')) return 'powerStrips';
  if (text.includes('mcb')) return 'mCB';
  if (text.includes('main switch')) return 'mainSwitch';
  if (text.includes('fuse')) return 'kITKATFuses';
  if (text.includes('pvc clip')) return 'pVCClips';
  if (text.includes('indicator')) return 'indicator';
  if (text.includes('holder')) return 'holders';
  if (text.includes('regulator')) return 'regulators';
  if (text.includes('rotary switch')) return 'rotarySwitch';
  if (text.includes('door bell')) return 'doorBells';
  if (text.includes('distribution board')) return 'distributionBoards';
  if (text.includes('dimmer')) return 'dimmer';
  if (text.includes('light')) return 'lights';

  // Wires / cables
  if (text.includes('wire') && text.includes('cable')) return 'wiresAndCables';
  if (text.includes('flexible') && text.includes('wire')) return 'flexibleWires';
  if (text.includes('flexible') && text.includes('conduit')) return 'flexibleConduit';

  // Fans
  if (text.includes('fan')) return 'fan';

  // Earthing / ELCB / RCCB
  if (text.includes('elcb') || text.includes('rccb')) return 'eLCBsRCCBs';
  if (text.includes('earthing')) return 'earthingAccessories';

  // Others catch-all
  if (text.includes('other')) return 'others';

  return '';
};

export default function ProductUpdateForm({ product, category, onUpdate, onClose }) {
  // 3 custom fields, each with a name and multiple values (same as Add form)
  const [customFields, setCustomFields] = useState([
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
  ]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    fixPrice: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    discountPrice: '',
    description: '',
    totalProduct: '',
    category: '',
    tags: [],
    colors: [],
    variants: [], // { variantName: '', fixPrice: '', discountPrice: '' }
    weights: [],
    photos: []
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [colorInput, setColorInput] = useState("");

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        fixPrice: product.fixPrice || '',
        minPrice: product.minPrice || '',
        maxPrice: product.maxPrice || '',
        discount: product.discount || '',
        discountPrice: product.discountPrice || '',
        description: product.description || '',
        totalProduct: product.totalProduct || '',
        category: product.category || category,
        tags: product.tags || product.tag || [],
        colors: product.colors || [],
        variants: product.variants || [],
        weights: product.weights || [],
        photos: product.photos || []
      });
      setPreview(product.photos || []);
      
      // Initialize custom fields from product data
      setCustomFields([
        { fieldName: product.customFieldName1 || '', fieldValues: product.customFieldValue1 || [''] },
        { fieldName: product.customFieldName2 || '', fieldValues: product.customFieldValue2 || [''] },
        { fieldName: product.customFieldName3 || '', fieldValues: product.customFieldValue3 || [''] },
      ]);
    }
  }, [product, category]);



  // Discount price auto-calc (same as Add form)
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'fixPrice' || name === 'discount') {
        const price = parseFloat(name === 'fixPrice' ? value : prev.fixPrice);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        updated.discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return updated;
    });
  };

  // Custom Fields logic (same as Add form)
  const handleCustomFieldNameChange = (idx, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[idx].fieldName = value;
      return updated;
    });
  };
  const handleCustomFieldValueChange = (fieldIdx, valueIdx, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues[valueIdx] = value;
      return updated;
    });
  };
  const handleAddCustomFieldValue = (fieldIdx) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues.push('');
      return updated;
    });
  };
  const handleRemoveCustomFieldValue = (fieldIdx, valueIdx) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues = updated[fieldIdx].fieldValues.filter((_, i) => i !== valueIdx);
      if (updated[fieldIdx].fieldValues.length === 0) updated[fieldIdx].fieldValues = [''];
      return updated;
    });
  };

  // Variants logic (same as Add form)
  const handleAddVariant = () => {
    setForm(prev => ({ ...prev, variants: [...prev.variants, { variantName: '', fixPrice: '', discountPrice: '' }] }));
  };
  const handleVariantChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...prev.variants];
      updated[idx][field] = value;
      // auto discountPrice
      if (field === 'fixPrice' || field === 'discount') {
        const price = parseFloat(field === 'fixPrice' ? value : updated[idx].fixPrice);
        const discount = parseFloat(form.discount);
        updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return { ...prev, variants: updated };
    });
  };
  const handleRemoveVariant = idx => {
    setForm(prev => {
      const updated = prev.variants.filter((_, i) => i !== idx);
      return { ...prev, variants: updated };
    });
  };

  // Tags (same as Add form)
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
  };
  const handleRemoveTag = idx => {
    setForm(prev => {
      const updated = prev.tags.filter((_, i) => i !== idx);
      return { ...prev, tags: updated };
    });
  };

  // Colors (same as Add form)
  const handleAddColor = () => {
    const color = colorInput.trim();
    if (color && !form.colors.includes(color)) {
      setForm(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
    setColorInput("");
  };
  const handleRemoveColor = idx => {
    setForm(prev => {
      const updated = prev.colors.filter((_, i) => i !== idx);
      return { ...prev, colors: updated };
    });
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
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags' || k === 'tag') {
          // Send to both 'tag' and 'tags' fields for universal compatibility
          v.forEach(val => {
            data.append('tag', val);
            data.append('tags', val);
          });
        } else if (k === 'colors') {
          v.forEach(val => data.append('colors', val));
        } else if (k === 'variants') {
          // Handle variants array properly - send as individual fields (same as Add form)
          if (v && v.length > 0) {
            v.forEach((variant, idx) => {
              data.append(`variants[${idx}][variantName]`, variant.variantName || '');
              data.append(`variants[${idx}][fixPrice]`, variant.fixPrice || '');
              data.append(`variants[${idx}][discountPrice]`, variant.discountPrice || '');
            });
          }
        } else if (k === 'photos') {
          // Don't append existing photos here
        } else {
          data.append(k, v);
        }
      });
      
      // Add custom fields (same as Add form)
      customFields.forEach((f, idx) => {
        data.append('customFieldName' + (idx+1), f.fieldName);
        f.fieldValues.forEach(val => data.append('customFieldValue' + (idx+1), val));
      });
      
      // Filter out invalid weights and add as JSON string
      const validWeights = form.weights.filter(weight => 
        weight && 
        weight.weight && 
        weight.price && 
        weight.weight.trim() !== '' && 
        !isNaN(Number(weight.price))
      );
      data.append('weights', JSON.stringify(validWeights));
      
      // Add new files
      files.forEach(f => data.append('photos', f));
      
      // Build endpoint
      let base = `${API_BASE_URL}/${getCategoryEndpoint(category)}`;
      
      // Debug logging
      
      // Paint routes use specific slugs and 'Update' with capital U
      // Check if this is a paint-related category (more flexible check)
      if (base.endsWith('/paint') || category?.toLowerCase().includes('paint') || product?.category?.toLowerCase().includes('paint')) {
        const sub = getPaintUpdateSubEndpoint(product);
        if (sub) {
          base = `${API_BASE_URL}/paint/${sub}`;
        } else {
          // If no sub-endpoint found, try to construct from product category
          const productCategory = product?.category || category;
          if (productCategory) {
            const slug = String(productCategory)
              .replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/\s+/g, '-')
              .toLowerCase();
            base = `${API_BASE_URL}/paint/${slug}`;
          }
        }
      }

      // Electrical routes are segmented under /electrical/<sub>
      if (base.endsWith('/electrical') || category === 'Electrical Products' || product?.category?.toLowerCase() === 'adaptors') {
        const subElec = getElectricalUpdateSubEndpoint(product);
        if (subElec) {
          base = `${API_BASE_URL}/electrical/${subElec}`;
        }
      }

      // Some paint routes use '/Update/:id' (capital U). Try capital U first, then fallback to lowercase 'update'
      let url = `${base}/Update/${product._id}`;
      let res = await fetch(url, { method: 'PUT', body: data });
      if (!res.ok) {
        // Fallback attempt: lowercase 'update'
        url = `${base}/update/${product._id}`;
        res = await fetch(url, { method: 'PUT', body: data });
      }
      
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      onUpdate && onUpdate(result);
      setIsOpen(false);
      
    } catch (err) {
      setError(err.message);
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
              <Label htmlFor="fixPrice">Price</Label>
              <Input 
                id="fixPrice"
                name="fixPrice" 
                type="number" 
                value={form.fixPrice} 
                onChange={handleChange} 
                placeholder="Price" 
              />
            </div>
              <div>
                <Label htmlFor="minPrice">Min Price</Label>
                <Input 
                  id="minPrice"
                  name="minPrice" 
                  type="number" 
                  value={form.minPrice} 
                  onChange={handleChange} 
                  placeholder="Min Price" 
                />
              </div>
              <div>
                <Label htmlFor="maxPrice">Max Price</Label>
                <Input 
                  id="maxPrice"
                  name="maxPrice" 
                  type="number" 
                  value={form.maxPrice} 
                  onChange={handleChange} 
                  placeholder="Max Price" 
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
              <Label htmlFor="discountPrice">Discounted Price (auto)</Label>
              <Input 
                id="discountPrice"
                name="discountPrice" 
                type="number" 
                value={form.discountPrice} 
                readOnly 
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

          {/* Variants Section */}
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="block text-sm font-medium">Variants</Label>
                  <Button type="button" onClick={handleAddVariant} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Variant</Button>
                </div>
                {form.variants.map((v, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input className="w-1/3" placeholder="Variant Name" value={v.variantName} onChange={e => handleVariantChange(idx, 'variantName', e.target.value)} />
                    <Input className="w-1/3" type="number" placeholder="Price" value={v.fixPrice} onChange={e => handleVariantChange(idx, 'fixPrice', e.target.value)} />
                    <Input className="w-1/3" type="number" placeholder="Discounted Price (auto)" value={v.discountPrice} readOnly />
                    <Button type="button" onClick={() => handleRemoveVariant(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
                  </div>
                ))}
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

          {/* Custom Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Fields</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {customFields.map((f, idx) => (
                  <div key={idx} className="mb-2 border p-2 rounded">
                    <div className="flex gap-2 items-center mb-1">
                      <Input className="w-1/3" placeholder="Field Name" value={f.fieldName} onChange={e => handleCustomFieldNameChange(idx, e.target.value)} />
                    </div>
                    {f.fieldValues.map((val, vIdx) => (
                      <div key={vIdx} className="flex gap-2 items-center mb-1">
                        <Input className="w-1/2" placeholder="Field Value" value={val} onChange={e => handleCustomFieldValueChange(idx, vIdx, e.target.value)} />
                        <Button type="button" onClick={() => handleRemoveCustomFieldValue(idx, vIdx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => handleAddCustomFieldValue(idx)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Value</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Predefined Colors Select */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Select from predefined colors:</p>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    onChange={(e) => {
                      const selectedColor = e.target.value;
                      if (selectedColor && !form.colors.includes(selectedColor)) {
                        setForm(prev => ({ ...prev, colors: [...prev.colors, selectedColor] }));
                        e.target.value = ''; // Reset select
                      }
                    }}
                  >
                    <option value="">-- Select a color --</option>
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Color Input */}
                <div className="flex gap-2 mb-2">
                  <Input 
                    value={colorInput} 
                    onChange={e => setColorInput(e.target.value)} 
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); }}} 
                    placeholder="Type custom color and press Enter or Add" 
                  />
                  <Button type="button" onClick={handleAddColor} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add</Button>
                </div>

                {/* Selected Colors Display */}
                <div className="flex flex-wrap gap-2">
                  {form.colors.map((color, idx) => (
                    <Badge key={color} variant="secondary" className="flex items-center">
                      {color}
                      <button type="button" onClick={() => handleRemoveColor(idx)} className="ml-2 text-red-500">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                  <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}} placeholder="Type tag and press Enter or Add" />
                  <Button type="button" onClick={handleAddTag} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add</Button>
                </div>
                
                {/* Predefined Tags */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Select from predefined tags:</p>
                <div className="flex flex-wrap gap-2">
                    {['Apsara', 'Glass Marking', 'White Pencil', 'Pencil', 'Adhesive', 'Glue', 'Sealant', 'Waterproof', 'Durable', 'High Quality'].map(option => (
                    <button
                      type="button"
                      key={option}
                        className={`px-3 py-1 rounded-full border text-xs font-medium transition ${
                          form.tags.includes(option) 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                      }`}
                        onClick={() => {
                          if (form.tags.includes(option)) {
                            handleRemoveTag(form.tags.indexOf(option));
                          } else {
                            setForm(prev => ({ ...prev, tags: [...prev.tags, option] }));
                          }
                        }}
                    >
                      {option}
                    </button>
                    ))}
                  </div>
                </div>

                {/* Selected Tags Display */}
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag, idx) => (
                    <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(idx)} className="ml-2 text-red-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" >
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