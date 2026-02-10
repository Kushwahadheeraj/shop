'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import API_BASE_URL from '@/lib/apiConfig';

const categories = [
  { name: "Adhesives", href: "/ShopPage/Adhesives" },
  { name: "Cements & POP", href: "/ShopPage/Cements" },
  { name: "Cleaning", href: "/ShopPage/Cleaning" },
  { name: "Dry Wall Gypsum Screws", href: "/ShopPage/Dry" },
  { name: "Electrical Items", href: "/ShopPage/Electrical" },
  { name: "Home", href: "/ShopPage/Home" },
  { name: "House Hold Ladder", href: "/ShopPage/Hardware" },
  { name: "LED Luminaires", href: "/ShopPage/Electrical" },
  { name: "Locks & accessories", href: "/ShopPage/Locks" },
  // { name: "Mask & Sanitizers", href: "/ShopPage/Cleaning" },
  { name: "Paints", href: "/ShopPage/Paint" },
  { name: "Pipes & Fittings", href: "/ShopPage/Pipe" },
  { name: "Sanitary Ware & faucets", href: "/ShopPage/Sanitary" },
  { name: "Tools", href: "/ShopPage/Tools" },
  { name: "Uncategorized", href: "/ShopPage/Uncategorized" },
  { name: "WaterProofing", href: "/ShopPage/WaterProofing" }
];

export default function ProductListingPage() {
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to convert relative URLs to absolute
  const toAbs = (u) => {
    if (!u || typeof u !== 'string') return '';
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
    
    // Remove /api suffix if present to get the root URL for static files
    const base = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const path = u.startsWith('/') ? u : `/${u}`;
    return `${base}${path}`;
  };

  // Get current category from pathname
  const getCurrentCategory = () => {
    const segments = pathname.split('/').filter(Boolean);
    const shopIndex = segments.findIndex(segment => segment.toLowerCase() === 'shoppage');
    if (shopIndex !== -1 && segments[shopIndex + 1]) {
      const categoryName = segments[shopIndex + 1];
      return categories.find(cat => 
        cat.href.toLowerCase().includes(categoryName.toLowerCase())
      ) || { name: categoryName.toUpperCase(), href: pathname };
    }
    return { name: "SHOP", href: "/ShopPage" };
  };

  const currentCategory = getCurrentCategory();

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all products or try to filter by category if API supports it
        // Using /products/all and filtering client-side for now to be safe
        const res = await fetch(`${API_BASE_URL}/products/all`);
        const json = await res.json();
        
        if (!mounted) return;

        let list = [];
        if (json && Array.isArray(json)) {
          list = json;
        } else if (json && json.data && Array.isArray(json.data)) {
          list = json.data;
        } else if (json && json.products && Array.isArray(json.products)) {
          list = json.products;
        }

        // Filter by category if we are in a specific category
        if (currentCategory.name !== "SHOP") {
          const categoryName = currentCategory.name.toLowerCase();
          // Map inconsistent category names if needed
          const searchTerms = [categoryName];
          if (categoryName.includes('paint')) searchTerms.push('paint', 'paints');
          if (categoryName.includes('electrical')) searchTerms.push('electrical', 'electric');
          if (categoryName.includes('sanitary')) searchTerms.push('sanitary', 'faucets');
          if (categoryName.includes('tool')) searchTerms.push('tool', 'tools');
          if (categoryName.includes('cement')) searchTerms.push('cement', 'cements');
          
          list = list.filter(item => {
            const itemCat = (item.category || item.type || '').toLowerCase();
            return searchTerms.some(term => itemCat.includes(term));
          });
        }

        setData(list);
      } catch (err) {
        setError("Failed to load products");
        if (mounted) setData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [pathname, currentCategory.name]);


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

  const products = Array.isArray(data) ? data : [];

  return (
    <div className="w-full">
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Showing 1-{products.length} of {products.length} results</p>
        <div className="flex items-center gap-4">
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

      {/* Category Banner */}
      <div className="relative h-64 bg-gradient-to-r from-yellow-300 to-orange-500 flex items-center justify-center mb-8 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <h1 className="relative z-10 text-5xl font-bold text-white text-center px-4">
          {currentCategory.name.toUpperCase()}
        </h1>
      </div>

      {/* Products - Mobile: Linear/Horizontal layout, Desktop: Grid layout */}
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map((item) => {
                const key = item?._id || item?.id || `${Math.random()}`;
                const name = item?.name || item?.title || 'Unnamed Product';
                
                // Price logic
                const originalPrice = item?.mrp || item?.originalPrice || item?.price || 0;
                const salePrice = item?.discountPrice || item?.salePrice || item?.price || originalPrice;
                const discount = originalPrice && salePrice && originalPrice > salePrice 
                  ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) 
                  : (item?.discount || 0);

                // Image logic
                const images = Array.isArray(item?.images) ? item.images : (Array.isArray(item?.photos) ? item.photos : []);
                let imgUrl = null;
                if (images.length > 0) {
                  const firstImg = images[0];
                  imgUrl = typeof firstImg === 'string' ? firstImg : (firstImg?.url || null);
                } else if (item?.image) {
                  imgUrl = item.image;
                } else if (item?.photo) {
                  imgUrl = item.photo;
                } else if (item?.imageUrl) {
                  imgUrl = item.imageUrl;
                }
                
                const img = toAbs(imgUrl);
                
                const rating = item?.rating || 5;
                const isOutOfStock = item?.stock === 0 || item?.quantity === 0;
                
                return (
                  <div 
                    key={key} 
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative cursor-pointer flex md:flex-col" 
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
                    <div className="w-32 sm:w-40 md:w-full flex-shrink-0 md:flex-shrink aspect-square bg-gray-100 flex items-center justify-center p-2 sm:p-3 md:p-4">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={img} 
                          alt={name} 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-[10px] sm:text-xs md:text-sm">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info - Mobile: Flex column, Desktop: Normal */}
                    <div className="flex-1 p-2 sm:p-3 md:p-4 flex flex-col">
                      {/* Category - Mobile only */}
                      <div className="text-[9px] sm:text-[10px] md:hidden text-gray-500 uppercase mb-0.5 sm:mb-1">
                        {item?.category || item?.type || 'PRODUCT'}
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-sm mb-1 sm:mb-2 line-clamp-2">
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
                        {originalPrice && originalPrice !== salePrice && (
                          <span className="text-gray-500 line-through text-[10px] sm:text-xs md:text-sm">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                          ₹{salePrice?.toLocaleString() || '0'}
                        </span>
                      </div>

                      {/* Action Button - Mobile: Smaller, Desktop: Normal */}
                      <button 
                        className={`w-full py-1.5 sm:py-2 md:py-2 px-2 sm:px-3 md:px-4 rounded-md text-[10px] sm:text-xs md:text-sm font-medium transition-colors ${
                          isOutOfStock 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-yellow-300 hover:bg-yellow-300 text-white'
                        }`}
                        disabled={isOutOfStock}
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
    </div>
  );
}

