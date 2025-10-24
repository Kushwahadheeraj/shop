"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import API_BASE_URL from "@/lib/apiConfig";

export default function Paints() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [quickView, setQuickView] = useState(null); // product for modal
  const [selectedColor, setSelectedColor] = useState("");

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
          const original = p.price ?? p.fixPrice ?? p.minPrice ?? null;
          const current = p.discountPrice ?? p.fixPrice ?? p.price ?? p.minPrice ?? null;
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
            description: p.description || p.desc || "",
            colors: Array.isArray(p.colors) ? p.colors : (Array.isArray(p.colours) ? p.colours : []),
            tags: Array.isArray(p.tags) ? p.tags : (
              typeof p.tags === 'string' ? p.tags.split(',').map(t => t.trim()).filter(Boolean) :
              (typeof p.keywords === 'string' ? p.keywords.split(',').map(t => t.trim()).filter(Boolean) : [])
            )
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
          <div
            key={product.id}
            className="group bg-white rounded-lg shadow p-3 relative flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Discount Badge */}
            {product.discount > 0 && (
              <span className="absolute left-3 top-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                -{product.discount}%
              </span>
            )}
            {/* Product Image */}
            <div className="h-40 flex items-center justify-center mb-3 relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="object-contain h-full w-full rounded transform transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              {/* Hover Quick View bar */}
              <button
                type="button"
                onClick={() => { setQuickView(product); setSelectedColor((product.colors && product.colors[0]) || ""); }}
                className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 mx-0"
              >
                <div className="mx-3 bg-yellow-300 text-white text-sm font-extrabold text-center py-2 rounded">
                  QUICK VIEW
                </div>
              </button>
            </div>
            {/* Product Info */}
            <div className="flex-1 flex flex-col">
              
              <span className="text-xs text-gray-500 mb-1">{product.type}</span>
              <Link href={`/product/${product.id}`} className="font-medium text-sm mb-1 hover:underline">
                {product.name}
              </Link>
              {/* Price */}
              <div className="mb-1">
                {product.price != null && product.price > 0 && product.discount > 0 && (
                  <span className="text-gray-400 line-through text-xs mr-2">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="font-bold text-base">
                  {product.discountPrice > 0 ? 
                    `₹${Number(product.discountPrice).toLocaleString('en-IN')}` : 
                    product.price > 0 ? 
                      `₹${Number(product.price).toLocaleString('en-IN')}` : 
                      "Price on request"
                  }
                </span>
              </div>
              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? "text-yellow-300" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  ))}
                </div>
              )}
              {/* Button */}
              <button 
                onClick={() => {
                  // Add to cart directly
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.discountPrice || product.price || 0,
                    image: product.image,
                    thumbnail: product.image
                  });
                }}
                className="mt-auto cursor-pointer bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded transition w-full"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 p-2 sm:p-6" onClick={() => setQuickView(null)}>
          <div className="w-full max-w-5xl bg-white rounded shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-4 flex items-center justify-center bg-gray-50">
                <img src={quickView.image} alt={quickView.name} className="max-h-96 object-contain" />
              </div>
              <div className="lg:w-1/2 p-6 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold leading-tight">{quickView.name}</h3>
                  <button className="text-gray-500 hover:text-black" onClick={() => setQuickView(null)}>✕</button>
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">{quickView.type}</div>
                <div>
                  {quickView.price != null && quickView.discount > 0 && (
                    <span className="text-gray-400 line-through text-sm mr-2">₹{Number(quickView.price).toLocaleString('en-IN')}</span>
                  )}
                  <span className="font-bold text-lg">₹{Number((quickView.discountPrice ?? quickView.price) || 0).toLocaleString('en-IN')}</span>
                </div>
                {quickView.description && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">DESCRIPTION</div>
                    <p className="text-sm text-gray-700 leading-relaxed max-h-40 overflow-auto">{quickView.description}</p>
                  </div>
                )}
                {Array.isArray(quickView.tags) && quickView.tags.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">TAGS</div>
                    <div className="flex flex-wrap gap-2">
                      {quickView.tags.map((t, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 border border-gray-200 text-gray-700 px-2 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(quickView.colors) && quickView.colors.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-600">COLORS</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {quickView.colors.map((c, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(c)}
                          className={`h-8 px-3 rounded border text-xs ${selectedColor === c ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300 bg-white'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    className="bg-yellow-300 hover:bg-yellow-300 text-white font-semibold px-4 py-2 rounded"
                    onClick={() => {
                      addItem({
                        id: quickView.id,
                        name: quickView.name + (selectedColor ? ` - ${selectedColor}` : ''),
                        price: quickView.discountPrice ?? quickView.price,
                        image: quickView.image,
                        thumbnail: quickView.image,
                        color: selectedColor
                      });
                      setQuickView(null);
                    }}
                  >
                    ADD TO CART
                  </button>
                  <Link href={`/product/${quickView.id}`} className="text-sm font-medium underline text-gray-700 hover:text-black">View full details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}