'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
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

function buildEndpointFromSegments(segments) {
  if (!segments || segments.length === 0) return null;

  const topLevelToApiBase = {
    adhesives: 'adhesives',
    brush: 'brush',
    cements: 'cements',
    cleaning: 'cleaning',
    dry: 'dry',
    electrical: 'electrical',
    fiber: 'fiber',
    fitting: 'fitting',
    hardware: 'hardware',
    homedecor: 'homedecor',
    locks: 'locks',
    paint: 'paint',
    pipe: 'pipe',
    pvcmats: 'pvcmats',
    roofer: 'roofer',
    sanitary: 'sanitary',
    tools: 'tools',
    uncategorized: 'uncategorized',
    waterproofing: 'waterproofing',
  };

  const top = toKebabCase(segments[0]);
  const apiBase = topLevelToApiBase[top];
  if (!apiBase) return null;

  const subPath = segments
    .slice(1)
    .map((s) => toKebabCase(s))
    .filter(Boolean)
    .join('-');

  const suffix = subPath ? `/${subPath}` : '';
  return `${API_BASE_URL}/${apiBase}${suffix}/get`;
}

export default function UniversalShopPage() {
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shopSegments = useMemo(() => {
    if (!pathname) return [];
    const parts = pathname.split('/').filter(Boolean);
    const shopIndex = parts.findIndex((p) => p.toLowerCase() === 'shoppage');
    if (shopIndex === -1) return [];
    return parts.slice(shopIndex + 1);
  }, [pathname]);

  const endpoint = useMemo(() => buildEndpointFromSegments(shopSegments), [shopSegments]);

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

  const title = shopSegments.join(' / ').toUpperCase() || 'SHOP';
  const products = Array.isArray(data) ? data : [];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">HOME</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{title}</span>
          </nav>
        </div>
      </div>

      {/* Category Banner */}
      <div className="relative h-64 bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <h1 className="relative z-10 text-5xl font-bold text-white text-center px-4">{title}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
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
                <button onClick={() => window.location.href = '/ShopPage/Adhesives'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Adhesives
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Cements'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Cements & POP
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Cleaning'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Cleaning
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Dry'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Dry Wall Gypsum Screws
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Electrical'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Electrical Items
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Home'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Home
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Hardware'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  House Hold Ladder
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Electrical'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  LED Luminaires
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Locks'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Locks & accessories
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Cleaning'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Mask & Sanitizers
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Paint'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Paints
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Pipe'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Pipes & Fittings
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Sanitary'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Sanitary Ware & faucets
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Tools'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Tools
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/Uncategorized'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  Uncategorized
                </button>
                <div className="h-px bg-gray-200"></div>
                <button onClick={() => window.location.href = '/ShopPage/WaterProofing'} className="w-full text-left py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors font-medium">
                  WaterProofing
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
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
          </main>
        </div>

        {/* No Products Message */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {console.log('Modal state:', { isModalOpen, selectedProduct })}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}


