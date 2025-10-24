# PowerShell script to generate all electrical subcategory product page files

$electricalCategories = @(
    "DPswitch",
    "EarthingAccessories", 
    "ELCBsRCCBs",
    "ElectricalFittings",
    "Fans",
    "FlexibleConduit",
    "FlexibleWires",
    "FuseCarriers",
    "Holders",
    "Indicator",
    "InsulationTapes",
    "Isolators",
    "Jacks",
    "KITKATFuses",
    "Lights",
    "MainSwitch",
    "MCB",
    "ModularSurfaceBox",
    "MotorStarters",
    "Motors",
    "Others",
    "PinTop",
    "Plug",
    "PowerStrips",
    "PVCClips",
    "Regulators",
    "RotarySwitch",
    "Sockets",
    "SwitchAndSocket",
    "SwitchPlates",
    "Switches",
    "TravelAdaptor",
    "TVOutlets",
    "UniSwitch",
    "WaterHeater",
    "WaterHeaters",
    "WiresAndCables"
)

$template = @'
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

export default function {0}() {{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {{
    fetchProducts();
  }}, []);

  const fetchProducts = async () => {{
    try {{
      setLoading(true);
      const response = await fetch(`${{API_BASE_URL}}/electrical/{1}/get`);
      if (!response.ok) {{
        throw new Error('Failed to fetch products');
      }}
      const data = await response.json();
      setProducts(data.data || data || []);
    }} catch (err) {{
      setError(err.message);
      console.error('Error fetching products:', err);
    }} finally {{
      setLoading(false);
    }}
  }};

  const handleAddToCart = (productId) => {{
    console.log('Adding to cart:', productId);
  }};

  if (loading) {{
    return (
      <div className="min-h-screen bg-gray-50 pt-36">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{2}</h1>
            <p className="text-gray-600">{3}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {{[...Array(8)].map((_, i) => (
              <div key={{i}} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}}
          </div>
        </div>
      </div>
    );
  }}

  if (error) {{
    return (
      <div className="min-h-screen bg-gray-50 pt-36">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{2}</h1>
            <p className="text-gray-600">{3}</p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">Error: {{error}}</p>
            <button 
              onClick={{fetchProducts}}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }}

  return (
    <div className="min-h-screen bg-gray-50 pt-36">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{2}</h1>
          <p className="text-gray-600">{3}</p>
        </div>
        {{products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {{products.map((product) => (
              <div key={{product._id || product.id}} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  {{product.photos && product.photos.length > 0 ? (
                    <Image src={{product.photos[0]}} alt={{product.name}} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}}
                  {{product.discount && product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                      -{{product.discount}}%
                    </div>
                  )}}
                </div>
                <div className="p-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{{product.category || '{2}'}}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{{product.name}}</h3>
                  <div className="flex items-center mb-3">
                    {{[...Array(5)].map((_, i) => (
                      <Star key={{i}} className={{{`w-4 h-4 ${{i < (product.rating || 0) ? 'text-yellow-300 fill-current' : 'text-gray-300'}}`}}} />
                    ))}}
                    <span className="text-xs text-gray-500 ml-1">({{product.rating || 0}})</span>
                  </div>
                  <div className="mb-4">
                    {{product.discount && product.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{{product.discountPrice || product.fixPrice || product.price}}</span>
                        <span className="text-sm text-gray-500 line-through">₹{{product.price || product.fixPrice}}</span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">₹{{product.price || product.fixPrice}}</span>
                    )}}
                  </div>
                  <button 
                    onClick={{() => handleAddToCart(product._id || product.id)}} 
                    className="w-full py-2 px-4 border-2 border-yellow-300 text-orange-600 font-medium rounded-lg hover:bg-yellow-300 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}}
          </div>
        )}}
      </div>
    </div>
  );
}}
'@

# Function to get display name and description for each category
function Get-CategoryInfo($category) {
    $info = @{
        "DPswitch" = @{ Display = "DP Switch"; Description = "Double pole switches for electrical safety" }
        "EarthingAccessories" = @{ Display = "Earthing Accessories"; Description = "Essential earthing components for electrical safety" }
        "ELCBsRCCBs" = @{ Display = "ELCBs & RCCBs"; Description = "Earth leakage circuit breakers and residual current circuit breakers" }
        "ElectricalFittings" = @{ Display = "Electrical Fittings"; Description = "Complete range of electrical fitting accessories" }
        "Fans" = @{ Display = "Fans"; Description = "Various types of fans for cooling and ventilation" }
        "FlexibleConduit" = @{ Display = "Flexible Conduit"; Description = "Flexible electrical conduit for wiring protection" }
        "FlexibleWires" = @{ Display = "Flexible Wires"; Description = "High-quality flexible electrical wires" }
        "FuseCarriers" = @{ Display = "Fuse Carriers"; Description = "Reliable fuse carriers for circuit protection" }
        "Holders" = @{ Display = "Holders"; Description = "Secure holders for electrical components" }
        "Indicator" = @{ Display = "Indicators"; Description = "LED indicators and status lights" }
        "InsulationTapes" = @{ Display = "Insulation Tapes"; Description = "Electrical insulation tapes for safety" }
        "Isolators" = @{ Display = "Isolators"; Description = "Electrical isolators for circuit control" }
        "Jacks" = @{ Display = "Jacks"; Description = "Audio and video jacks for connectivity" }
        "KITKATFuses" = @{ Display = "KIT KAT Fuses"; Description = "KIT KAT type electrical fuses" }
        "Lights" = @{ Display = "Lights"; Description = "Comprehensive range of lighting solutions" }
        "MainSwitch" = @{ Display = "Main Switch"; Description = "Main electrical switches for power control" }
        "MCB" = @{ Display = "MCB"; Description = "Miniature circuit breakers for protection" }
        "ModularSurfaceBox" = @{ Display = "Modular Surface Box"; Description = "Surface mounted electrical boxes" }
        "MotorStarters" = @{ Display = "Motor Starters"; Description = "Motor starting and control equipment" }
        "Motors" = @{ Display = "Motors"; Description = "Electric motors for various applications" }
        "Others" = @{ Display = "Other Electrical Items"; Description = "Miscellaneous electrical components and accessories" }
        "PinTop" = @{ Display = "Pin Top"; Description = "Pin top electrical connectors" }
        "Plug" = @{ Display = "Plugs"; Description = "Electrical plugs and connectors" }
        "PowerStrips" = @{ Display = "Power Strips"; Description = "Multi-outlet power strips and extensions" }
        "PVCClips" = @{ Display = "PVC Clips"; Description = "PVC clips for cable management" }
        "Regulators" = @{ Display = "Regulators"; Description = "Voltage and current regulators" }
        "RotarySwitch" = @{ Display = "Rotary Switch"; Description = "Rotary electrical switches" }
        "Sockets" = @{ Display = "Sockets"; Description = "Electrical sockets and outlets" }
        "SwitchAndSocket" = @{ Display = "Switch & Socket"; Description = "Combined switch and socket units" }
        "SwitchPlates" = @{ Display = "Switch Plates"; Description = "Decorative switch plates and covers" }
        "Switches" = @{ Display = "Switches"; Description = "Various types of electrical switches" }
        "TravelAdaptor" = @{ Display = "Travel Adaptor"; Description = "Travel adaptors for international use" }
        "TVOutlets" = @{ Display = "TV Outlets"; Description = "TV and antenna outlets" }
        "UniSwitch" = @{ Display = "Uni Switch Socket Combined Units"; Description = "Unified switch and socket combinations" }
        "WaterHeater" = @{ Display = "Water Heater"; Description = "Water heating equipment and accessories" }
        "WaterHeaters" = @{ Display = "Water Heaters"; Description = "Complete water heating solutions" }
        "WiresAndCables" = @{ Display = "Wires & Cables"; Description = "Comprehensive range of electrical wires and cables" }
    }
    
    if ($info.ContainsKey($category)) {
        return $info[$category]
    } else {
        return @{ Display = $category; Description = "Electrical products and accessories" }
    }
}

# Generate files for each category
foreach ($category in $electricalCategories) {
    $info = Get-CategoryInfo $category
    $displayName = $info.Display
    $description = $info.Description
    
    $content = $template -f $category, $category.ToLower(), $displayName, $description
    $filePath = "app/ShopPage/Electrical/$category.jsx"
    
    $content | Out-File -FilePath $filePath -Encoding UTF8
    Write-Host "Created: $filePath"
}

Write-Host "All electrical subcategory files have been generated successfully!"

