'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import API_BASE_URL from '@/lib/apiConfig';
import ProductDetailModal from './ProductDetailModal';

function toKebabCase(input) {
  const withSpaces = String(input)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim();
  return withSpaces
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s.toLowerCase())
    .join('-');
}

function buildEndpointFromCategory(category) {
  const categoryToApiMap = {
    'Adhesives': 'adhesives',
    'Cements & POP': 'cements',
    'Cleaning': 'cleaning',
    'Dry Wall Gypsum Screws': 'dry',
    'Electrical Items': 'electrical',
    'Home': 'home',
    'House Hold Ladder': 'hardware',
    'LED Luminaires': 'electrical',
    'Locks & accessories': 'locks',
    'Mask & Sanitizers': 'cleaning',
    'Paints': 'paint',
    'Pipes & Fittings': 'pipe',
    'Sanitary Ware & faucets': 'sanitary',
    'Tools': 'tools',
    'Uncategorized': 'uncategorized',
    'WaterProofing': 'waterproofing'
  };

  const apiBase = categoryToApiMap[category];
  if (!apiBase) return null;

  return `${API_BASE_URL}/${apiBase}/get`;
}

const categories = [
  { name: "Adhesives", key: "Adhesives" },
  { name: "Cements & POP", key: "Cements & POP" },
  { name: "Cleaning", key: "Cleaning" },
  { name: "Dry Wall Gypsum Screws", key: "Dry Wall Gypsum Screws" },
  { name: "Electrical Items", key: "Electrical Items" },
  { name: "Home", key: "Home" },
  { name: "House Hold Ladder", key: "House Hold Ladder" },
  { name: "LED Luminaires", key: "LED Luminaires" },
  { name: "Locks & accessories", key: "Locks & accessories" },
  { name: "Mask & Sanitizers", key: "Mask & Sanitizers" },
  { name: "Paints", key: "Paints" },
  { name: "Pipes & Fittings", key: "Pipes & Fittings" },
  { name: "Sanitary Ware & faucets", key: "Sanitary Ware & faucets" },
  { name: "Tools", key: "Tools" },
  { name: "Uncategorized", key: "Uncategorized" },
  { name: "WaterProofing", key: "WaterProofing" }
];

export default function ShopWithSidebar() {
  const [selectedCategory, setSelectedCategory] = useState('Adhesives');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const endpoint = useMemo(() => buildEndpointFromCategory(selectedCategory), [selectedCategory]);

  useEffect(() => {
    let isMounted = true;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        if (!endpoint) {
          setData([]);
          setLoading(false);
          return;
        }
        
        // Try to fetch from API first
        try {
          const res = await fetch(endpoint, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (isMounted) setData(json?.data || json || []);
            return;
          }
        } catch (apiError) {
          console.log('API not available, using mock data');
        }
        
        // Fallback to mock data if API is not available
        const mockData = [
          {
            _id: '1',
            name: "Apacra Glass Marking White Pencil Pack of 2",
            price: 15.00,
            mrp: 20.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Apacra+Pencil" }],
            rating: 4,
            stock: 10
          },
          {
            _id: '2',
            name: "Araldite Karpenter Synthetic Resin Adhesive Wood Glue",
            price: 700.00,
            mrp: 1250.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Araldite+Karpenter" }],
            rating: 5,
            stock: 5
          },
          {
            _id: '3',
            name: "Araldite Kesar 4 Plus 1.8kg",
            price: 1105.00,
            mrp: 1250.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Araldite+Kesar" }],
            rating: 4.5,
            stock: 8
          },
          {
            _id: '4',
            name: "Araldite Mechanic Epoxy Adhesive 5g",
            price: 30.00,
            mrp: 40.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Araldite+Mechanic" }],
            rating: 4,
            stock: 15
          },
          {
            _id: '5',
            name: "Asian Paints acrYCRIL Fabseal 60gm",
            price: 110.00,
            mrp: 120.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Asian+Paints" }],
            rating: 3.5,
            stock: 0
          },
          {
            _id: '6',
            name: "Astral Adhesive Amrow",
            price: 100.00,
            mrp: 120.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Astral+Amrow" }],
            rating: 5,
            stock: 12
          },
          {
            _id: '7',
            name: "Astral Adhesive Bearing Retainer 944",
            price: 190.00,
            mrp: 200.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Astral+Retainer" }],
            rating: 4,
            stock: 0
          },
          {
            _id: '8',
            name: "Astral Adhesive Bearing Retainer TL 944",
            price: 170.00,
            mrp: 200.00,
            photos: [{ url: "https://via.placeholder.com/300x300?text=Astral+TL" }],
            rating: 4,
            stock: 0
          }
        ];
        
        if (isMounted) setData(mockData);
      } catch (err) {
        if (isMounted) setError(err?.message || 'Failed to load');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    run();
    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error: {error}</h1>
            {endpoint && <p className="text-gray-600">Endpoint: {endpoint}</p>}
          </div>
        </div>
      </div>
    );
  }

  const products = Array.isArray(data) ? data : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">HOME</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{selectedCategory.toUpperCase()}</span>
          </nav>
        </div>
      </div>

      {/* Category Banner */}
      <div className="relative h-64 bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <h1 className="relative z-10 text-5xl font-bold text-white text-center px-4">{selectedCategory.toUpperCase()}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Static Sidebar */}
          <aside className="w-full lg:w-1/4 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-8">
              <div className="text-gray-800 font-bold text-lg mb-2">FILTER BY PRICE</div>
              <div className="h-0.5 w-8 bg-gray-300 mb-4" />
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Price: <span className="font-bold">₹0</span> — <span className="font-bold">₹10,290</span>
                </div>
                <button className="bg-gray-800 text-white font-bold px-6 py-2 rounded-full text-xs tracking-widest hover:bg-gray-700 transition-colors">
                  FILTER
                </button>
              </div>
            </div>
            
            <div>
              <div className="text-gray-800 font-bold text-lg mb-2">BROWSE</div>
              <div className="h-0.5 w-8 bg-gray-300 mb-4" />
              <div className="space-y-0">
                {categories.map((cat, index) => (
                  <div key={cat.key}>
                    <button 
                      onClick={() => handleCategoryChange(cat.key)}
                      className={`w-full text-left py-3 text-sm transition-colors font-medium ${
                        selectedCategory === cat.key 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                    {index < categories.length - 1 && (
                      <div className="h-px bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Dynamic Main Content */}
          <main className="w-full lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">Showing 1-{products.length} of {products.length} results</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    console.log('Test button clicked');
                    setSelectedProduct(products[0] || { name: 'Test Product', price: 100 });
                    setIsModalOpen(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
                >
                  Test Modal
                </button>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                  <option>Default sorting</option>
                  <option>Sort by popularity</option>
                  <option>Sort by average rating</option>
                  <option>Sort by latest</option>
                  <option>Sort by price: low to high</option>
                  <option>Sort by price: high to low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((item) => {
                const key = item?._id || item?.id || `${Math.random()}`;
                const name = item?.name || item?.title || 'Unnamed Product';
                const originalPrice = item?.mrp || item?.originalPrice;
                const salePrice = item?.price || item?.salePrice;
                const discount = originalPrice && salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
                const img = item?.photos?.[0]?.url || item?.image || item?.photo || null;
                const rating = item?.rating || 5;
                const isOutOfStock = item?.stock === 0 || item?.quantity === 0;
                
                return (
                  <div 
                    key={key} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Card clicked for product:', item);
                      handleProductClick(item);
                    }}
                  >
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        -{discount}%
                      </div>
                    )}
                    
                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                        <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center p-4">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={img} 
                          alt={name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-3">
                        {originalPrice && originalPrice !== salePrice && (
                          <span className="text-gray-500 line-through text-sm">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-lg font-bold text-gray-900">
                          ₹{salePrice?.toLocaleString() || '0'}
                        </span>
                      </div>

                      {/* Action Button */}
                      <button 
                        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                          isOutOfStock 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }`}
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Button clicked for product:', item);
                          handleProductClick(item);
                        }}
                      >
                        {isOutOfStock ? 'READ MORE' : 'ADD TO CART'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Products Message */}
            {products.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}


