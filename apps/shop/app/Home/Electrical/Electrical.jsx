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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((product, index) => (
          <div key={product.id || index} className="bg-white rounded-lg shadow p-3 relative flex flex-col">
            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute left-3 top-3 bg-black text-white text-xs font-bold rounded-full z-10 flex items-center justify-center w-10 h-10">
                -{product.discount}%
              </span>
            )}
            {/* Product Image */}
            <div className="h-40 flex items-center justify-center mb-3 relative group">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain h-full w-full rounded"
                loading="lazy"
              />
             
              {(product.stockStatus === "out_of_stock" || product.stockStatus === "out_of_stock_read_more") && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-600 bg-opacity-75 text-white font-bold text-lg rounded">
                  OUT OF STOCK
                </div>
              )}
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col">
              <span className="text-[10px] tracking-wide text-gray-500 mb-1 uppercase">{product.type}</span>
              <span className="font-semibold text-sm mb-1">{product.name}</span>
              {/* Price */}
              <div className="mb-1">
                {product.priceRange ? (
                  <span className="font-bold text-base">{product.priceRange}</span>
                ) : (
                  <>
                    {product.price != null && Number(product.discount) > 0 && (
                      <span className="text-gray-400 line-through text-sm mr-2">
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
                  </>
                )}
              </div>
              {/* Button */}
              {product.stockStatus !== "out_of_stock" && (
                <button 
                  onClick={() => {
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
                  className="mt-auto bg-[#f5c242] hover:bg-[#f2b51b] text-black font-semibold py-2 rounded transition w-full"
                >
                  {product.hasOptions ? 'SELECT OPTIONS' : 'ADD TO CART'}
                </button>
              )}
              {product.stockStatus === "out_of_stock_read_more" && (
                <Link href={`/product/${product.id}`} passHref>
                  <button className="mt-auto bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded transition w-full">
                    READ MORE
                  </button>
                </Link>
              )}
              {product.stockStatus === "out_of_stock" && (
                <button className="mt-auto bg-gray-300 text-gray-600 font-semibold py-2 rounded cursor-not-allowed w-full">
                  SELECT OPTIONS
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}