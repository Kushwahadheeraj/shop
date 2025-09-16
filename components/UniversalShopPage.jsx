'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import API_BASE_URL from '@/lib/apiConfig';
import { getApiEndpoint } from '@/lib/apiMapping';
import ProductDetailModal from './ProductDetailModal';
import PersistentShopSidebar from '@/components/PersistentShopSidebar';
import { useCart } from '@/components/CartContext';

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

  // Use the comprehensive API mapping
  const apiPath = getApiEndpoint(segments);
  if (!apiPath) return null;

  return `${API_BASE_URL}/${apiPath}`;
}

function resolveImageUrl(item) {
  const photos = item && item.photos;
  if (Array.isArray(photos) && photos.length > 0) {
    const first = photos[0];
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object' && first.url) return first.url;
  }
  if (typeof photos === 'string') return photos;
  return item?.image || item?.img || item?.photo || item?.thumbnail || null;
}

export default function UniversalShopPage() {
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart() || { addItem: () => {} };
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? 'hidden' : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const shopSegments = useMemo(() => {
    if (!pathname) return [];
    const parts = pathname.split('/').filter(Boolean);
    const shopIndex = parts.findIndex((p) => p.toLowerCase() === 'shoppage');
    if (shopIndex === -1) return [];
    return parts.slice(shopIndex + 1);
  }, [pathname]);

  const endpoint = useMemo(() => buildEndpointFromSegments(shopSegments), [shopSegments]);

  const displayTitle = useMemo(() => {
    const last = shopSegments[shopSegments.length - 1] || shopSegments[0] || 'SHOP';
    return String(last)
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/[^a-zA-Z0-9]+/g, ' ')
      .trim()
      .toUpperCase();
  }, [shopSegments]);

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
        
        // Fetch data from API
        const res = await fetch(endpoint, { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!res.ok) {
          throw new Error(`API request failed: ${res.status} ${res.statusText}`);
        }
        
        const json = await res.json();
        const apiData = json?.data || json || [];
        
        if (isMounted) {
          setData(Array.isArray(apiData) ? apiData : []);
        }
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
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h1>
            <p className="text-gray-600 mb-2">{error}</p>
            {endpoint && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">API Endpoint: {endpoint}</p>
                <p className="text-sm text-gray-500 mt-1">Make sure the backend server is running on port 5000</p>
              </div>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = shopSegments.join(' / ').toUpperCase() || 'SHOP';
  const products = Array.isArray(data) ? data : [];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      {/* Header row */}
      <div className="bg-white border-b lg:mt-32 mt-16 border-gray-200 py-3 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">HOME</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">{title}</span>
            </nav>
            <div className="flex items-center gap-6">
              <p className="text-gray-600 text-sm">
                {products.length > 0 
                  ? `Showing 1–${Math.min(products.length, 12)} of ${products.length} results` 
                  : 'No products found'}
              </p>
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
          <div className="md:hidden">
            <nav className="flex items-center justify-center space-x-2 text-xs">
              <Link href="/" className="text-gray-500 hover:text-gray-700">HOME</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">{title}</span>
            </nav>
            <button onClick={() => setMobileOpen(true)} className="mt-2 flex items-center justify-center gap-2 text-gray-600 text-xs w-full">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 5h18M6 12h12M10 19h4" />
              </svg>
              <span>FILTER</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sorting centered */}
      <div className="md:hidden flex justify-center mb-3">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-xs w-40 text-gray-700">
                <option>Default sorting</option>
                <option>Popularity</option>
                <option>Avg rating</option>
                <option>Latest</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
              </select>
            </div>

      {/* Category Banner - compact on mobile */}
      <div className="relative h-32 md:h-64 bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-4 md:mb-8">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <h1 className="relative z-10 text-2xl md:text-5xl font-bold text-white text-center px-4">{displayTitle}</h1>
      </div>

      {/* Main Content */}
            {/* Results Header (mobile only) */}
            {/* <div className="md:hidden flex justify-between items-center mb-4">
              <p className="text-gray-600 text-xs">
                {products.length > 0 
                  ? `Showing 1-${Math.min(products.length, 12)} of ${products.length} results` 
                  : 'No products found'
                }
              </p>
            </div> */}

            

            {/* Products Grid - two columns on mobile to match reference */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map((item) => {
                const key = item?._id || item?.id || `${Math.random()}`;
                const name = item?.name || item?.title || 'Unnamed Product';
                const originalPrice = item?.mrp || item?.originalPrice;
                const salePrice = item?.price || item?.salePrice;
                const discount = originalPrice && salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
                const img = resolveImageUrl(item);
                const rating = item?.rating || 5;
                const isOutOfStock = item?.stock === 0 || item?.quantity === 0;
                
                return (
                  <div 
                    key={key} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
                          addItem(item, 1);
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

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {mobileOpen && (
        <div className="fixed inset-0 md:hidden z-50">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white transform transition-transform duration-300 translate-x-0 relative z-10">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close filter"
              className="absolute top-2 right-2 w-6 h-6 rounded-full text-black flex items-center justify-center bg-transparent"
            >
              ×
            </button>
            <div className="p-0 pt-2">
              <PersistentShopSidebar forceMobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


