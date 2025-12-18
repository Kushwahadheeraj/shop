"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import API_BASE_URL from "@/lib/apiConfig";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";

const toAbs = (u) => {
  if (!u || typeof u !== 'string') return '';
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
  const base = API_BASE_URL.replace(/\/$/, '');
  const path = u.startsWith('/') ? u : `/${u}`;
  return `${base}${path}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { addItem } = useCart();
  const { user } = useAuth();
  const [hasToken, setHasToken] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [isZoom, setIsZoom] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState('center');
  const imgWrapRef = typeof window !== 'undefined' ? (window._prodImgWrapRef ||= { current: null }) : { current: null };
  const getJwtFromLocalStorage = () => {
    try {
      // Try common keys first
      const keys = ['token','authToken','userToken','accessToken','jwt','sellerToken'];
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (v && v.split('.').length === 3) return v;
      }
      // Fallback: scan all keys for a JWT-like value
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const val = localStorage.getItem(key);
        if (val && val.split('.').length === 3) return val;
      }
    } catch {}
    return null;
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState("");
  const [colour, setColour] = useState("");
  const [weight, setWeight] = useState("");
  const [amp, setAmp] = useState("");
  const [variant, setVariant] = useState("");
  const [brandSel, setBrandSel] = useState("");
  const [waySel, setWaySel] = useState("");
  const [typeOption, setTypeOption] = useState("");
  const [customSel, setCustomSel] = useState({});
  const [related, setRelated] = useState([]);
  const [sameCategoryFive, setSameCategoryFive] = useState([]);
  const [recent, setRecent] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState("");
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    // detect token quickly to allow review form
    try {
      const anyToken = getJwtFromLocalStorage();
      setHasToken(!!anyToken || !!user);
    } catch { setHasToken(!!user); }
    let mounted = true;
    const fetchOne = async () => {
      setLoading(true);
      setError("");
      try {
        // 1) Try sessionStorage item saved from list click (fast, no server dependency)
        let raw = null;
        try {
          const cached = sessionStorage.getItem('selectedProduct');
          if (cached) {
            const candidate = JSON.parse(cached);
            if (candidate && (String(candidate._id) === String(id) || String(candidate.id) === String(id))) {
              raw = candidate;
            }
          }
        } catch {}

        // 2) Try hitting backend category getOne endpoints to retrieve full record
        let list = [];
        if (!raw) {
          const base = API_BASE_URL.replace(/\/$/, '');
          const segments = ['adhesives','paint','cements','dry','electrical','fiber','fitting','hardware','home','homedecor','locks','pipe','pvcmats','roofer','sanitary','tools','uncategorized','waterproofing'];
          for (const seg of segments) {
            try {
              const r = await fetch(`${base}/${seg}/getOne/${id}`, { cache: 'no-store' });
              if (r.ok) {
                raw = await r.json();
                break;
              }
            } catch {}
          }
        }

        // 3) Final fallback to legacy paints list endpoint
        if (!raw) {
          try {
            const resLegacy = await fetch(`${API_BASE_URL}/home/paints/get`, { cache: 'no-store' });
            const json = await resLegacy.json();
            if (json && json.success && Array.isArray(json.data)) list = json.data; else if (Array.isArray(json)) list = json;
            raw = list.find(p => String(p._id) === String(id));
          } catch {}
        }

        if (!mounted) return;
        if (!raw) {
          setError("Product not found");
          setLoading(false);
          return;
        }

        const rawImages = Array.isArray(raw.images) ? raw.images : (Array.isArray(raw.photos) ? raw.photos : []);
        const images = rawImages.map(toAbs);
        const image = images[0] ? images[0] : toAbs(raw.image);
        const category = raw.category || raw.type || '';
        const name = raw.name || raw.title || '';
        const original = raw.price ?? raw.fixPrice ?? null;
        const current = raw.discountPrice ?? raw.fixPrice ?? raw.price ?? null;
        let discount = raw.discountPercent ?? raw.discount ?? 0;
        if ((!discount || isNaN(discount)) && original && current && Number(original) > 0 && Number(original) > Number(current)) {
          discount = Math.round((1 - (Number(current) / Number(original))) * 100);
        }
        const colors = Array.isArray(raw.colors) ? raw.colors : (Array.isArray(raw.colours) ? raw.colours : []);
        const tags = Array.isArray(raw.tags) ? raw.tags : (
          typeof raw.tags === 'string' ? raw.tags.split(',').map(t => t.trim()).filter(Boolean) :
          (typeof raw.keywords === 'string' ? raw.keywords.split(',').map(t => t.trim()).filter(Boolean) : [])
        );

        const mappedProduct = {
          id,
          name,
          image: image || "/placeholder-image.jpg",
          images: images.length ? images : [image || "/placeholder-image.jpg"],
          type: category,
          category,
          price: original,
          discountPrice: current,
          fixPrice: raw.fixPrice ?? null,
          minPrice: raw.minPrice ?? null,
          maxPrice: raw.maxPrice ?? null,
          discount: Number(discount) || 0,
          description: raw.description || raw.desc || "",
          colors,
          colour: Array.isArray(raw.colour) ? raw.colour : (typeof raw.colour === 'string' ? raw.colour.split(',').map(s=>s.trim()).filter(Boolean) : undefined),
          weights: Array.isArray(raw.weights) ? raw.weights : (raw.weight ? [raw.weight] : undefined),
          amps: Array.isArray(raw.amps) ? raw.amps : (raw.amp ? [raw.amp] : undefined),
          brand: raw.brand || '',
          way: raw.way || '',
          tags,
          variants: Array.isArray(raw.variants) ? raw.variants : [],
          customFields: Array.isArray(raw.customFields) ? raw.customFields : [],
          dimensions: raw.dimensions || raw.size || ''
        };
        setProduct(mappedProduct);
        setColor(colors?.[0] || "");
        try {
          setColour((Array.isArray(mappedProduct.colour) && mappedProduct.colour[0]) || "");
          setWeight((Array.isArray(mappedProduct.weights) && mappedProduct.weights[0]) || "");
          setAmp((Array.isArray(mappedProduct.amps) && mappedProduct.amps[0]) || "");
          setVariant((Array.isArray(mappedProduct.variants) && (mappedProduct.variants[0]?.variantName || mappedProduct.variants[0]?.name)) || "");
          setBrandSel(Array.isArray(mappedProduct.brand) ? mappedProduct.brand[0] : (mappedProduct.brand || ""));
          setWaySel(Array.isArray(mappedProduct.way) ? mappedProduct.way[0] : (mappedProduct.way || ""));
          setTypeOption((Array.isArray(mappedProduct.typeOptions) && (mappedProduct.typeOptions[0]?.fit || mappedProduct.typeOptions[0])) || "");
        } catch {}
        // Recently viewed (store minimal info)
        try {
          const prev = JSON.parse(localStorage.getItem('recent_products') || '[]');
          const next = [
            { 
              id: mappedProduct.id, 
              name: mappedProduct.name, 
              image: mappedProduct.image, 
              type: mappedProduct.type, 
              price: mappedProduct.price, 
              discountPrice: mappedProduct.discountPrice, 
              minPrice: mappedProduct.minPrice,
              maxPrice: mappedProduct.maxPrice,
              discount: mappedProduct.discount 
            }
          ].concat(prev.filter(p => String(p.id) !== String(mappedProduct.id)));
          const trimmed = next.slice(0, 6);
          localStorage.setItem('recent_products', JSON.stringify(trimmed));
          setRecent(trimmed);
        } catch {}
        // Ensure we have a list for related; if empty leave related empty

        // Build related products, prioritize same category
        const sameCategory = (Array.isArray(list) ? list : []).filter(p => (p.category || p.type || '') === (category || '') && String(p._id) !== String(id));
        let relatedMapped = sameCategory
          .slice(0, 8)
          .map(p => {
            const imgs = Array.isArray(p.images) ? p.images : (Array.isArray(p.photos) ? p.photos : []);
            const img = imgs[0] ? toAbs(imgs[0]) : toAbs(p.image);
            const orig = p.price ?? p.fixPrice ?? null;
            const curr = p.discountPrice ?? p.fixPrice ?? p.price ?? null;
            const minP = p.minPrice ?? null;
            const maxP = p.maxPrice ?? null;
            let disc = p.discountPercent ?? p.discount ?? 0;
            if ((!disc || isNaN(disc)) && orig && curr && Number(orig) > 0 && Number(orig) > Number(curr)) {
              disc = Math.round((1 - (Number(curr) / Number(orig))) * 100);
            }
            return {
              id: p._id,
              name: p.name || p.title || '',
              image: img || '/placeholder-image.jpg',
              type: p.category || p.type || '',
              price: orig,
              discountPrice: curr,
              minPrice: minP,
              maxPrice: maxP,
              discount: Number(disc) || 0
            };
          });

        // Fallback to locally stored recent products of same type if empty
        if (!relatedMapped || relatedMapped.length === 0) {
          try {
            const stored1 = JSON.parse(localStorage.getItem('recent_products') || '[]');
            const stored2 = JSON.parse(localStorage.getItem('recently_viewed_products') || '[]');
            const allStored = []
              .concat(Array.isArray(stored1) ? stored1 : [])
              .concat(Array.isArray(stored2) ? stored2.map(p=>({ id: p._id || p.id, name: p.name, image: p.photo || p.image, type: p.category, price: p.price, discountPrice: p.discountPrice, minPrice: p.minPrice, maxPrice: p.maxPrice, discount: 0 })) : []);
            if (Array.isArray(allStored) && allStored.length) {
              relatedMapped = allStored
                .filter(r => String(r.id) !== String(id) && (r.type === (category || '')))
                .slice(0, 8);
            }
          } catch {}
        }
        setRelated(relatedMapped);
        // For Additional Information tab: strictly 5 items of same category
        setSameCategoryFive(relatedMapped.slice(0, 5));
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load product");
        setLoading(false);
      }
    };
    if (id) fetchOne();
    return () => { mounted = false };
  }, [id, user]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const base = API_BASE_URL.replace(/\/$/, '');
        const apiRoot = base.endsWith('/api') ? base : `${base}/api`;
        const res = await fetch(`${apiRoot}/reviews?productId=${id}`, { cache: 'no-store' });
        const json = await res.json();
        if (json && json.success) setReviews(json.data || []);
      } catch {}
    };
    if (id) loadReviews();
  }, [id]);

  const priceBlock = useMemo(() => {
    if (!product) return null;

    // If a specific option is chosen, try to use its price
    let optionOriginal = null;
    let optionCurrent = null;

    // Variants can carry their own pricing
    if (Array.isArray(product.variants) && product.variants.length > 0 && variant) {
      const v = product.variants.find(v => (v.variantName || v.name) === variant);
      if (v) {
        optionOriginal = v.fixPrice ?? null;
        optionCurrent = v.discountPrice ?? v.fixPrice ?? null;
      }
    }

    // Derive price from variant that matches weight or amp or colour label
    if (optionCurrent == null && Array.isArray(product.variants) && product.variants.length > 0) {
      const matchBy = (label) => product.variants.find(v => (v.variantName || v.name || '').toString().toLowerCase() === String(label||'').toLowerCase());
      let candidate = null;
      if (weight) candidate = matchBy(weight);
      if (!candidate && amp) candidate = matchBy(amp);
      if (!candidate && colour) candidate = matchBy(colour);
      if (!candidate && color) candidate = matchBy(color);
      if (candidate) {
        optionOriginal = candidate.fixPrice ?? null;
        optionCurrent = candidate.discountPrice ?? candidate.fixPrice ?? null;
      }
    }

    // typeOptions (e.g., fit/rate)
    if (optionCurrent == null && Array.isArray(product.typeOptions) && product.typeOptions.length > 0 && typeOption) {
      const t = product.typeOptions.find(t => (t?.fit || String(t)) === typeOption);
      const rate = t?.rate ?? null;
      if (rate != null) {
        optionOriginal = null;
        optionCurrent = Number(rate);
      }
    }

    if (optionCurrent != null || optionOriginal != null) {
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-bold text-lg sm:text-xl md:text-2xl">₹{Number(optionCurrent ?? 0).toLocaleString('en-IN')}</span>
        </div>
      );
    }

    const hasRange = !product.fixPrice && product.minPrice != null && product.maxPrice != null && Number(product.minPrice) !== Number(product.maxPrice);
    if (hasRange) {
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-bold text-lg sm:text-xl md:text-2xl">₹{Number(product.minPrice).toLocaleString('en-IN')} – ₹{Number(product.maxPrice).toLocaleString('en-IN')}</span>
        </div>
      );
    }
    const current = product.discountPrice ?? product.minPrice ?? product.maxPrice ?? product.price ?? 0;
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="font-bold text-lg sm:text-xl md:text-2xl">₹{Number(current || 0).toLocaleString('en-IN')}</span>
      </div>
    );
  }, [product, variant, typeOption, weight, amp, colour, color]);

  // Ensure Additional Information has at least 2 same-category items by querying backend category endpoint
  useEffect(() => {
    const ensureSameCategory = async () => {
      try {
        if (!product) return;
        if (Array.isArray(sameCategoryFive) && sameCategoryFive.length >= 2) return;
        const cat = (product.category || product.type || '').toLowerCase();
        if (!cat) return;
        const base = API_BASE_URL.replace(/\/$/, '');
        const map = {
          adhesives: 'adhesives',
          adhesive: 'adhesives',
          paints: 'paint',
          paint: 'paint',
          cements: 'cements',
          cement: 'cements',
          dry: 'dry',
          electrical: 'electrical',
          lighting: 'electrical',
          locks: 'locks',
          pipe: 'pipe',
          pipes: 'pipe',
          sanitary: 'sanitary',
          tools: 'tools',
          roofer: 'roofer',
          homedecor: 'homedecor',
          home: 'home',
        };
        const seg = map[cat];
        if (!seg) return;
        const url = `${base}/${seg}/get`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const list = data
          .filter(p => String(p._id) !== String(product.id))
          .slice(0, 5)
          .map(p => ({
            id: p._id,
            name: p.name || p.title || '',
            image: (Array.isArray(p.photos) && p.photos[0]) ? toAbs(p.photos[0]) : toAbs(p.image),
            type: p.category || p.type || '',
            price: p.price ?? p.fixPrice ?? null,
            discountPrice: p.discountPrice ?? p.fixPrice ?? p.price ?? null,
            minPrice: p.minPrice ?? null,
            maxPrice: p.maxPrice ?? null,
            discount: Number(p.discountPercent ?? p.discount ?? 0) || 0,
          }));
        if (list.length > 0) {
          setSameCategoryFive(list.slice(0, 5));
          if (!related || related.length === 0) setRelated(list);
        }
      } catch {}
    };
    ensureSameCategory();
  }, [product, sameCategoryFive, related]);

  const ratingSummary = useMemo(() => {
    if (!reviews || reviews.length === 0) return { avg: 0, count: 0 };
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    const avg = Math.round((sum / reviews.length) * 10) / 10; // 1 decimal
    return { avg, count: reviews.length };
  }, [reviews]);

  if (loading) return <div className="p-4 sm:p-6 mt-20 sm:mt-24 md:mt-32 lg:mt-36">Loading...</div>;
  if (error) return <div className="p-4 sm:p-6 mt-20 sm:mt-24 md:mt-32 lg:mt-36 text-red-600 text-sm sm:text-base">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mt-20 sm:mt-24 md:mt-32 lg:mt-36 mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        <Link href="/">Home</Link> / <span className="capitalize">{product.type || 'Product'}</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Image Section */}
        <div className="w-full lg:w-[42%] bg-white rounded border p-0">
          <div className="relative w-full h-[280px] sm:h-[350px] md:h-[420px] lg:h-[480px] overflow-hidden flex items-center justify-center">
            <button
              onClick={() => setCurrentImg((i) => (i - 1 + product.images.length) % product.images.length)}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-white/80 border rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow text-sm sm:text-base z-10"
              aria-label="Previous image"
            >
              ‹
            </button>
            <div
              ref={(el)=>{imgWrapRef.current=el}}
              className="w-full h-full"
              onMouseEnter={()=>setIsZoom(true)}
              onMouseLeave={()=>setIsZoom(false)}
              onMouseMove={(e)=>{
                const rect = imgWrapRef.current?.getBoundingClientRect();
                if (!rect) return;
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomOrigin(`${x}% ${y}%`);
              }}
            >
              <Image
                src={product.images[currentImg]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-contain transition-transform duration-300"
                style={{ transform: isZoom ? 'scale(1.6)' : 'scale(1)', transformOrigin: zoomOrigin }}
              />
            </div>
            <button
              onClick={() => setCurrentImg((i) => (i + 1) % product.images.length)}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-white/80 border rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shadow text-sm sm:text-base z-10"
              aria-label="Next image"
            >
              ›
            </button>
          </div>
          {product.images.length > 1 && (
            <div className="mt-2 sm:mt-3 grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 px-1 sm:px-0">
              {product.images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImg(idx)}
                  className={`border rounded p-0.5 sm:p-1 h-12 sm:h-14 md:h-16 flex items-center justify-center ${idx===currentImg ? 'border-yellow-300 border-2' : 'border-gray-200'}`}
                  aria-label={`Show image ${idx+1}`}
                >
                  <Image src={src} alt={product.name + ' ' + (idx+1)} width={80} height={80} className="object-contain max-h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Product Details Section */}
        <div className="lg:flex-1 space-y-4 sm:space-y-6">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            HOME / <span className="uppercase">{product.type || 'PRODUCT'}</span>
          </div>
          
          {/* Product Title */}
          <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
          
          {/* Rating and Price */}
          <div className="space-y-3">
            {ratingSummary.count > 0 && (
              <button onClick={()=>setActiveTab('reviews')} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-yellow-300 text-lg">{
                  '★★★★★'.slice(0, Math.round(ratingSummary.avg))
                }{
                  '☆☆☆☆☆'.slice(0, 5 - Math.round(ratingSummary.avg))
                }</span>
                <span className="text-gray-500">({ratingSummary.count} reviews)</span>
              </button>
            )}
            {priceBlock}
          </div>
          
          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          )}
          
          {/* Delivery Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="items-start gap-3">
              <Image src="/truck.png" alt="Delivery Truck" width={64} height={64} className="w-16 h-16 object-contain" />
              <div>
                <div className="font-semibold text-base">Delivering all over India</div>
                <div className="text-sm text-gray-600">All Orders delivered within 1-2 working days.</div>
              </div>
            </div>
          </div>
          
          {/* Color Selection */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs sm:text-sm font-medium text-gray-700">COLOR</div>
                <button className="text-[10px] sm:text-xs text-blue-600 hover:underline">CLEAR</button>
              </div>
              <select 
                value={color} 
                onChange={(e) => setColor(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                {product.colors.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}

          {/* Variant selectors - conditional rendering order */}
          {Array.isArray(product.colour) && product.colour.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-sm font-medium text-gray-700">COLOUR</div>
              <select value={colour} onChange={(e)=>setColour(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                {product.colour.map((v, i)=>(<option key={i} value={v}>{v}</option>))}
              </select>
            </div>
          )}
          {Array.isArray(product.amps) && product.amps.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-sm font-medium text-gray-700">AMPS</div>
              <select value={amp} onChange={(e)=>setAmp(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                {product.amps.map((v, i)=>(<option key={i} value={v}>{v}</option>))}
              </select>
            </div>
          )}
          {Array.isArray(product.weights) && product.weights.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-sm font-medium text-gray-700">WEIGHT</div>
              <select value={weight} onChange={(e)=>setWeight(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                {product.weights.map((v, i)=>{
                  const label = v?.weight ?? String(v);
                  return (<option key={i} value={label}>{label}</option>);
                })}
              </select>
              {/* Selected weight pricing */}
              {(() => {
                const row = Array.isArray(product.weights) ? product.weights.find(w => (w?.weight ?? String(w)) === weight) : null;
                if (!row) return null;
                const orig = row.price != null ? Number(row.price) : null;
                const curr = row.discountPrice != null ? Number(row.discountPrice) : (orig != null ? orig : null);
                return (
                  <div className="text-xs sm:text-sm mt-1">
                    {orig != null && curr != null && curr < orig && (
                      <span className="text-gray-500 line-through mr-2">₹{orig.toLocaleString('en-IN')}</span>
                    )}
                    {curr != null && (
                      <span className="font-semibold">₹{curr.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          {Array.isArray(product.variants) && product.variants.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-xs sm:text-sm font-medium text-gray-700">VARIANT</div>
              <select value={variant} onChange={(e)=>setVariant(e.target.value)} className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                {product.variants.map((v, i)=>(<option key={i} value={v.variantName || v.name}>{v.variantName || v.name}</option>))}
              </select>
              {/* Selected variant pricing */}
              {(() => {
                const v = Array.isArray(product.variants) ? product.variants.find(x => (x.variantName || x.name) === variant) : null;
                if (!v) return null;
                const orig = v.fixPrice != null ? Number(v.fixPrice) : null;
                const curr = v.discountPrice != null ? Number(v.discountPrice) : (orig != null ? orig : null);
                return (
                  <div className="text-xs sm:text-sm mt-1">
                    {orig != null && curr != null && curr < orig && (
                      <span className="text-gray-500 line-through mr-2">₹{orig.toLocaleString('en-IN')}</span>
                    )}
                    {curr != null && (
                      <span className="font-semibold">₹{curr.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
          {Array.isArray(product.typeOptions) && product.typeOptions.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-xs sm:text-sm font-medium text-gray-700">TYPE</div>
              <select value={typeOption} onChange={(e)=>setTypeOption(e.target.value)} className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                {product.typeOptions.map((t, i)=>{
                  const label = t?.fit || String(t);
                  return <option key={i} value={label}>{label}</option>;
                })}
              </select>
            </div>
          )}
          {Array.isArray(product.brand) && product.brand.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-xs sm:text-sm font-medium text-gray-700">BRAND</div>
              <select value={brandSel} onChange={(e)=>setBrandSel(e.target.value)} className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                {product.brand.map((b, i)=>(<option key={i} value={b}>{b}</option>))}
              </select>
            </div>
          )}
          {Array.isArray(product.way) && product.way.length > 0 && (
            <div className="space-y-2 mt-3">
              <div className="text-xs sm:text-sm font-medium text-gray-700">WAY</div>
              <select value={waySel} onChange={(e)=>setWaySel(e.target.value)} className="w-full border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                {product.way.map((w, i)=>(<option key={i} value={w}>{w}</option>))}
              </select>
            </div>
          )}
          
          {/* Quantity and Add to Cart */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center border border-gray-300 rounded self-start">
                <button 
                  className="px-3 sm:px-4 py-2 text-base sm:text-lg font-medium hover:bg-gray-100" 
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input 
                  className="w-12 sm:w-16 text-center outline-none py-2 text-sm sm:text-base" 
                  value={qty} 
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value)||1))} 
                />
                <button 
                  className="px-3 sm:px-4 py-2 text-base sm:text-lg font-medium hover:bg-gray-100" 
                  onClick={() => setQty(q => q + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="bg-black hover:bg-gray-800 text-white font-semibold px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded text-xs sm:text-sm flex-1 sm:flex-none"
                onClick={() => {
                  // Compute price from selected option priority: variant > typeOption(rate) > weight row > product default
                  let selectedPrice = null;
                  let selectedOriginal = null;
                  // Variant price
                  if (Array.isArray(product.variants) && product.variants.length > 0 && variant) {
                    const v = product.variants.find(v => (v.variantName || v.name) === variant);
                    if (v) {
                      selectedOriginal = v.fixPrice ?? null;
                      selectedPrice = v.discountPrice ?? v.fixPrice ?? null;
                    }
                  }
                  // Type option rate
                  if (selectedPrice == null && Array.isArray(product.typeOptions) && product.typeOptions.length > 0 && typeOption) {
                    const t = product.typeOptions.find(t => (t?.fit || String(t)) === typeOption);
                    const rate = t?.rate ?? null;
                    if (rate != null) {
                      selectedOriginal = null;
                      selectedPrice = Number(rate);
                    }
                  }
                  // Weight row price
                  if (selectedPrice == null && Array.isArray(product.weights) && product.weights.length > 0 && weight) {
                    const row = product.weights.find(w => (w?.weight ?? String(w)) === weight);
                    if (row) {
                      selectedOriginal = row.price != null ? Number(row.price) : null;
                      selectedPrice = row.discountPrice != null ? Number(row.discountPrice) : (selectedOriginal != null ? selectedOriginal : null);
                    }
                  }
                  // Fallback product price
                  if (selectedPrice == null) selectedPrice = product.discountPrice ?? product.price ?? product.minPrice ?? product.maxPrice ?? 0;

                  const optionParts = [];
                  if (color) optionParts.push(`Color: ${color}`);
                  if (colour) optionParts.push(`Colour: ${colour}`);
                  if (weight) optionParts.push(`Weight: ${weight}`);
                  if (amp) optionParts.push(`Amp: ${amp}`);
                  if (variant) optionParts.push(`Variant: ${variant}`);
                  if (typeOption) optionParts.push(`Type: ${typeOption}`);
                  if (brandSel) optionParts.push(`Brand: ${brandSel}`);
                  if (waySel) optionParts.push(`Way: ${waySel}`);

                  const nameWithOptions = optionParts.length ? `${product.name} (${optionParts.join(', ')})` : product.name;

                  addItem({
                    id: product.id,
                    name: nameWithOptions,
                    price: selectedPrice,
                    image: product.image,
                    thumbnail: product.image,
                    color,
                    colour,
                    weight,
                    amp,
                    variant,
                    typeOption,
                    brand: brandSel,
                    way: waySel
                  }, qty);
                }}
              >
                ADD TO CART
              </button>
            </div>
            
            {/* Bulk Order Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded text-sm">
              ADD TO QUOTE FOR BULK ORDERS OR CUSTOMIZATION
            </button>
          </div>
          
          {/* Product Metadata - conditional fields */}
          <div className="space-y-2 text-sm text-gray-600">
            <div><span className="font-medium">SKU:</span> N/A</div>
            <div><span className="font-medium">Category:</span> {product.type || 'Product'}</div>

            
            {/* Brand */}
            {product.brand && (
              <div><span className="font-medium">Brand:</span> {product.brand}</div>
            )}
            
            
            {/* Tags */}
            {Array.isArray(product.tags) && product.tags.length > 0 && (
              <div>
                <span className="font-medium">Tags:</span> {product.tags.join(', ')}
              </div>
            )}
          </div>
          
          {/* Social Share */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Share:</span>
            <div className="flex gap-2">
              {['Facebook', 'Twitter', 'Email', 'Pinterest', 'Share'].map((social, idx) => (
                <button key={idx} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-xs">
                  {social === 'Facebook' ? 'f' : social === 'Twitter' ? 't' : social === 'Email' ? '@' : social === 'Pinterest' ? 'p' : '↗'}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Right Sidebar - Recently Viewed */}
        <aside className="lg:w-80 hidden lg:block">
          <div className="sticky top-24">
            <h4 className="text-sm font-semibold mb-3">RECENTLY VIEWED PRODUCTS</h4>
            <div className="space-y-4">
              {recent
                .filter(r => String(r.id) !== String(product.id))
                .slice(0, 4)
                .map((r, idx) => (
                <div key={`${r.id}-${idx}`} className="flex gap-3 border-b pb-3">
                  <Link
                    href={`/product/${r.id}`}
                    className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden flex items-center justify-center bg-white"
                    onClick={() => {
                      // Cache minimal product so detail page can render even if backend getOne fails
                      try {
                        if (typeof window !== 'undefined' && r.id) {
                          const hasRange = r.minPrice != null && r.maxPrice != null && Number(r.minPrice) !== Number(r.maxPrice);
                          const raw = {
                            _id: r.id,
                            name: r.name,
                            image: r.image,
                            images: [r.image],
                            category: r.type,
                            price: hasRange ? null : r.price,
                            fixPrice: hasRange ? null : r.price,
                            discountPrice: hasRange ? null : (r.discountPrice ?? r.price),
                            minPrice: hasRange ? r.minPrice : null,
                            maxPrice: hasRange ? r.maxPrice : null,
                            discount: r.discount,
                          };
                          window.sessionStorage.setItem('selectedProduct', JSON.stringify(raw));
                        }
                      } catch {}
                    }}
                  >
                    <Image src={r.image} alt={r.name} width={64} height={64} className="object-contain w-full h-full" />
                  </Link>
                  <div className="text-sm">
                    <Link
                      href={`/product/${r.id}`}
                      className="line-clamp-2 hover:underline"
                      onClick={() => {
                        try {
                          if (typeof window !== 'undefined' && r.id) {
                            const hasRange = r.minPrice != null && r.maxPrice != null && Number(r.minPrice) !== Number(r.maxPrice);
                            const raw = {
                              _id: r.id,
                              name: r.name,
                              image: r.image,
                              images: [r.image],
                              category: r.type,
                              price: hasRange ? null : r.price,
                              fixPrice: hasRange ? null : r.price,
                              discountPrice: hasRange ? null : (r.discountPrice ?? r.price),
                              minPrice: hasRange ? r.minPrice : null,
                              maxPrice: hasRange ? r.maxPrice : null,
                              discount: r.discount,
                            };
                            window.sessionStorage.setItem('selectedProduct', JSON.stringify(raw));
                          }
                        } catch {}
                      }}
                    >
                      {r.name}
                    </Link>
                    <div className="text-xs text-gray-500">{r.type}</div>
                    <div>
                      {r.minPrice != null && r.maxPrice != null && Number(r.minPrice) !== Number(r.maxPrice) ? (
                        <span className="font-semibold text-xs">
                          ₹{Number(r.minPrice).toLocaleString('en-IN')} – ₹{Number(r.maxPrice).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        (() => {
                          const hasOriginal = r.price != null && r.price !== '';
                          const hasSale = r.discountPrice != null && r.discountPrice !== '';
                          const original = hasOriginal ? Number(r.price) : null;
                          const sale = hasSale ? Number(r.discountPrice) : null;
                          const effective = sale != null ? sale : original;

                          if (!effective) return null; // hide price instead of showing 0 or text

                          return (
                            <>
                              {original != null && sale != null && sale < original && (
                                <span className="text-gray-400 line-through text-xs mr-1">
                                  ₹{original.toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="font-semibold text-xs">
                                ₹{(sale != null ? sale : original).toLocaleString('en-IN')}
                              </span>
                            </>
                          );
                        })()
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <div className="text-xs text-gray-500">No products yet.</div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Tabs + Content */}
      <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto">
          <button onClick={()=>setActiveTab('info')} className={`${activeTab==='info' ? 'border-b-2 border-black' : 'text-gray-400'} pb-2 whitespace-nowrap`}>ADDITIONAL INFORMATION</button>
          <button onClick={()=>setActiveTab('reviews')} className={`${activeTab==='reviews' ? 'border-b-2 border-black' : 'text-gray-400'} pb-2 whitespace-nowrap`}>REVIEWS ({reviews.length})</button>
        </div>
        {activeTab==='info' && (
          <div className="mt-4">
            {/* Key facts table (auto from available fields) */}
            {(() => {
              const rows = [];
              const add = (label, value) => {
                if (value == null) return;
                if (Array.isArray(value) && value.length === 0) return;
                const text = Array.isArray(value) ? value.join(', ') : String(value);
                if (!text || text === 'undefined') return;
                rows.push([label, text]);
              };
              add('COLORS', Array.isArray(product.colors) ? product.colors : undefined);
              add('COLOUR', Array.isArray(product.colour) ? product.colour : undefined);
              add('BRAND', product.brand);
              add('DIMENSIONS', product.dimensions);
              // Price range if applicable
              
              add('TAGS', Array.isArray(product.tags) ? product.tags : undefined);

              return rows.length > 0 ? (
                <div className="divide-y border rounded mt-3 sm:mt-4">
                  {rows.map(([k,v], i) => (
                    <div key={i} className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 p-2 sm:p-3 text-xs sm:text-sm">
                      <span className="font-medium text-gray-700">{k}</span>
                      <span className="text-gray-800 text-left sm:text-right flex-1 break-words">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (Array.isArray(sameCategoryFive) && sameCategoryFive.length > 0 ? null : (
                <div className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">No additional information.</div>
              ));
            })()}

            {/* Same-category preview (first 5) inside Additional Information */}
            {/* {Array.isArray(sameCategoryFive) && sameCategoryFive.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-3">RELATED PRODUCTS</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {sameCategoryFive.map(r => (
                    <div key={r.id} className="group bg-white rounded border p-3 flex flex-col hover:shadow-md transition">
                      {r.discount > 0 && (
                        <span className="absolute ml-2 mt-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full">-{r.discount}%</span>
                      )}
                      <Link href={`/product/${r.id}`} className="h-28 flex items-center justify-center overflow-hidden mb-2">
                        <Image src={r.image} alt={r.name} width={200} height={200} className="object-contain h-full w-full transform transition-transform duration-300 group-hover:scale-105" />
                      </Link>
                      <div className="text-[11px] text-gray-500">{r.type}</div>
                      <Link href={`/product/${r.id}`} className="text-xs font-medium line-clamp-2 mb-1">{r.name}</Link>
                      <div className="mt-auto">
                        {r.price != null && r.discount > 0 && (
                          <span className="text-gray-400 line-through text-[11px] mr-2">₹{Number(r.price).toLocaleString('en-IN')}</span>
                        )}
                        <span className="font-semibold text-sm">₹{Number((r.discountPrice ?? r.price) || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="pt-2">
                        <Link href={`/product/${r.id}`} className="block text-center text-[11px] bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-2 rounded">SELECT OPTIONS</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        )}
      </div>

      {activeTab==='reviews' && (
      <div className="mt-4 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <h4 className="text-sm sm:text-base font-semibold mb-3">{reviews.length} reviews for {product.name}</h4>
          <div className="space-y-3 sm:space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border-b pb-3 sm:pb-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                      {r.userAvatar ? (
                        <Image src={r.userAvatar} alt={r.userName || 'User'} width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200" />
                      )}
                      <div className="font-medium">{r.userName || 'User'}</div>
                  <div className="text-yellow-300 text-[10px] sm:text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div className="text-[10px] sm:text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                {r.comment && <div className="mt-1 text-xs sm:text-sm text-gray-700">{r.comment}</div>}
              </div>
            ))}
            {reviews.length === 0 && <div className="text-xs sm:text-sm text-gray-500">No reviews yet.</div>}
          </div>
        </div>
        <div>
          <div className="border p-3 sm:p-4 rounded">
            <h5 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Add a review</h5>
            <div className="text-xs sm:text-sm mb-2">Your rating *</div>
            <div className="flex items-center gap-1 mb-2 sm:mb-3">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setMyRating(n)} className={`text-lg sm:text-xl ${myRating >= n ? 'text-yellow-300' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
            <div className="text-xs sm:text-sm mb-1">Your review *</div>
            {(!hasToken && !user) && (
              <div className="text-[10px] sm:text-xs text-red-600 mb-2">Please login to write a review.</div>
            )}
            <textarea disabled={!hasToken && !user} value={myText} onChange={(e)=>setMyText(e.target.value)} className="w-full border rounded p-2 h-24 sm:h-28 text-xs sm:text-sm disabled:bg-gray-100" />
            <button
              disabled={!hasToken && !user}
              className="mt-2 sm:mt-3 bg-yellow-300 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded w-full sm:w-auto"
              onClick={async ()=>{
                if (!myRating) return alert('Please select rating');
                try {
                  const base = API_BASE_URL.replace(/\/$/, '');
                  const apiRoot = base.endsWith('/api') ? base : `${base}/api`;
                  const token = getJwtFromLocalStorage();
                  const displayName = user?.username || user?.shopName || user?.name || (user?.email ? user.email.split('@')[0] : '') || user?.mobile || 'User';
                  const res = await fetch(`${apiRoot}/reviews`,{method:'POST',headers:{'Content-Type':'application/json', ...(token? {'Authorization': `Bearer ${token}`} : {})},body:JSON.stringify({productId:id,rating:myRating,comment:myText,userName:displayName, userAvatar:user?.avatar})});
                  const json = await res.json();
                  if (json.success){ setReviews([json.data,...reviews]); setMyRating(0); setMyText(''); setActiveTab('reviews'); }
                } catch {}
              }}
            >
              SUBMIT
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-6 sm:mt-8 md:mt-10">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">RELATED PRODUCTS</h3>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {related.map((r, idx) => (
              <div key={`${r.id}-${idx}`} className="group bg-white rounded border p-2 sm:p-3 flex md:flex-col hover:shadow-md transition relative">
                {r.discount > 0 && (
                  <span className="absolute ml-1 sm:ml-2 mt-1 sm:mt-2 bg-black text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full z-10">-{r.discount}%</span>
                )}
                <Link href={`/product/${r.id}`} className="w-28 sm:w-32 md:w-full flex-shrink-0 md:flex-shrink h-24 sm:h-32 md:h-36 flex items-center justify-center overflow-hidden mb-0 md:mb-2 sm:mb-3">
                  <Image src={r.image} alt={r.name} width={200} height={200} className="object-contain h-full w-full transform transition-transform duration-300 group-hover:scale-105" />
                </Link>
                <div className="flex-1 p-2 sm:p-3 flex flex-col">
                  <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-500 uppercase mb-0.5 sm:mb-1">{r.type}</div>
                  <Link href={`/product/${r.id}`} className="text-xs sm:text-sm font-medium line-clamp-2 mb-1">{r.name}</Link>
                  <div className="mt-auto">
                    {r.minPrice != null && r.maxPrice != null && Number(r.minPrice) > 0 && Number(r.maxPrice) > 0 && Number(r.minPrice) !== Number(r.maxPrice) ? (
                      <span className="font-semibold text-xs sm:text-sm">₹{Number(r.minPrice).toLocaleString('en-IN')} – ₹{Number(r.maxPrice).toLocaleString('en-IN')}</span>
                    ) : (
                      <>
                        {r.price != null && r.discount > 0 && (
                          <span className="text-gray-400 line-through text-[10px] sm:text-xs mr-1 sm:mr-2">₹{Number(r.price).toLocaleString('en-IN')}</span>
                        )}
                        <span className="font-semibold text-xs sm:text-sm">₹{Number((r.discountPrice ?? r.price) || 0).toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </div>
                  <div className="pt-1.5 sm:pt-2">
                    <Link href={`/product/${r.id}`} className="block text-center text-[10px] sm:text-xs bg-yellow-300 hover:bg-yellow-300 text-white font-semibold py-1.5 sm:py-2 rounded">SELECT OPTIONS</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


