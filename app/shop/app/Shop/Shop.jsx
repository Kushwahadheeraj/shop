"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PersistentShopSidebar from "@/components/PersistentShopSidebar";
import Update from "../Update/Update";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to convert relative URLs to absolute
  const toAbs = (u) => {
    if (!u || typeof u !== 'string') return '/placeholder-product.png';
    if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
    
    // Remove /api suffix if present to get the root URL for static files
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
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div >
      <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8" >
      {/* Sidebar: hidden on mobile, visible on md+ like UniversalShopPage */}
      <div className="hidden md:block">
        <PersistentShopSidebar />
      </div>
      {/* Main Content */}
      <main className="w-full md:flex-1 lg:mt-36 mt-16">
        {/* Breadcrumb + Filter (centered on mobile) */}
        <div className="bg-white border-b border-gray-200 py-3 mb-4">
          <div className="px-2 sm:px-4">
            <nav className="flex items-center justify-center md:justify-start space-x-2 text-xs md:text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">HOME</Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-semibold">SHOP</span>
            </nav>

          </div>
        </div>
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
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              // Function to determine category path based on product name
              const getCategoryPath = (productName) => {
                const name = productName.toLowerCase();
                
                // Map product names to category paths with first available subpage
                if (name.includes('adhesive') || name.includes('fevicol') || name.includes('glue')) {
                  return '/ShopPage/Adhesives';
                } else if (name.includes('cement') || name.includes('pop') || name.includes('birla')) {
                  return '/ShopPage/Cements';
                } else if (name.includes('cleaning') || name.includes('brush') || name.includes('mop')) {
                  return '/ShopPage/Cleaning';
                } else if (name.includes('electrical') || name.includes('wire') || name.includes('switch') || name.includes('bulb') || name.includes('fan')) {
                  return '/ShopPage/Electrical/Adaptors'; // First subpage in Electrical
                } else if (name.includes('paint') || name.includes('emulsion') || name.includes('primer')) {
                  return '/ShopPage/Paint/AcrylicEmulsionPaint'; // First subpage in Paint
                } else if (name.includes('tool') || name.includes('hammer') || name.includes('screwdriver') || name.includes('wrench')) {
                  return '/ShopPage/Tools/abrasives'; // First subpage in Tools
                } else if (name.includes('sanitary') || name.includes('faucet') || name.includes('bathroom')) {
                  return '/ShopPage/Sanitary/AcrylicProducts'; // First subpage in Sanitary
                } else if (name.includes('lock') || name.includes('key') || name.includes('door')) {
                  return '/ShopPage/Locks/DoorAccessories'; // First subpage in Locks
                } else if (name.includes('pipe') || name.includes('fitting') || name.includes('plumbing')) {
                  return '/ShopPage/Pipe/AshirvadPipes'; // First subpage in Pipe
                } else if (name.includes('roof') || name.includes('sheet') || name.includes('aluminium')) {
                  return '/ShopPage/Roofer/AluminiumSheet'; // First subpage in Roofer
                } else if (name.includes('waterproof') || name.includes('water proof')) {
                  return '/ShopPage/WaterProofing/Bathrooms'; // First subpage in WaterProofing
                } else if (name.includes('hardware') || name.includes('screw') || name.includes('bolt') || name.includes('nut')) {
                  return '/ShopPage/Hardware';
                } else if (name.includes('fiber') || name.includes('fiberglass')) {
                  return '/ShopPage/Fiber';
                } else if (name.includes('fitting') || name.includes('joint')) {
                  return '/ShopPage/Fitting';
                } else if (name.includes('home') || name.includes('decor') || name.includes('decoration')) {
                  return '/ShopPage/HomeDecor';
                } else if (name.includes('pvc') || name.includes('mat')) {
                  return '/ShopPage/PvcMats';
                } else {
                  // Default to Uncategorized
                  return '/ShopPage/Uncategorized';
                }
              };

              const categoryPath = getCategoryPath(product.name);

              return (
                <div
                  key={product._id}
                  onClick={() => router.push(categoryPath)}
                  className="group bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="w-full h-48 bg-white flex items-center justify-center p-6">
                    <Image
                      src={toAbs(product.image)}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Label Section */}
                  <div className="bg-white p-4">

                    <h3 className="text-center font-bold text-black uppercase text-sm tracking-wide">
                      {product.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* No Products State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        )}
      </main>


</div>
      {/* Update component - Show below sidebar when there are products */}
      {products.length > 0 && <Update />}
    </div>
  );
}
