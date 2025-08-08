const fs = require('fs');
const path = require('path');

// Define the Electrical subfolders to update
const electricalSubfolders = {
  'ElectricalFittings': [
    'RigidType', 'CircularSurfaceBox', 'CircularDeepBox', 'Accessories'
  ],
  'Fans': [
    'WallMountingFans', 'VentilationExhaustFans', 'TableFans', 
    'PedestalFans', 'CeilingFans', 'CabinFans'
  ],
  'Lights': [
    'WallLight', 'UnderWaterLights', 'TubeLight', 'TBulb', 'StandardIncandescent',
    'Reflectors', 'MirrorLight', 'LightElectronics', 'LedSurfaceLight', 'LEDStrips',
    'LEDStreetLight', 'LEDSpotlight', 'LEDPanelLight', 'LEDLuminaires',
    'LedDownLightersSpotLight', 'LEDBulbs', 'LEDBatten', 'Lamps', 'Home',
    'GLS', 'GateLight', 'GardenLight', 'FocusLight', 'Desklight', 'CFL', 'CeilingLight'
  ]
};

// Template for Electrical subfolder ProductList.jsx
const electricalSubfolderProductListTemplate = (mainCategory, subcategory, subfolder) => `"use client";
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

  const API_URL = \`\${API_BASE_URL}/electrical/${subcategory.toLowerCase()}/${subfolder.toLowerCase()}\`;

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
    router.push("/Dashboard/ProductAdd/Electrical/${subcategory}/${subfolder}?id=" + product._id);
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = `${API_URL}/delete/${id}`;
      console.log('Delete URL:', deleteUrl);
      const res = await fetch(deleteUrl, { method: "DELETE" });;
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
    router.push(\`/Dashboard/ProductView/electrical/${subcategory.toLowerCase()}/${subfolder.toLowerCase()}/\${product._id}\`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Electrical/${subcategory}/${subfolder}");
  };

  const handleBackToSubcategory = () => {
    router.push("/Dashboard/ProductList/Electrical/${subcategory}");
  };

  const handleBackToMain = () => {
    router.push("/Dashboard/ProductList/Electrical");
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
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleBackToMain}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Electrical
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBackToSubcategory}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  ${subcategory}
                </Button>
              </div>
              <CardTitle>Electrical - ${subcategory} - ${subfolder} Products</CardTitle>
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
            category={\`Electrical - ${subcategory} - ${subfolder}\`}
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

// Template for Electrical subfolder page.js
const electricalSubfolderPageTemplate = (subfolder) => `import ProductList from './ProductList';

export default function ${subfolder.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return (
    <div>
      <ProductList />
    </div>
  );
}`;

// Function to create Electrical subfolder files
function createElectricalSubfolder(subcategory, subfolder) {
  const basePath = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList', 'Electrical', subcategory, subfolder);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
  
  // Create ProductList.jsx
  const productListPath = path.join(basePath, 'ProductList.jsx');
  fs.writeFileSync(productListPath, electricalSubfolderProductListTemplate('Electrical', subcategory, subfolder));
  console.log(`✅ Created Electrical/${subcategory}/${subfolder}/ProductList.jsx`);
  
  // Create page.js
  const pagePath = path.join(basePath, 'page.js');
  fs.writeFileSync(pagePath, electricalSubfolderPageTemplate(subfolder));
  console.log(`✅ Created Electrical/${subcategory}/${subfolder}/page.js`);
}

// Function to update main Electrical subcategory lists
function updateElectricalSubcategoryList(subcategory, subfolders) {
  const mainListPath = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList', 'Electrical', subcategory, 'ProductList.jsx');
  
  if (!fs.existsSync(mainListPath)) {
    console.log(`⚠️  Main ProductList not found for Electrical/${subcategory}, creating...`);
    // Create the main subcategory ProductList if it doesn't exist
    const mainSubcategoryTemplate = `"use client";
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

  const API_URL = \`\${API_BASE_URL}/electrical/${subcategory.toLowerCase()}\`;

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
    router.push("/Dashboard/ProductAdd/Electrical/${subcategory}?id=" + product._id);
  };

  const handleDelete = async (id) => {
    try {
      const deleteUrl = `${API_URL}/delete/${id}`;
      console.log('Delete URL:', deleteUrl);
      const res = await fetch(deleteUrl, { method: "DELETE" });;
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
    router.push(\`/Dashboard/ProductView/electrical/${subcategory.toLowerCase()}/\${product._id}\`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Electrical/${subcategory}");
  };

  const handleBackToMain = () => {
    router.push("/Dashboard/ProductList/Electrical");
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
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={handleBackToMain}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Electrical
              </Button>
              <CardTitle>Electrical - ${subcategory} Products</CardTitle>
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
          
          {/* Subcategory Navigation */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>${subcategory} Subcategories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${subfolders.map(sub => `
                <Button
                  key="${sub}"
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => router.push("/Dashboard/ProductList/Electrical/${subcategory}/${sub}")}
                >
                  <span className="text-sm font-medium">${sub}</span>
                  <span className="text-xs text-gray-500">Manage Products</span>
                </Button>
                `).join('')}
              </div>
            </CardContent>
          </Card>
          
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            category={\`Electrical - ${subcategory}\`}
          />
        </CardContent>
      </Card>
    </div>
  );
}`;
    
    fs.writeFileSync(mainListPath, mainSubcategoryTemplate);
    console.log(`✅ Created Electrical/${subcategory}/ProductList.jsx`);
  } else {
    console.log(`ℹ️  Electrical/${subcategory}/ProductList.jsx already exists`);
  }
}

// Process all Electrical subfolders
console.log('🚀 Starting Electrical subfolder updates...\n');

Object.entries(electricalSubfolders).forEach(([subcategory, subfolders]) => {
  console.log(`📁 Processing Electrical/${subcategory}...`);
  
  // Update main subcategory list
  try {
    updateElectricalSubcategoryList(subcategory, subfolders);
  } catch (error) {
    console.error(`❌ Error updating Electrical/${subcategory}:`, error.message);
  }
  
  // Create subfolder files
  subfolders.forEach(subfolder => {
    try {
      createElectricalSubfolder(subcategory, subfolder);
    } catch (error) {
      console.error(`❌ Error creating Electrical/${subcategory}/${subfolder}:`, error.message);
    }
  });
  
  console.log(`✅ Completed Electrical/${subcategory} with ${subfolders.length} subfolders\n`);
});

console.log('✨ All Electrical subfolder updates completed!');
console.log('\n📝 Summary:');
console.log('- Updated ElectricalFittings, Fans, and Lights subcategories');
console.log('- Created ProductList.jsx and page.js for all subfolders');
console.log('- Added navigation between Electrical main, subcategories, and subfolders');
console.log('- Maintained consistent API structure across all levels'); 