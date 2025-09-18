"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

export default function Paints() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let mounted = true;
    const toAbs = (u) => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
      const base = API_BASE_URL.replace(/\/$/, '');
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${base}${path}`;
    };
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/paints/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((p) => {
          const images = Array.isArray(p.images) ? p.images : (Array.isArray(p.photos) ? p.photos : []);
          const image = images[0] ? toAbs(images[0]) : toAbs(p.image);
          const category = p.category || p.type || '';
          const name = p.name || p.title || '';
          const original = p.price ?? p.fixPrice ?? null;
          const current = p.discountPrice ?? p.fixPrice ?? p.price ?? null;
          let discount = p.discountPercent ?? p.discount ?? 0;
          if ((!discount || isNaN(discount)) && original && current && Number(original) > 0 && Number(original) > Number(current)) {
            discount = Math.round((1 - (Number(current) / Number(original))) * 100);
          }
          return {
            id: p._id,
            name,
            image: image || "/placeholder-image.jpg",
            type: category,
            price: original,
            discountPrice: current,
            discount: Number(discount) || 0,
            rating: p.rating || 0,
          };
        });
        setProducts(mapped);
      } catch {
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
      <h2 className="text-2xl font-bold mb-6">New arrivals</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-3 relative flex flex-col">
            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute left-3 top-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                -{product.discount}%
              </span>
            )}
            {/* Product Image */}
            <div className="h-40 flex items-center justify-center mb-3 relative group">
              <img src={product.image} alt={product.name} className="object-contain h-full w-full rounded" loading="lazy" />
 
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col">
              
              <span className="text-xs text-gray-500 mb-1">{product.type}</span>
              <span className="font-medium text-sm mb-1">{product.name}</span>
              {/* Price */}
              <div className="mb-1">
                {product.price != null && product.discount > 0 && (
                  <span className="text-gray-400 line-through text-xs mr-2">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-bold text-base">
                  ₹{Number((product.discountPrice ?? product.price) || 0).toLocaleString('en-IN')}
                </span>
              </div>
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
              )}
              {/* Button */}
              <Link href={`/product/${product.id}`} passHref>
                <button className="mt-auto cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded transition w-full">
                  SELECT OPTIONS
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}