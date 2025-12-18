"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import API_BASE_URL from "@/lib/apiConfig";

export default function Electricals() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/electrical/get?firstPerCategory=true`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data;
        else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const toAbsoluteUrl = (u) => {
          if (!u) return "";
          if (typeof u !== 'string') return "";
          if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
          // ensure single slash join
          const base = API_BASE_URL.replace(/\/$/, '');
          const path = u.startsWith('/') ? u : `/${u}`;
          return `${base}${path}`;
        };

        const ensureArray = (val) => {
          if (!val) return [];
          if (Array.isArray(val)) return val;
          return [val];
        };

        const mapped = list.map(p => {
          const src = p && p.product ? p.product : p;
          const priceRangeMin = src.minPrice ?? src.min ?? null;
          const priceRangeMax = src.maxPrice ?? src.max ?? null;
          const hasRange = priceRangeMin != null && priceRangeMax != null && Number(priceRangeMin) !== Number(priceRangeMax);
          // Determine current/original prices
          const current = hasRange ? null : (
            src.fixPrice ?? src.discountPrice ?? src.price ?? src.mrp ?? null
          );
          const original = hasRange ? null : (
            src.originalPrice ?? src.price ?? null
          );
          // Discount percent
          let discountPercent = Number(src.discount ?? 0);
          if ((!discountPercent || isNaN(discountPercent)) && original != null && current != null && Number(original) > 0 && Number(original) > Number(current)) {
            discountPercent = Math.round((1 - (Number(current) / Number(original))) * 100);
          }
          const min = priceRangeMin;
          const max = priceRangeMax;
          const rawImages = [
            ...ensureArray(src.images),
            ...ensureArray(src.photos),
            ...ensureArray(src.imageUrl),
            ...ensureArray(src.image),
          ].filter(Boolean);
          const normalizedImages = rawImages
            .map((im) => typeof im === 'string' ? im : (im?.url || im?.secure_url || ''))
            .filter(Boolean)
            .map(toAbsoluteUrl);
          const image = normalizedImages[0] || "/placeholder-image.jpg";
          const totalRaw = src.totalProduct ?? src.quantity ?? src.stock ?? src.availableStock ?? undefined;
          const totalNum = totalRaw === undefined || totalRaw === null || totalRaw === '' ? undefined : Number(totalRaw);
          let stockStatus = hasRange ? "price_range" : "in_stock";
          if (totalNum === 0) stockStatus = "out_of_stock";
          const ampsArr = Array.isArray(src.amps) ? src.amps : [];
          const colourArr = Array.isArray(src.colour) ? src.colour : [];
          const wayVal = src.way || '';
          const hasOptions = (ampsArr.length > 0) || (colourArr.length > 0) || Boolean(wayVal) || hasRange;
          const formatINR = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          return {
            id: src._id,
            name: src.name || src.title || '',
            image,
            images: normalizedImages,
            price: original, // original/base
            currentPrice: current, // current price to show bold
            discountPrice: current, // keep for compatibility
            discount: Number(discountPercent) || 0,
            priceRange: hasRange ? `₹${Number(min).toFixed(2)} – ₹${Number(max).toFixed(2)}` : null,
            type: src.category || src.subCategory || '',
            stockStatus,
            hasOptions,
            priceFormatted: original != null ? formatINR(original) : '',
            currentPriceFormatted: current != null ? formatINR(current) : '',
            discountPriceFormatted: current != null ? formatINR(current) : '',
          };
        });
        setProducts(mapped);
      } catch (e) {
        if (!mounted) return;
        setProducts([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  if (products.length === 0) return null;

  return (
    <div className="px-6 py-8">
      <h2 className="text-2xl font-bold mb-6">Electricals</h2>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-6">
        {products.map((product, index) => {
          // Calculate "Buy at" price - always show (5% discount on current price or 5% off original if no discount)
          const currentPrice = product.currentPrice > 0 ? Number(product.currentPrice) : (product.price > 0 ? Number(product.price) : 0);
          const buyAtPrice = currentPrice > 0 ? Math.round(currentPrice * 0.95) : null;
          
          // Default rating for display (since Electricals doesn't have rating field)
          const displayRating = 4.0 + (index % 5) * 0.1; // Varies between 4.0-4.4
          
          return (
            <Link
              href={`/product/${product.id}`}
              key={product.id || index}
              className="bg-white rounded-lg shadow p-1.5 sm:p-2 lg:p-3 relative flex flex-col cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Discount Badge - Top Left */}
              {product.discount > 0 && (
                <span className="absolute left-1.5 sm:left-2 top-1.5 sm:top-2 lg:left-3 lg:top-3 bg-black text-white text-[9px] sm:text-[10px] lg:text-xs font-bold px-1 sm:px-1.5 lg:px-2 py-0.5 rounded-full z-10">
                  -{product.discount}%
                </span>
              )}
              
              {/* Product Image - Reduced height for responsive */}
              <div className="h-20 sm:h-24 lg:h-40 flex items-center justify-center mb-1 sm:mb-1.5 lg:mb-3 relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain h-full w-full rounded"
                  loading="lazy"
                />
                
                {/* Rating Badge - Bottom Left Overlay (Responsive only) */}
                <div className="absolute bottom-0.5 sm:bottom-1 left-0.5 sm:left-1 lg:hidden bg-white/90 backdrop-blur-sm rounded px-1 sm:px-1.5 py-0.5 flex items-center gap-0.5 z-10">
                  <span className="text-[8px] sm:text-[9px] font-semibold text-gray-800">{displayRating.toFixed(1)}</span>
                  <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                  </svg>
                </div>
               
                {(product.stockStatus === "out_of_stock" || product.stockStatus === "out_of_stock_read_more") && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 text-white font-bold text-xs sm:text-sm lg:text-lg rounded">
                    OUT OF STOCK
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="flex-1 flex flex-col">
                {/* Category - Hidden on mobile, shown on desktop */}
                <span className="hidden lg:block text-[10px] tracking-wide text-gray-500 mb-1 uppercase">{product.type}</span>
                
                {/* Product Name - Single line with ellipsis */}
                <div className="font-semibold text-[10px] sm:text-[11px] lg:text-sm mb-0.5 sm:mb-1 truncate whitespace-nowrap overflow-hidden">
                  {product.name}
                </div>
                
                {/* Price Section - All prices on same line */}
                <div className="mb-0.5 sm:mb-1 lg:mb-1.5 lg:space-y-0.5">
                  {/* Original, Discounted, and Buy at Price - All on same line for responsive */}
                  {product.priceRange ? (
                    <div className="lg:hidden flex items-center gap-1 whitespace-nowrap overflow-hidden">
                      <span className="font-bold text-[9px] sm:text-[10px] flex-shrink-0">{product.priceRange}</span>
                      {buyAtPrice && (
                        <span className="text-blue-600 font-medium text-[9px] sm:text-[10px] flex-shrink-0">
                          Buy at ₹{buyAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="lg:hidden flex items-center gap-1 text-[9px] sm:text-[10px] whitespace-nowrap overflow-hidden">
                      {product.price != null && Number(product.discount) > 0 && (
                        <span className="text-gray-400 line-through flex-shrink-0">
                          {product.priceFormatted}
                        </span>
                      )}
                      {product.currentPriceFormatted && (
                        <span className="font-bold flex-shrink-0">
                          {product.currentPriceFormatted}
                        </span>
                      )}
                      {!product.currentPriceFormatted && product.priceFormatted && (
                        <span className="font-bold flex-shrink-0">
                          {product.priceFormatted}
                        </span>
                      )}
                      {buyAtPrice && (
                        <span className="text-blue-600 font-medium flex-shrink-0">
                          Buy at ₹{buyAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Desktop Price Section */}
                  <div className="hidden lg:block">
                    {product.priceRange ? (
                      <span className="font-bold text-base">{product.priceRange}</span>
                    ) : (
                      <div className="flex items-center flex-wrap gap-1 sm:gap-2">
                        {product.price != null && Number(product.discount) > 0 && (
                          <span className="text-gray-400 line-through text-sm">
                            {product.priceFormatted}
                          </span>
                        )}
                        {product.currentPriceFormatted && (
                          <span className="font-bold text-base">
                            {product.currentPriceFormatted}
                          </span>
                        )}
                        {!product.currentPriceFormatted && product.priceFormatted && (
                          <span className="font-bold text-base">
                            {product.priceFormatted}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Button - Hidden on responsive, shown on desktop */}
                {product.stockStatus !== "out_of_stock" && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (product.hasOptions) {
                        // Navigate to product page for options
                        window.location.href = `/product/${product.id}`;
                      } else {
                        // Add to cart directly
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.currentPrice || product.price,
                          image: product.image,
                          thumbnail: product.image
                        });
                      }
                    }}
                    className="w-full bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded transition text-sm"
                  >
                    {product.hasOptions ? 'SELECT OPTIONS' : 'ADD TO CART'}
                  </button>
                )}
                {product.stockStatus === "out_of_stock_read_more" && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/product/${product.id}`;
                    }}
                    className="hidden lg:block mt-auto bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded transition w-full text-sm"
                  >
                    READ MORE
                  </button>
                )}
                {product.stockStatus === "out_of_stock" && (
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="hidden lg:block mt-auto bg-gray-300 text-gray-600 font-semibold py-2 rounded cursor-not-allowed w-full text-sm"
                  >
                    SELECT OPTIONS
                  </button>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}