const fs = require('fs');
const path = require('path');

// Electrical subcategories
const electricalSubcategories = [
  'WiresAndCables', 'WaterHeaters', 'WaterHeater', 'UniSwitch', 'TravelAdaptor',
  'TVOutlets', 'Switches', 'SwitchPlates', 'SwitchAndSocket', 'Sockets',
  'RotarySwitch', 'Regulators', 'PowerStrips', 'Plug', 'PinTop', 'PVCClips',
  'Others', 'Motors', 'MotorStarters', 'ModularSurfaceBox', 'MainSwitch',
  'MCB', 'KITKATFuses', 'Jacks', 'Isolators', 'InsulationTapes', 'Indicator',
  'Holders', 'FuseCarriers', 'FlexibleWires', 'FlexibleConduit', 'EarthingAccessories',
  'ELCBsRCCBs', 'DoorBells', 'DistributionBoards', 'Dimmer', 'DPswitch',
  'CeilingRoses', 'Adaptors', 'Lights', 'Fans', 'ElectricalFittings'
];

// Template for Electrical subcategory ProductList.jsx
const electricalProductListTemplate = (subcategory) => `"use client";
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
    router.push(\`/Dashboard/ProductView/electrical/${subcategory.toLowerCase()}/\${product._id}\`);
  };

  const handleAddNew = () => {
    router.push("/Dashboard/ProductAdd/Electrical/${subcategory}");
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
            <CardTitle>Electrical - ${subcategory} Products</CardTitle>
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
            category={\`Electrical - ${subcategory}\`}
          />
        </CardContent>
      </Card>
    </div>
  );
}`;

// Template for Electrical subcategory page.js
const electricalPageTemplate = (subcategory) => `import ProductList from './ProductList';

export default function ${subcategory}Page() {
  return (
    <div>
      <ProductList />
    </div>
  );
}`;

// Function to create Electrical subcategory
function createElectricalSubcategory(subcategory) {
  const basePath = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductList', 'Electrical', subcategory);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }
  
  // Create ProductList.jsx
  const productListPath = path.join(basePath, 'ProductList.jsx');
  fs.writeFileSync(productListPath, electricalProductListTemplate(subcategory));
  console.log(`✅ Created Electrical/${subcategory}/ProductList.jsx`);
  
  // Create page.js
  const pagePath = path.join(basePath, 'page.js');
  fs.writeFileSync(pagePath, electricalPageTemplate(subcategory));
  console.log(`✅ Created Electrical/${subcategory}/page.js`);
}

// Create all Electrical subcategories
console.log('🚀 Creating Electrical subcategory ProductList files...\n');

electricalSubcategories.forEach(subcategory => {
  try {
    createElectricalSubcategory(subcategory);
  } catch (error) {
    console.error(`❌ Error creating ${subcategory}:`, error.message);
  }
});

console.log('\n✨ All Electrical subcategory ProductList files have been created!');
console.log('\n📝 Next steps:');
console.log('1. Check that all API endpoints exist in your backend');
console.log('2. Test the update and delete functionality');
console.log('3. Verify that the routing works correctly');
console.log('4. Update the main Electrical ProductList to include navigation to subcategories'); 