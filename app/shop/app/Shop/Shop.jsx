"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShopLayout from "@/components/ShopLayout";
import Update from "../Update/Update";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

// Product Card Component
function ProductCard({ product, router, toAbs }) {
  const [imgSrc, setImgSrc] = useState(toAbs(product.image));
  const categoryPath = `/ShopPage/${product.name.replace(/\s+/g, '')}`;

  return (
    <div
      onClick={() => router.push(categoryPath)}
      className="group bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 rounded-lg overflow-hidden"
    >
      {/* Image Section */}
      <div className="w-full h-48 bg-white flex items-center justify-center p-6 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.name}
          width={200}
          height={200}
          unoptimized={true}
          onError={() => setImgSrc('/placeholder-product.png')}
          className="object-contain max-h-full max-w-full group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      {/* Label Section */}
      <div className="bg-gray-50 p-4 border-t border-gray-100">
        <h3 className="text-center font-bold text-gray-800 uppercase text-[13px] tracking-wide group-hover:text-yellow-500 transition-colors">
          {product.name}
        </h3>
      </div>
    </div>
  );
}

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // Helper to convert relative URLs to absolute
  const toAbs = (u) => {
    if (!u || typeof u !== 'string') return '/placeholder-product.png';
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
    const base = API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const path = u.startsWith('/') ? u : `/${u}`;
    return `${base}${path}`;
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/simple-products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        if (data.success) setProducts(data.data);
        else throw new Error(data.message || 'Failed to fetch products');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ShopLayout>
      <div className="w-full p-6 md:p-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg mb-2">Error loading products</div>
            <div className="text-gray-600">{error}</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, visibleCount).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  router={router}
                  toAbs={toAbs}
                />
              ))}
            </div>
            {visibleCount < products.length && (
              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  className="px-8 py-2.5 rounded-full border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all duration-300 uppercase tracking-widest"
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                >
                  Load more products
                </button>
              </div>
            )}
          </>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-gray-300 text-7xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase">No products found</h3>
            <p className="text-gray-500">Check back later for new products!</p>
          </div>
        )}

        {/* Update component below products */}
        <div className="mt-20">
          <Update />
        </div>
      </div>
    </ShopLayout>
  );
}
