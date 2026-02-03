"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useCart } from "@/components/CartContext";
import API_BASE_URL from "@/lib/apiConfig";
import Link from "next/link";
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function PopularTools() {
  const { addItem } = useCart();
  const [tools, setTools] = useState([]);
  const scrollRef = useRef(null);
  const { title } = useSectionTitle('popular-tools', 'Popular Tools');

  useEffect(() => {
    let mounted = true;
    const toAbs = (u) => {
      if (!u || typeof u !== 'string') return '';
      if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
      
      // Remove /api suffix if present to get the root URL for static files
      const base = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
      const path = u.startsWith('/') ? u : `/${u}`;
      return `${base}${path}`;
    };
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/producttools/get`);
        const json = await res.json();
        let list = [];
        if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
        if (!mounted) return;
        const mapped = list.map((p, idx) => {
          const images = Array.isArray(p.images) ? p.images : (Array.isArray(p.photos) ? p.photos : []);
          const image = images[0] ? toAbs(images[0]) : '';
          const name = p.name || p.title || '';
          const category = p.category || '';
          const rating = Number(p.rating || 0);
          const base = p.price ?? p.fixPrice ?? null;
          const current = p.discountPrice ?? p.fixPrice ?? p.price ?? null;
          let discount = p.discount ?? 0;
          if ((!discount || isNaN(discount)) && base && current && Number(base) > 0 && Number(base) > Number(current)) {
            discount = Math.round((1 - (Number(current) / Number(base))) * 100);
          }
          const priceStr = current != null ? `₹${Number(current).toLocaleString('en-IN')}` : '';
          const originalStr = base != null && Number(discount) > 0 ? `₹${Number(base).toLocaleString('en-IN')}` : '';
          const hasRange = p.minPrice != null && p.maxPrice != null && Number(p.minPrice) !== Number(p.maxPrice);
          const rangeStr = hasRange ? `₹${Number(p.minPrice).toLocaleString('en-IN')} - ₹${Number(p.maxPrice).toLocaleString('en-IN')}` : '';
          return {
            id: p._id || idx,
            image,
            name,
            category,
            rating,
            price: hasRange ? rangeStr : priceStr,
            originalPrice: hasRange ? '' : originalStr,
            discount: discount ? `-${discount}%` : '',
            buttonText: hasRange ? 'Select Options' : 'Add to Cart',
            basePrice: base != null ? Number(base) : null,
            currentPrice: current != null ? Number(current) : null,
            minPrice: hasRange ? Number(p.minPrice) : null,
            maxPrice: hasRange ? Number(p.maxPrice) : null,
            discountValue: Number(discount) || 0,
          };
        });
        setTools(mapped);
      } catch {
        if (!mounted) return;
        setTools([]);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by container width to show next set of cards (3 on mobile, 8 on desktop)
      const scrollAmount = clientWidth * 0.95; // Scroll 95% of container width
      const scrollTo = direction === 'left'
        ? scrollLeft - scrollAmount
        : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (tools.length === 0) return null;

  return (
    <div className="w-full mx-auto py-6 lg:py-10 px-2 lg:px-4">
      
      {/* Light blue background container with rounded corners */}
      <div className="bg-[#E8F4FD] rounded-2xl lg:rounded-3xl p-4 lg:p-6 relative">
      <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 px-2 lg:px-0">{title}</h2>

        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="hidden lg:block absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full shadow-lg p-2 lg:p-3 transition-all"
          aria-label="Scroll Left"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-2 lg:gap-3 lg:px-14 scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
        >
          {tools.map((tool, index) => (
            <Link
              href={`/product/${tool.id}`}
              key={tool.id || index}
              onClick={() => {
                try {
                  if (typeof window !== 'undefined' && tool.id) {
                    const raw = {
                      _id: tool.id,
                      name: tool.name,
                      image: tool.image,
                      images: [tool.image],
                      category: tool.category,
                      price: tool.basePrice,
                      fixPrice: tool.basePrice,
                      discountPrice: tool.currentPrice,
                      minPrice: tool.minPrice,
                      maxPrice: tool.maxPrice,
                      discount: tool.discountValue,
                    };
                    window.sessionStorage.setItem('selectedProduct', JSON.stringify(raw));
                  }
                } catch {}
              }}
              className="w-[calc((100%-0.5rem)/3)] lg:w-[calc((100%-5.25rem)/8)] flex-shrink-0"
            >
              {/* White rounded card */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative">
                {/* Discount Badge */}
                {/* {tool.discount && (
                  <div className="absolute top-2 left-2 lg:top-3 lg:left-3 bg-black text-white text-[10px] lg:text-xs font-bold rounded-full w-10 h-8 lg:w-12 lg:h-10 flex items-center justify-center z-10">
                    {tool.discount}
                  </div>
                )} */}
                
                {/* Product Image */}
                <div className="w-full flex items-center justify-center mb-2 lg:mb-3 h-24 lg:h-40">
                  <Image
                    src={tool.image || '/placeholder-image.jpg'}
                    alt={tool.name}
                    width={150}
                    height={150}
                    className="object-contain h-full w-full"
                  />
                </div>
                
                {/* Product Info */}
                <div className="text-center flex-1 flex flex-col">
                  {/* Product Name - Single line with proper truncation */}
                  <h3 className="font-semibold text-xs lg:text-sm mb-1 lg:mb-2 w-full overflow-hidden text-ellipsis whitespace-nowrap block" title={tool.name}>
                    {tool.name}
                  </h3>
                  
                  {/* Price - Single line */}
                  {/* <div className="text-xs lg:text-sm font-bold whitespace-nowrap overflow-hidden flex items-center justify-center gap-1 mt-auto">
                    {tool.originalPrice && (
                      <span className="line-through text-gray-400 flex-shrink-0">
                        {tool.originalPrice}
                      </span>
                    )}
                    <span className="flex-shrink-0">{tool.price}</span>
                  </div> */}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="hidden lg:block absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 rounded-full shadow-lg p-2 lg:p-3 transition-all"
          aria-label="Scroll Right"
        >
          <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}