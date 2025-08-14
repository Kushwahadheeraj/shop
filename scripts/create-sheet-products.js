const fs = require('fs');
const path = require('path');

const sheetTypes = [
  'ColorSheet',
  'FiberSheet', 
  'AluminiumSheet',
  'TeenSheet'
];

const baseDir = path.join(__dirname, '..');

// Function to create ProductForm.jsx
function createProductForm(sheetType) {
  const content = `"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm({ onSave }) {
  // 3 custom fields, each with a name and multiple values
  const [customFields, setCustomFields] = useState([
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
  ]);
  const [form, setForm] = useState({
    name: '',
    sku: 'N/A',
    fixPrice: '',
    minPrice: '',
    maxPrice: '',
    discount: '',
    discountPrice: '',
    totalProduct: '',
    category: '${sheetType}',
    description: '',
    tags: [],
    variants: [], // { variantName: '', price: '', discountPrice: '' }
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Discount price auto-calc
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

  const calculatePriceRange = () => {
    let min = Infinity;
    let max = -Infinity;
    customFields.forEach(field => {
      field.fieldValues.forEach(val => {
        const rate = parseFloat(val);
        if (!isNaN(rate)) {
          if (rate < min) min = rate;
          if (rate > max) max = rate;
        }
      });
    });
    if (min !== Infinity && max !== -Infinity) {
      setForm(prev => ({ ...prev, minPrice: min.toString(), maxPrice: max.toString() }));
    } else {
      setForm(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
    }
  };

  // Custom Fields logic
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

  // Variants logic
  const handleAddVariant = () => {
    setForm(prev => ({ ...prev, variants: [...prev.variants, { variantName: '', price: '', discountPrice: '' }] }));
  };
  const handleVariantChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...prev.variants];
      updated[idx] = { ...updated[idx], [field]: value };
      if (field === 'price' || field === 'discount') {
        const price = parseFloat(field === 'price' ? value : updated[idx].price);
        const discount = parseFloat(field === 'discount' ? value : updated[idx].discount);
        updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return { ...prev, variants: updated };
    });
  };
  const handleRemoveVariant = (idx) => {
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  // Tags logic
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  // File handling
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      setPhotoError("Maximum 5 photos allowed");
      return;
    }
    setPhotoError("");
    setFiles(prev => [...prev, ...selectedFiles]);
    setPreview(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
  };
  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim()) {
      alert('Product name is required');
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      alert('Valid fix price is required');
      return;
    }
    if (!form.minPrice || parseFloat(form.minPrice) <= 0) {
      alert('Valid min price is required');
      return;
    }
    if (!form.maxPrice || parseFloat(form.maxPrice) <= 0) {
      alert('Valid max price is required');
      return;
    }
    if (parseFloat(form.maxPrice) < parseFloat(form.minPrice)) {
      alert('Max price must be greater than or equal to min price');
      return;
    }
    if (!form.totalProduct || parseFloat(form.totalProduct) <= 0) {
      alert('Valid total product count is required');
      return;
    }
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    if (files.length > 5) {
      setPhotoError("Maximum 5 photos allowed.");
      return;
    }

    setPhotoError("");
    const data = new FormData();
    
    // Append form data
    data.append('name', form.name);
    data.append('fixPrice', form.price); // Send 'price' as 'fixPrice'
    data.append('minPrice', form.minPrice);
    data.append('maxPrice', form.maxPrice);
    data.append('totalProduct', form.totalProduct);
    data.append('category', form.category);
    data.append('description', form.description);
    data.append('sku', form.sku);
    data.append('discount', form.discount);
    
    // Append tags and variants as JSON strings
    if (form.tags.length > 0) {
      data.append('tags', JSON.stringify(form.tags));
    }
    
    if (form.variants.length > 0) {
      data.append('variants', JSON.stringify(form.variants));
    }
    
    // Append custom fields (type options)
    const typeArray = [];
    customFields.forEach(field => {
      if (field.fieldName.trim() && field.fieldValues.some(val => val.trim())) {
        const validValues = field.fieldValues.filter(val => val.trim());
        if (validValues.length > 0) {
          typeArray.push({
            fit: field.fieldName.trim(),
            rate: parseFloat(validValues[0]) || 0
          });
        }
      }
    });
    if (typeArray.length > 0) {
      data.append('type', JSON.stringify(typeArray));
    }
    
    // Append files
    files.forEach(file => data.append('photos', file));

    try {
      const res = await fetch(\`\${API_BASE_URL}/roofer/\${form.category.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase()}/create\`, {
        method: 'POST',
        body: data
      });
      
      if (res.ok) {
        alert('Product created successfully!');
        onSave && onSave();
      } else {
        const errorData = await res.json();
        alert(\`Error: \${errorData.error || 'Failed to create product'}\`);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Add New ${sheetType} Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
            <Input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fix Price *</label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Enter fix price"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price *</label>
            <Input
              type="number"
              name="minPrice"
              value={form.minPrice}
              onChange={handleChange}
              placeholder="Enter min price"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price *</label>
            <Input
              type="number"
              name="maxPrice"
              value={form.maxPrice}
              onChange={handleChange}
              placeholder="Enter max price"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
            <Input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Product *</label>
            <Input
              type="number"
              name="totalProduct"
              value={form.totalProduct}
              onChange={handleChange}
              placeholder="Enter total product count"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Enter category"
              className="w-full"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <Textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
            className="w-full"
          />
        </div>

        {/* Type Options (Fit & Rate) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Type Options (Fit & Rate) *</label>
            <Button type="button" onClick={calculatePriceRange} variant="outline" size="sm">
              Auto-calculate from Type Options
            </Button>
          </div>
          <div className="space-y-4">
            {customFields.map((field, fieldIdx) => (
              <div key={fieldIdx} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fit Name</label>
                    <Input
                      type="text"
                      value={field.fieldName}
                      onChange={(e) => handleCustomFieldNameChange(fieldIdx, e.target.value)}
                      placeholder="Enter fit name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate (Price)</label>
                    <Input
                      type="number"
                      value={field.fieldValues[0]}
                      onChange={(e) => handleCustomFieldValueChange(fieldIdx, 0, e.target.value)}
                      placeholder="Enter rate"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <Input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Enter tag"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">Add Tag</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-blue-600 hover:text-blue-800">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Variants</label>
            <Button type="button" onClick={handleAddVariant} variant="outline" size="sm">Add Variant</Button>
          </div>
          <div className="space-y-4">
            {form.variants.map((variant, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variant Name</label>
                    <Input
                      type="text"
                      value={variant.variantName}
                      onChange={(e) => handleVariantChange(idx, 'variantName', e.target.value)}
                      placeholder="Enter variant name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                      placeholder="Enter price"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price</label>
                    <Input
                      type="number"
                      value={variant.discountPrice}
                      readOnly
                      className="w-full bg-gray-50"
                    />
                  </div>
                </div>
                <Button type="button" onClick={() => handleRemoveVariant(idx)} variant="destructive" size="sm" className="mt-3">Remove Variant</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos * (Max 5)</label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
          
          {/* Photo Preview */}
          {preview.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
              {preview.map((url, index) => (
                <div key={index} className="relative">
                  <img src={url} alt={\`Preview \${index + 1}\`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}`;

  const productAddDir = path.join(baseDir, 'app', 'Dashboard', 'ProductAdd', 'Roofer', sheetType);
  const productFormPath = path.join(productAddDir, 'ProductForm.jsx');
  
  fs.writeFileSync(productFormPath, content);
  console.log(`Created ProductForm.jsx for ${sheetType}`);
}

// Function to create page.js for ProductAdd
function createProductAddPage(sheetType) {
  const content = `import ProductForm from './ProductForm';

export default function ${sheetType}Page() {
  return <ProductForm />;
}`;

  const productAddDir = path.join(baseDir, 'app', 'Dashboard', 'ProductAdd', 'Roofer', sheetType);
  const pagePath = path.join(productAddDir, 'page.js');
  
  fs.writeFileSync(pagePath, content);
  console.log(`Created page.js for ProductAdd ${sheetType}`);
}

// Function to create ProductList.jsx
function createProductList(sheetType) {
  const apiPath = sheetType.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
  const displayName = sheetType.replace(/([A-Z])/g, ' $1').trim();
  
  const content = `"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, ArrowLeft } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = \`\${API_BASE_URL}/roofer/\${apiPath}\`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('API URL:', API_URL + '/get');
      const res = await fetch(API_URL + '/get');
      console.log('Response status:', res.status);
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      const data = await res.json();
      console.log('Response data:', data);
      console.log('Data type:', typeof data);
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not an array');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
      

  const handleEdit = (product) => {
    router.push(\`/Dashboard/ProductAdd/Roofer/\${sheetType}?id=\${product._id}\`);
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = \`\${API_URL}/delete/\${id}\`;
      console.log('Delete URL:', deleteUrl);
      const res = await fetch(deleteUrl, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      alert('Product deleted successfully!');
      await fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(\`Error deleting product: \${err.message}\`);
      setError(err.message);
    }
  };

  const handleView = (product) => {
    router.push(\`/Dashboard/ProductView/roofer/\${apiPath}/\${product._id}\`);
  };

  const handleAddNew = () => {
    router.push(\`/Dashboard/ProductAdd/Roofer/\${sheetType}\`);
  };

  
  const handleBackToParent = () => {
    router.push("/Dashboard/ProductList/Roofer");
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading products... Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              
              <Button 
                variant="outline" 
                onClick={handleBackToParent}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Roofer
              </Button>
              <CardTitle>Roofer - ${displayName} Products</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchProducts}
                disabled={loading}
              >
                <RefreshCw className={\`w-4 h-4 mr-2 \${loading ? 'animate-spin' : ''}\`} />
                Refresh
              </Button>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">Error loading products: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchProducts}
                className="mt-2"
              >
                Retry Loading
              </Button>
            </div>
          )}
          
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            category="Roofer - ${displayName} Products"
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

  const productListDir = path.join(baseDir, 'app', 'Dashboard', 'ProductList', 'Roofer', sheetType);
  const productListPath = path.join(productListDir, 'ProductList.jsx');
  
  fs.writeFileSync(productListPath, content);
  console.log(`Created ProductList.jsx for ${sheetType}`);
}

// Function to create page.js for ProductList
function createProductListPage(sheetType) {
  const content = `import ProductList from './ProductList';

export default function ${sheetType}ListPage() {
  return <ProductList />;
}`;

  const productListDir = path.join(baseDir, 'app', 'Dashboard', 'ProductList', 'Roofer', sheetType);
  const pagePath = path.join(productListDir, 'page.js');
  
  fs.writeFileSync(pagePath, content);
  console.log(`Created page.js for ProductList ${sheetType}`);
}

// Main execution
console.log('Creating sheet product files...');

sheetTypes.forEach(sheetType => {
  try {
    createProductForm(sheetType);
    createProductAddPage(sheetType);
    createProductList(sheetType);
    createProductListPage(sheetType);
    console.log(`✅ Completed ${sheetType}`);
  } catch (error) {
    console.error(`❌ Error creating files for ${sheetType}:`, error.message);
  }
});

console.log('🎉 All sheet product files created successfully!');
