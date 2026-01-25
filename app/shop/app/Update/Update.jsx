"use client";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";

const staticColumns = [];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-red-500 fill-red-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function Update() {
  const router = useRouter();
  const [latestProducts, setLatestProducts] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        // Known existing endpoints in this project
        const urls = [
          `${API_BASE_URL}/home/electrical/get?firstPerCategory=true`,
          `${API_BASE_URL}/home/paints/get`,
          `${API_BASE_URL}/home/producttools/get`,
        ];

        const results = await Promise.allSettled(
          urls.map((u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null))
        );

        const flatten = (payload) => {
          if (!payload) return [];
          if (payload.success && Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload.products)) return payload.products;
          if (Array.isArray(payload.items)) return payload.items;
          return [];
        };

        let combined = [];
        for (const r of results) {
          if (r.status === 'fulfilled') {
            combined = combined.concat(flatten(r.value));
          }
        }

        // Sort by createdAt/updatedAt/_id timestamp if present
        const toTs = (p) => {
          if (p?.updatedAt) return new Date(p.updatedAt).getTime();
          if (p?.createdAt) return new Date(p.createdAt).getTime();
          if (typeof p?._id === 'string' && p._id.length >= 8) {
            // Extract timestamp from Mongo ObjectId (first 4 bytes)
            const seconds = parseInt(p._id.substring(0, 8), 16);
            return seconds * 1000;
          }
          return 0;
        };

        combined.sort((a, b) => toTs(b) - toTs(a));
        const top4 = combined.slice(0, 4);

        // Map products to the expected format
        const toAbs = (u) => {
          if (!u || typeof u !== 'string') return '/placeholder.jpg';
          if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
          // Backend stores images as /uploads/products/...
          // Static files are served from root, not /api
          // Remove /api suffix if present to get the root URL for static files
          const base = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
          const path = u.startsWith('/') ? u : `/${u}`;
          return `${base}${path}`;
        };

        const mappedProducts = top4.map((product, index) => {
          const rawMin = product?.minPrice;
          const rawMax = product?.maxPrice;
          const hasBoth = rawMin != null && rawMax != null;
          const min = hasBoth ? Math.min(Number(rawMin), Number(rawMax)) : undefined;
          const max = hasBoth ? Math.max(Number(rawMin), Number(rawMax)) : undefined;

          // Prefer explicit fixed price, then generic price, then fallback to lone min/max if only one exists
          const singleCandidate =
            product?.fixPrice ??
            product?.price ??
            (rawMin != null && rawMax == null ? Number(rawMin) : undefined) ??
            (rawMax != null && rawMin == null ? Number(rawMax) : undefined);

          const priceStr = hasBoth
            ? `₹${Number(min).toLocaleString()} – ₹${Number(max).toLocaleString()}`
            : (singleCandidate != null
                ? `₹${Number(singleCandidate).toLocaleString()}`
                : 'Price not available');

          const original = !hasBoth && product?.discount && product?.fixPrice
            ? `₹${Number(product.fixPrice + (product.fixPrice * product.discount / 100)).toLocaleString()}`
            : '';

          // Numeric price details for product page
          const basePrice = hasBoth ? null : (product?.fixPrice ?? product?.price ?? product?.mrp ?? null);
          const discountVal = product?.discount ?? null;
          const discountPriceNum = hasBoth
            ? null
            : (product?.discountPrice ?? (
                discountVal != null && basePrice != null
                  ? Number(basePrice) - (Number(basePrice) * Number(discountVal) / 100)
                  : null
              ));

          return {
            image: toAbs(product.image || product.images?.[0] || product.photos?.[0]),
            name: product.name || product.title || `Product ${index + 1}`,
            price: priceStr,
            originalPrice: original,
            rating: product.rating || 0,
            id: product._id || product.id,
            category: product.category || product.Category || product?.type,
            basePrice: basePrice != null ? Number(basePrice) : null,
            discountPriceNum: discountPriceNum != null ? Number(discountPriceNum) : null,
            minPrice: hasBoth ? Number(min) : null,
            maxPrice: hasBoth ? Number(max) : null,
            discountValue: Number(discountVal) || 0,
          };
        });

        setLatestProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching latest products:', error);
        setLatestProducts([]);
      }
    };

    const fetchBestSellingProducts = async () => {
      try {
        // Fetch all products from multiple sources
        const productUrls = [
          `${API_BASE_URL}/home/electrical/get`,
          `${API_BASE_URL}/home/paints/get`,
          `${API_BASE_URL}/home/producttools/get`,
        ];

        const productResults = await Promise.allSettled(
          productUrls.map((u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null))
        );

        const flatten = (payload) => {
          if (!payload) return [];
          if (payload.success && Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload.products)) return payload.products;
          if (Array.isArray(payload.items)) return payload.items;
          return [];
        };

        let allProducts = [];
        for (const r of productResults) {
          if (r.status === 'fulfilled') {
            allProducts = allProducts.concat(flatten(r.value));
          }
        }

        // Fetch orders to calculate sales
        const ordersResponse = await fetch(`${API_BASE_URL}/orders`);
        let orders = [];
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          orders = ordersData.success && Array.isArray(ordersData.data) ? ordersData.data : [];
        }

        // Calculate sales count for each product
        const salesCount = {};
        orders.forEach(order => {
          if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
              const productId = item.productId || item.name;
              if (productId) {
                salesCount[productId] = (salesCount[productId] || 0) + (item.quantity || 1);
              }
            });
          }
        });

        // Sort products by sales count (fallback to rating if no sales data)
        const sortedProducts = allProducts.sort((a, b) => {
          const aSales = salesCount[a.name] || salesCount[a._id] || 0;
          const bSales = salesCount[b.name] || salesCount[b._id] || 0;
          
          if (aSales !== bSales) {
            return bSales - aSales; // Higher sales first
          }
          
          // Fallback to rating if sales are equal
          return (b.rating || 0) - (a.rating || 0);
        });

        const top5 = sortedProducts.slice(0, 5);

        // Map products to the expected format
        const toAbs = (u) => {
          if (!u || typeof u !== 'string') return '/placeholder.jpg';
          if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
          // Backend stores images as /uploads/products/...
          // Static files are served from root, not /api
          const base = API_BASE_URL.replace('/api', '').replace(/\/$/, '');
          const path = u.startsWith('/') ? u : `/${u}`;
          return `${base}${path}`;
        };

        const mappedProducts = top5.map((product, index) => {
          const rawMin = product?.minPrice;
          const rawMax = product?.maxPrice;
          const hasBoth = rawMin != null && rawMax != null;
          const min = hasBoth ? Math.min(Number(rawMin), Number(rawMax)) : undefined;
          const max = hasBoth ? Math.max(Number(rawMin), Number(rawMax)) : undefined;

          const singleCandidate =
            product?.fixPrice ??
            product?.price ??
            (rawMin != null && rawMax == null ? Number(rawMin) : undefined) ??
            (rawMax != null && rawMin == null ? Number(rawMax) : undefined);

          const priceStr = hasBoth
            ? `₹${Number(min).toLocaleString()} – ₹${Number(max).toLocaleString()}`
            : (singleCandidate != null
                ? `₹${Number(singleCandidate).toLocaleString()}`
                : 'Price not available');

          const original = !hasBoth && product?.discount && product?.fixPrice
            ? `₹${Number(product.fixPrice + (product.fixPrice * product.discount / 100)).toLocaleString()}`
            : '';

          const basePrice = hasBoth ? null : (product?.fixPrice ?? product?.price ?? product?.mrp ?? null);
          const discountVal = product?.discount ?? null;
          const discountPriceNum = hasBoth
            ? null
            : (product?.discountPrice ?? (
                discountVal != null && basePrice != null
                  ? Number(basePrice) - (Number(basePrice) * Number(discountVal) / 100)
                  : null
              ));

          return {
            image: toAbs(product.image || product.images?.[0] || product.photos?.[0]),
            name: product.name || product.title || `Product ${index + 1}`,
            price: priceStr,
            originalPrice: original,
            rating: product.rating || 0,
            id: product._id || product.id,
            category: product.category || product.Category || product?.type,
            basePrice: basePrice != null ? Number(basePrice) : null,
            discountPriceNum: discountPriceNum != null ? Number(discountPriceNum) : null,
            minPrice: hasBoth ? Number(min) : null,
            maxPrice: hasBoth ? Number(max) : null,
            discountValue: Number(discountVal) || 0,
          };
        });

        setBestSellingProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching best selling products:', error);
        setBestSellingProducts([]);
      }
    };

    const fetchTopRatedProducts = async () => {
      try {
        // Fetch all products from multiple sources
        const productUrls = [
          `${API_BASE_URL}/home/electrical/get`,
          `${API_BASE_URL}/home/paints/get`,
          `${API_BASE_URL}/home/producttools/get`,
        ];

        const productResults = await Promise.allSettled(
          productUrls.map((u) => fetch(u).then((r) => (r.ok ? r.json() : null)).catch(() => null))
        );

        const flatten = (payload) => {
          if (!payload) return [];
          if (payload.success && Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload.products)) return payload.products;
          if (Array.isArray(payload.items)) return payload.items;
          return [];
        };

        let allProducts = [];
        for (const r of productResults) {
          if (r.status === 'fulfilled') {
            const products = flatten(r.value);
            allProducts = allProducts.concat(products);
            console.log('Fetched products for top rated:', products.length);
          }
        }
        
        console.log('Total products for top rated:', allProducts.length);

        // Sort products by rating (highest first), but include all products
        const sortedProducts = allProducts
          .sort((a, b) => {
            const aRating = a.rating || 0;
            const bRating = b.rating || 0;
            
            // If both have ratings, sort by rating
            if (aRating > 0 && bRating > 0) {
              return bRating - aRating;
            }
            
            // If only one has rating, prioritize it
            if (aRating > 0 && bRating === 0) return -1;
            if (bRating > 0 && aRating === 0) return 1;
            
            // If neither has rating, sort by creation date (newest first)
            const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
            const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();
            return bTime - aTime;
          });

        const top4 = sortedProducts.slice(0, 4);
        
        console.log('Top 4 products for top rated:', top4.length);
        console.log('Products data:', top4.map(p => ({ name: p.name, rating: p.rating })));

        // Map products to the expected format
        const toAbs = (u) => {
          if (!u || typeof u !== 'string') return '/placeholder.jpg';
          if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
          // Backend stores images as /uploads/products/...
          // Static files are served from root, not /api
          const base = API_BASE_URL.replace('/api', '').replace(/\/$/, '');
          const path = u.startsWith('/') ? u : `/${u}`;
          return `${base}${path}`;
        };

        const mappedProducts = top4.map((product, index) => {
          const rawMin = product?.minPrice;
          const rawMax = product?.maxPrice;
          const hasBoth = rawMin != null && rawMax != null;
          const min = hasBoth ? Math.min(Number(rawMin), Number(rawMax)) : undefined;
          const max = hasBoth ? Math.max(Number(rawMin), Number(rawMax)) : undefined;

          const singleCandidate =
            product?.fixPrice ??
            product?.price ??
            (rawMin != null && rawMax == null ? Number(rawMin) : undefined) ??
            (rawMax != null && rawMin == null ? Number(rawMax) : undefined);

          const priceStr = hasBoth
            ? `₹${Number(min).toLocaleString()} – ₹${Number(max).toLocaleString()}`
            : (singleCandidate != null
                ? `₹${Number(singleCandidate).toLocaleString()}`
                : 'Price not available');

          const original = !hasBoth && product?.discount && product?.fixPrice
            ? `₹${Number(product.fixPrice + (product.fixPrice * product.discount / 100)).toLocaleString()}`
            : '';

          const basePrice = hasBoth ? null : (product?.fixPrice ?? product?.price ?? product?.mrp ?? null);
          const discountVal = product?.discount ?? null;
          const discountPriceNum = hasBoth
            ? null
            : (product?.discountPrice ?? (
                discountVal != null && basePrice != null
                  ? Number(basePrice) - (Number(basePrice) * Number(discountVal) / 100)
                  : null
              ));

          return {
            image: toAbs(product.image || product.images?.[0] || product.photos?.[0]),
            name: product.name || product.title || `Product ${index + 1}`,
            price: priceStr,
            originalPrice: original,
            rating: product.rating || 0,
            showRating: true, // Always show rating for top rated section
            id: product._id || product.id,
            category: product.category || product.Category || product?.type,
            basePrice: basePrice != null ? Number(basePrice) : null,
            discountPriceNum: discountPriceNum != null ? Number(discountPriceNum) : null,
            minPrice: hasBoth ? Number(min) : null,
            maxPrice: hasBoth ? Number(max) : null,
            discountValue: Number(discountVal) || 0,
          };
        });

        setTopRatedProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching top rated products:', error);
        setTopRatedProducts([]);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchLatestProducts(),
          fetchBestSellingProducts(),
          fetchTopRatedProducts()
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "LATEST",
      products: latestProducts,
    },
    {
      title: "BEST SELLING",
      products: bestSellingProducts,
    },
    {
      title: "TOP RATED",
      products: topRatedProducts,
    },
    ...staticColumns
  ];

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-10 px-2">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {columns.map((col, idx) => (
          <div key={col.title}>
            <h3 className="text-md font-bold tracking-widest mb-2 flex items-center gap-2">
              <span>{col.title}</span>
              <span className="flex-1 border-t border-gray-200"></span>
            </h3>
            <div className="space-y-4 pt-4">
              {col.products.length === 0 ? (
                <div className="text-gray-500 text-sm">No products available</div>
              ) : (
                col.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => {
                      if (!product.id) return;

                      // Cache product details so ProductDetailPage can render without category-specific getOne API
                      try {
                        if (typeof window !== 'undefined') {
                          const hasRange = product.minPrice != null && product.maxPrice != null;
                          const raw = {
                            _id: product.id,
                            name: product.name,
                            image: product.image,
                            images: [product.image],
                            category: product.category,
                            // For range products, use min/max; for single price use base/discount
                            price: hasRange ? null : product.basePrice,
                            fixPrice: hasRange ? null : product.basePrice,
                            discountPrice: hasRange ? null : (product.discountPriceNum ?? product.basePrice),
                            minPrice: hasRange ? product.minPrice : null,
                            maxPrice: hasRange ? product.maxPrice : null,
                            discount: product.discountValue,
                          };
                          window.sessionStorage.setItem('selectedProduct', JSON.stringify(raw));
                        }
                      } catch {}

                      const cat = product.category;
                      const query = cat ? `?cat=${encodeURIComponent(String(cat))}` : "";
                      router.push(`/product/${product.id}${query}`);
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-contain rounded"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm leading-tight">{product.name}</div>
                      {(product.rating > 0 || product.showRating) && (
                        <StarRating rating={product.rating} />
                      )}
                      <div className="mt-1 text-sm">
                        {product.originalPrice && (
                          <span className="line-through text-gray-400 mr-1">{product.originalPrice}</span>
                        )}
                        <span className="font-bold">{product.price}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
