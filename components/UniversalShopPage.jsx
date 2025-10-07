'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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
  if (!item) return null;

  const normalizeUrl = (raw) => {
    if (!raw) return null;
    let url = String(raw).trim().replace(/\\/g, '/');
    if (!url) return null;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    const ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
    if (url.startsWith('/')) return `${ORIGIN}${url}`;
    // If bare filename or folder+filename, assume stored under /uploads
    if (!/^[a-zA-Z]+:\/\//.test(url) && !url.startsWith('uploads/') && !url.startsWith('public/')) {
      return `${ORIGIN}/uploads/${url}`;
    }
    // Common case: "uploads/..."
    return `${ORIGIN}/${url}`;
  };

  // 1) photos array (string or object with url)
  // photos used everywhere in backend
  let photos = item.photos || item.images || item.imageUrls;
  // Sometimes stored as comma-separated string
  if (typeof photos === 'string' && photos.includes(',')) {
    photos = photos.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (Array.isArray(photos) && photos.length > 0) {
    const first = photos[0];
    if (typeof first === 'string') return normalizeUrl(first);
    if (first && typeof first === 'object') {
      const objCandidates = [
        first.url,
        first.secure_url,
        first.src,
        first.path,
        first.Location,
        first.location,
        first.href
      ].filter(Boolean);
      if (objCandidates.length > 0) return normalizeUrl(objCandidates[0]);
    }
  }

  // 2) photos as string
  if (typeof photos === 'string') {
    return normalizeUrl(photos);
  }

  // 3) other single-value fields
  const imageFields = ['image', 'img', 'photo', 'thumbnail', 'imageUrl', 'image_url', 'cover', 'primaryImage'];
  for (const field of imageFields) {
    if (item[field]) {
      const v = item[field];
      if (typeof v === 'string') return normalizeUrl(v);
      if (v && typeof v === 'object') {
        const objCandidates = [v.url, v.secure_url, v.src, v.path, v.Location, v.location, v.href].filter(Boolean);
        if (objCandidates.length > 0) return normalizeUrl(objCandidates[0]);
      }
    }
  }

  // 4) Deep scan: find first string that looks like an image URL anywhere in the object
  try {
    const isImageString = (s) => typeof s === 'string' && /(\.png|\.jpg|\.jpeg|\.webp|\.gif)(\?.*)?$/i.test(s.trim());
    // Check shallow values
    for (const key of Object.keys(item)) {
      const val = item[key];
      if (isImageString(val)) return normalizeUrl(val);
      if (Array.isArray(val)) {
        for (const v of val) {
          if (isImageString(v)) return normalizeUrl(v);
          if (v && typeof v === 'object') {
            for (const k2 of Object.keys(v)) {
              const vv = v[k2];
              if (isImageString(vv)) return normalizeUrl(vv);
            }
          }
        }
      }
      if (val && typeof val === 'object') {
        for (const k2 of Object.keys(val)) {
          const vv = val[k2];
          if (isImageString(vv)) return normalizeUrl(vv);
        }
      }
    }
  } catch {}

  return null;
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
  const handleProductClick = (product) => {
    // Debug: Log the product structure
    console.log('Product clicked:', {
      product,
      _id: product._id,
      id: product.id,
      name: product.name
    });
    
    // Navigate to product details page
    // Persist the product as a fallback if API lookup fails on details page
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('selectedProduct', JSON.stringify(product));
      }
    } catch {}

    const productId = product._id || product.id;
    const categoryHint = product.category || product.Category || product?.type || '';
    console.log('Navigating to product ID:', productId, 'category:', categoryHint);
    const query = categoryHint ? `?cat=${encodeURIComponent(String(categoryHint))}` : '';
    router.push(`/product/${productId}${query}`);
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
              <button
                onClick={() => router.push('/all-products')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                View All Products
              </button>
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
              {filteredProducts.map((item) => {
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
                
                // Temporary debug - remove after fixing
                if (item?.name === 'Pidilite Fevicol Probond') {
                  console.log('Debug for Pidilite Fevicol Probond:', {
                    item,
                    img,
                    photos: item?.photos,
                    image: item?.image,
                    img_field: item?.img,
                    photo: item?.photo,
                    thumbnail: item?.thumbnail
                  });
                }
                
                return (
                  <div 
                    key={key} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative cursor-pointer group" 
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
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
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
                            console.warn('Image failed, trying uploads prefix fallback for:', img);
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
                            <div className="text-gray-300 text-6xl mb-2">📦</div>
                            <span className="text-gray-400 text-sm font-medium">No Image Available</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Hover Overlay with Quick View Button */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-center pb-4 pointer-events-none">
                        <button 
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 pointer-events-auto"
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
                        {hasMinMaxPricing ? (
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-gray-500">Price Range</span>
                          </div>
                        ) : (
                          <>
                            {originalPrice > 0 && salePrice > 0 && originalPrice !== salePrice && (
                              <span className="text-gray-500 line-through text-sm">
                                ₹{originalPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-lg font-bold text-gray-900">
                              {salePrice > 0
                                ? `₹${salePrice.toLocaleString('en-IN')}`
                                : originalPrice > 0
                                  ? `₹${originalPrice.toLocaleString('en-IN')}`
                                  : 'Price on request'}
                            </span>
                          </>
                        )}
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
      {filteredProducts.length === 0 && (
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


