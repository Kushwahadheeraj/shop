const fs = require('fs');
const path = require('path');

// Categories that need to be updated
const categories = [
  'Adhesives', 'Brush', 'Cements', 'Cleaning', 'Dry', 'Electrical', 
  'Fiber', 'Fitting', 'Hardware', 'Home', 'HomeDecor', 'Locks', 
  'Paint', 'Pipe', 'PvcMats', 'Roofer', 'Sanitary', 'Tools', 
  'Uncategorized', 'WaterProofing'
];

// Template for ProductList.jsx
const productListTemplate = (category) => `"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = \`\${API_BASE_URL}/${category.toLowerCase()}\`;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL + '/get');
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    router.push("/Dashboard/ProductAdd/${category}?id=" + product._id);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(API_URL + '/delete:' + id, { method: "DELETE" });
      if (!res.ok) {
        throw new Error(\`HTTP error! status: \${res.status}\`);
      }
      await fetchProducts(); // Refresh the list
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
    }
  };

  const handleView = (product) => {
    router.push(\`/Dashboard/ProductView/${category.toLowerCase()}/\${product._id}\`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/${category}");
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>${category} Products</CardTitle>
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
              <p className="text-red-600">Error: {error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchProducts}
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            category="${category}"
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

// Template for page.js
const pageTemplate = (category) => `import ProductList from './ProductList';

export default function ${category}Page() {
  return (
    <div>
      <ProductList />
    </div>
  );
}`;

// Function to update a category
function updateCategory(category) {
  const basePath = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList', category);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
  
  // Update ProductList.jsx
  const productListPath = path.join(basePath, 'ProductList.jsx');
  fs.writeFileSync(productListPath, productListTemplate(category));
  console.log(`✅ Updated ${category}/ProductList.jsx`);
  
  // Update page.js
  const pagePath = path.join(basePath, 'page.js');
  fs.writeFileSync(pagePath, pageTemplate(category));
  console.log(`✅ Updated ${category}/page.js`);
}

// Update all categories
console.log('🚀 Starting ProductList updates...\n');

categories.forEach(category => {
  try {
    updateCategory(category);
  } catch (error) {
    console.error(`❌ Error updating ${category}:`, error.message);
  }
});

console.log('\n✨ All ProductList files have been updated!');
console.log('\n📝 Next steps:');
console.log('1. Check that all API endpoints exist in your backend');
console.log('2. Test the update and delete functionality');
console.log('3. Verify that the routing works correctly'); 