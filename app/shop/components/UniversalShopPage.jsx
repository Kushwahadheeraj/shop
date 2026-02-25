'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import API_BASE_URL from '@/lib/apiConfig';
import { getApiEndpoint } from '@/lib/apiMapping';
import ProductDetailModal, { resolveImageUrl } from './ProductDetailModal';
import PersistentShopSidebar from '@/components/PersistentShopSidebar';
import { useCart } from '@/components/CartContext';

// Simple in-memory cache to store API responses
const requestCache = new Map();

function ShopBanner({ category, title }) {
  const [bannerUrl, setBannerUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!category) {
      setBannerUrl(null);
      return;
    }

    const fetchBanner = async () => {
      try {
        setImageError(false); // Reset error state on new category
        
        // Only try the root API path which is correct for Next.js App Router
        const path = `/api/category-banner?category=${encodeURIComponent(category)}`;
        
        try {
            const res = await fetch(path);
            if (res.ok) {
                const data = await res.json();
                if (data && data.imageUrl) {
                    setBannerUrl(data.imageUrl);
                    return;
                }
            }
        } catch (e) {
            // Network error fetching banner
        }
        
        setBannerUrl(null);
      } catch (e) {
        setBannerUrl(null);
      }
    };

    fetchBanner();
  }, [category]);

  if (bannerUrl && !imageError) {
    return (
      <div className="relative h-32 md:h-64 mb-4 md:mb-8 overflow-hidden rounded-none md:rounded-lg shadow-none md:shadow-md">
        <img 
            src={bannerUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
            onError={(e) => {
                setImageError(true);
            }}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
             <h1 className="relative z-10 text-2xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>{title}</h1>
        </div>
      </div>
    );
  }

  return (
      <div className="relative h-32 md:h-64 bg-gradient-to-r from-yellow-300 to-orange-500 flex items-center justify-center mb-4 md:mb-8 rounded-none md:rounded-lg shadow-none md:shadow-md">
        <div className="absolute inset-0 bg-black/20"></div>
        <h1 className="relative z-10 text-2xl md:text-5xl font-bold text-white text-center px-4">{title}</h1>
      </div>
  );
}

function buildEndpointFromSegments(segments) {
  if (!segments || segments.length === 0) return null;

  // Use the comprehensive API mapping
  const apiPath = getApiEndpoint(segments);
  if (!apiPath) return null;

  return `${API_BASE_URL}/${apiPath}`;
}

export default function UniversalShopPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart() || { addItem: () => {} };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState(null); // {min, max}

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? 'hidden' : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onFilter = (e) => {
      const { min, max } = e.detail || {};
      if (typeof min === 'number' && typeof max === 'number') {
        setPriceFilter({ min, max });
      }
    };
    window.addEventListener('shop-price-filter', onFilter);
    return () => window.removeEventListener('shop-price-filter', onFilter);
  }, []);

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

  const currentCategory = useMemo(() => {
    return shopSegments[shopSegments.length - 1];
  }, [shopSegments]);

  // Compute product lists BEFORE any conditional returns to preserve hooks order
  const products = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const filteredProducts = useMemo(() => {
    if (!priceFilter) return products;
    const { min, max } = priceFilter;
    return products.filter((item) => {
      const originalPriceRaw = item?.mrp ?? item?.originalPrice ?? item?.price ?? item?.fixPrice ?? item?.minPrice ?? 0;
      const salePriceRaw = item?.discountPrice ?? item?.salePrice ?? item?.fixPrice ?? item?.price ?? item?.minPrice ?? 0;
      const originalPrice = Number(originalPriceRaw) || 0;
      const salePrice = Number(salePriceRaw) || 0;
      const hasMinMax = item?.minPrice && item?.maxPrice && item?.minPrice !== item?.maxPrice;
      if (hasMinMax) {
        const minP = Number(item?.minPrice) || 0;
        const maxP = Number(item?.maxPrice) || 0;
        return maxP >= min && minP <= max; // overlap
      }
      const effective = salePrice > 0 ? salePrice : originalPrice;
      if (!effective) return false;
      return effective >= min && effective <= max;
    });
  }, [products, priceFilter]);

  useEffect(() => {
    let isMounted = true;
    async function run() {
      try {
        if (!endpoint) {
          if (isMounted) {
            setData([]);
            setLoading(false);
          }
          return;
        }

        // Check cache first
        if (requestCache.has(endpoint)) {
            if (isMounted) {
                setData(requestCache.get(endpoint));
                setLoading(false);
            }
            // Optional: Background revalidation could go here if needed
            return; 
        }

        if (isMounted) {
            setLoading(true);
            setError(null);
        }
        
        // Fetch data from API
        // Remove 'no-store' to allow browser caching where appropriate, 
        // though our memory cache handles the immediate "back/forward" speed.
        const res = await fetch(endpoint, { 
          headers: {
            'Content-Type': 'application/json',
          }
        });

        // If endpoint is missing (404), treat as empty data instead of hard error
        if (res.status === 404) {
          if (isMounted) {
            setData([]);
            requestCache.set(endpoint, []);
            setError(null);
          }
        } else {
          if (!res.ok) {
            throw new Error(`API request failed: ${res.status} ${res.statusText}`);
          }

          const json = await res.json();
          const apiData = json?.data || json || [];
          const validData = Array.isArray(apiData) ? apiData : [];

          // Cache the successful result
          requestCache.set(endpoint, validData);

          if (isMounted) {
            setData(validData);
          }
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
  const handleProductClick = (product) => {
    // Navigate to product details page
    // Persist the product as a fallback if API lookup fails on details page
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('selectedProduct', JSON.stringify(product));
      }
    } catch {}

    const productId = product._id || product.id;
    const categoryHint = product.category || product.Category || product?.type || '';
    const query = categoryHint ? `?cat=${encodeURIComponent(String(categoryHint))}` : '';
    router.push(`/product/${productId}${query}`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
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

      <div className="flex items-center justify-between mb-4 bg-white p-6 rounded-t-xl border-b border-gray-100">
         <div className="flex items-center gap-4">
           <button
             onClick={() => router.push('/all-products')}
             className="bg-[#ffdb00] hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold transition-all duration-300 text-xs uppercase tracking-wider"
           >
             View All Products
           </button>
           <p className="text-gray-400 text-xs font-medium uppercase tracking-wide hidden sm:block">
             {products.length > 0 
               ? `Showing 1–${Math.min(products.length, 12)} of ${products.length} results` 
               : 'No products found'}
           </p>
         </div>
         <select className="border border-gray-200 rounded-lg px-4 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all cursor-pointer">
           <option>Default sorting</option>
           <option>Sort by popularity</option>
           <option>Sort by average rating</option>
           <option>Sort by latest</option>
           <option>Sort by price: low to high</option>
           <option>Sort by price: high to low</option>
         </select>
       </div>

       <div className="px-6 pb-6">
          {/* Category Banner - compact on mobile */}
          <ShopBanner category={currentCategory} title={displayTitle} />
        </div>

      {/* Main Content */}
            
            

            {/* Products - Mobile: Linear/Horizontal layout, Desktop: Grid layout */}
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden h-96 animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))
              ) : filteredProducts.map((item) => {
                const key = item?._id || item?.id || `${Math.random()}`;
                const name = item?.name || item?.title || 'Unnamed Product';
                // Robust price resolution across models
                // Check if product has options/variants
                const hasOptions = !!(
                  item?.variants?.length > 0 ||
                  item?.colors?.length > 0 ||
                  item?.amps?.length > 0 ||
                  item?.weights?.length > 0 ||
                  item?.sizes?.length > 0 ||
                  item?.type?.length > 0 ||
                  item?.customFields?.length > 0 ||
                  (item?.minPrice && item?.maxPrice && item?.minPrice !== item?.maxPrice)
                );

                // Price resolution
                const originalPriceRaw =
                  item?.mrp ?? item?.originalPrice ?? item?.price ?? item?.fixPrice ?? item?.minPrice ?? 0;
                const salePriceRaw =
                  item?.discountPrice ?? item?.salePrice ?? item?.fixPrice ?? item?.price ?? item?.minPrice ?? 0;
                const originalPrice = Number(originalPriceRaw) || 0;
                const salePrice = Number(salePriceRaw) || 0;
                const discount = originalPrice > 0 && salePrice > 0 && salePrice < originalPrice
                  ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
                  : (Number(item?.discount) || 0);

                // Check if product has min-max pricing
                const hasMinMaxPricing = item?.minPrice && item?.maxPrice && item?.minPrice !== item?.maxPrice;
                const minPrice = Number(item?.minPrice) || 0;
                const maxPrice = Number(item?.maxPrice) || 0;
                const img = resolveImageUrl(item);
                const rating = item?.rating || 5;
                const isOutOfStock = item?.stock === 0 || item?.quantity === 0;
                
                return (
                  <div 
                    key={key} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative cursor-pointer group flex md:flex-col" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleProductClick(item);
                    }}
                  >
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded z-10">
                        -{discount}%
                      </div>
                    )}
                    
                    {/* Out of Stock Overlay */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                        <span className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}

                    {/* Product Image - Mobile: Fixed width, Desktop: Full width */}
                    <div className="w-32 sm:w-40 md:w-full flex-shrink-0 md:flex-shrink aspect-square bg-gray-100 overflow-hidden relative">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={img}
                          alt={name} 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          decoding="async"
                          onLoad={(e) => {
                            // Ensure image is visible and fallback hidden
                            e.currentTarget.style.display = 'block';
                            const fallback = e.currentTarget.parentElement.querySelector('.fallback-image');
                            if (fallback) fallback.style.display = 'none';
                          }}
                          onError={(e) => {
                            if (img && typeof img === 'string' && !img.startsWith('http')) {
                              const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
                              const candidate = img.startsWith('/') ? `${ORIGIN}${img}` : `${ORIGIN}/${img}`;
                              if (candidate !== e.target.src) {
                                e.target.src = candidate;
                                return;
                              }
                            }
                            e.target.style.display = 'none';
                            // Show fallback
                            const fallback = e.target.parentElement.querySelector('.fallback-image');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-gray-300 text-3xl sm:text-4xl md:text-6xl mb-1 sm:mb-2">📦</div>
                            <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium">No Image</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay with Quick View Button - Hidden on mobile */}
                      <div className="hidden md:flex absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 items-end justify-center pb-4 pointer-events-none">
                        <button 
                          className="bg-yellow-300 hover:bg-yellow-300 text-white px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleProductClick(item);
                          }}
                        >
                          QUICK VIEW
                        </button>
                      </div>
                    </div>

                    {/* Product Info - Mobile: Flex column, Desktop: Normal */}
                    <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col">
                      {/* Category - Mobile only */}
                      <div className="text-[9px] sm:text-[10px] md:hidden text-gray-500 uppercase mb-0.5 sm:mb-1">
                        {item?.category || item?.type || 'PRODUCT'}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-sm mb-1 sm:mb-2 line-clamp-2 md:line-clamp-2">
                        {name}
                      </h3>
                      
                      {/* Rating - Smaller on mobile */}
                      <div className="flex items-center mb-1 sm:mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ${i < rating ? 'text-yellow-300' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Price - Mobile: Smaller, Desktop: Normal */}
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3 mt-auto">
                        {hasMinMaxPricing ? (
                          <div className="flex flex-col">
                            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                              ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">Price Range</span>
                          </div>
                        ) : (
                          <>
                            {originalPrice > 0 && salePrice > 0 && originalPrice !== salePrice && (
                              <span className="text-gray-500 line-through text-[10px] sm:text-xs md:text-sm">
                                ₹{originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                              {salePrice > 0
                                ? `₹${salePrice.toLocaleString('en-IN')}`
                                : originalPrice > 0
                                  ? `₹${originalPrice.toLocaleString('en-IN')}`
                                  : 'Price on request'}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Action Button - Mobile: Smaller, Desktop: Normal */}
                      <button 
                        className={`w-full py-1.5 sm:py-2 md:py-2 px-2 sm:px-3 md:px-4 rounded-md text-[10px] sm:text-xs md:text-sm font-medium transition-colors ${
                          isOutOfStock 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-yellow-300 hover:bg-yellow-300 text-white'
                        }`}
                        disabled={isOutOfStock}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (hasOptions) {
                            // For products with options, just open the modal
                            handleProductClick(item);
                          } else {
                            // For simple products, add directly to cart
                            const priceToUse = hasMinMaxPricing ? minPrice : (salePrice > 0 ? salePrice : originalPrice);
                            addItem({ ...item, price: priceToUse }, 1);
                            handleProductClick(item);
                          }
                        }}
                      >
                        {isOutOfStock 
                          ? 'READ MORE' 
                          : hasOptions 
                            ? 'SELECT OPTIONS' 
                            : 'ADD TO CART'
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

      {/* No Products Message */}
      {!loading && filteredProducts.length === 0 && (
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
        <div className="fixed inset-0 md:hidden z-[3500]">
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
