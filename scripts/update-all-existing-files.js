const fs = require('fs');
const path = require('path');

// Function to recursively find all ProductList.jsx files
function findProductListFiles(basePath, currentPath = '') {
  const fullPath = path.join(basePath, currentPath);
  const items = fs.readdirSync(fullPath, { withFileTypes: true });
  
  const productListFiles = [];
  
  for (const item of items) {
    if (item.isDirectory()) {
      const subfolderPath = path.join(currentPath, item.name);
      const subfolderFullPath = path.join(basePath, subfolderPath);
      
      // Check if ProductList.jsx exists in this directory
      const productListPath = path.join(subfolderFullPath, 'ProductList.jsx');
      if (fs.existsSync(productListPath)) {
        productListFiles.push({
          path: subfolderPath,
          fullPath: subfolderFullPath,
          productListPath: productListPath
        });
      }
      
      // Recursively search subfolders
      const nestedFiles = findProductListFiles(basePath, subfolderPath);
      productListFiles.push(...nestedFiles);
    }
  }
  
  return productListFiles;
}

// Enhanced ProductList template based on folder depth
function getEnhancedProductListTemplate(folderPath) {
  const pathParts = folderPath.split(path.sep);
  const category = pathParts[0];
  const subcategory = pathParts[1];
  const subfolder = pathParts[2];
  
  let apiUrl, editPath, viewPath, addPath, backPath, title;
  
  if (pathParts.length === 1) {
    // Main category (e.g., Adhesives)
    apiUrl = `\${API_BASE_URL}/${category.toLowerCase()}`;
    editPath = `/Dashboard/ProductAdd/${category}`;
    viewPath = `/Dashboard/ProductView/${category.toLowerCase()}`;
    addPath = `/Dashboard/ProductAdd/${category}`;
    title = `${category} Products`;
  } else if (pathParts.length === 2) {
    // Subcategory (e.g., Electrical/Fans)
    apiUrl = `\${API_BASE_URL}/${category.toLowerCase()}/${subcategory.toLowerCase()}`;
    editPath = `/Dashboard/ProductAdd/${category}/${subcategory}`;
    viewPath = `/Dashboard/ProductView/${category.toLowerCase()}/${subcategory.toLowerCase()}`;
    addPath = `/Dashboard/ProductAdd/${category}/${subcategory}`;
    title = `${category} - ${subcategory} Products`;
  } else {
    // Sub-subcategory (e.g., Electrical/Fans/CeilingFans)
    apiUrl = `\${API_BASE_URL}/${category.toLowerCase()}/${subcategory.toLowerCase()}/${subfolder.toLowerCase()}`;
    editPath = `/Dashboard/ProductAdd/${category}/${subcategory}/${subfolder}`;
    viewPath = `/Dashboard/ProductView/${category.toLowerCase()}/${subcategory.toLowerCase()}/${subfolder.toLowerCase()}`;
    addPath = `/Dashboard/ProductAdd/${category}/${subcategory}/${subfolder}`;
    title = `${category} - ${subcategory} - ${subfolder} Products`;
  }
  
  return `"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "@/components/ProductTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, RefreshCw, ArrowLeft } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = \`${apiUrl}\`;

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
    router.push("${editPath}?id=" + product._id);
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
    router.push(\`${viewPath}/\${product._id}\`);
  };

  const handleAddNew = () => {
    router.push("${addPath}");
  };

  ${pathParts.length > 1 ? `
  const handleBackToParent = () => {
    ${pathParts.length === 2 ? 
      `router.push("/Dashboard/ProductList/${category}");` : 
      `router.push("/Dashboard/ProductList/${category}/${subcategory}");`
    }
  };` : ''}

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
            <div className="flex items-center gap-4">
              ${pathParts.length > 1 ? `
              <Button 
                variant="outline" 
                onClick={handleBackToParent}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to ${pathParts.length === 2 ? category : subcategory}
              </Button>` : ''}
              <CardTitle>${title}</CardTitle>
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
            category="${title}"
          />
        </CardContent>
      </Card>
    </div>
  );
}`;
}

// Function to update a ProductList.jsx file
function updateProductListFile(fileInfo) {
  try {
    const enhancedContent = getEnhancedProductListTemplate(fileInfo.path);
    fs.writeFileSync(fileInfo.productListPath, enhancedContent);
    console.log(`✅ Updated ${fileInfo.path}/ProductList.jsx`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${fileInfo.path}/ProductList.jsx:`, error.message);
    return false;
  }
}

// Function to update page.js files
function updatePageFile(fileInfo) {
  const pagePath = path.join(fileInfo.fullPath, 'page.js');
  
  if (fs.existsSync(pagePath)) {
    try {
      const folderName = fileInfo.path.split(path.sep).pop();
      const pageContent = `import ProductList from './ProductList';

export default function ${folderName.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <div>
      <ProductList />
    </div>
  );
}`;
      
      fs.writeFileSync(pagePath, pageContent);
      console.log(`✅ Updated ${fileInfo.path}/page.js`);
      return true;
    } catch (error) {
      console.error(`❌ Error updating ${fileInfo.path}/page.js:`, error.message);
      return false;
    }
  }
  return false;
}

// Main execution
console.log('🚀 Starting update of all existing ProductList files...\n');

const productListBasePath = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList');

if (!fs.existsSync(productListBasePath)) {
  console.error('❌ ProductList directory not found!');
  process.exit(1);
}

try {
  const productListFiles = findProductListFiles(productListBasePath);
  
  console.log(`📁 Found ${productListFiles.length} ProductList.jsx files to update\n`);
  
  let updatedCount = 0;
  let pageUpdatedCount = 0;
  
  productListFiles.forEach(fileInfo => {
    console.log(`📝 Processing ${fileInfo.path}...`);
    
    // Update ProductList.jsx
    if (updateProductListFile(fileInfo)) {
      updatedCount++;
    }
    
    // Update page.js
    if (updatePageFile(fileInfo)) {
      pageUpdatedCount++;
    }
    
    console.log('');
  });
  
  console.log('✨ Update completed!');
  console.log(`📊 Summary:`);
  console.log(`- Updated ${updatedCount} ProductList.jsx files`);
  console.log(`- Updated ${pageUpdatedCount} page.js files`);
  console.log(`- Total files processed: ${productListFiles.length}`);
  
  console.log('\n📝 Features added to all files:');
  console.log('- Enhanced error handling');
  console.log('- Loading states with spinners');
  console.log('- Refresh functionality');
  console.log('- Add new product buttons');
  console.log('- Back navigation (for subfolders)');
  console.log('- Consistent API structure');
  console.log('- Modern shadcn UI components');
  
} catch (error) {
  console.error('❌ Error during update process:', error.message);
  process.exit(1);
} 