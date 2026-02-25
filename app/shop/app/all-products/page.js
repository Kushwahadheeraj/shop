'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { resolveImageUrl } from '../../components/ProductDetailModal';

export default function AllProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/products/all');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const price = product.price || product.minPrice || product.maxPrice || 0;
    const matchesPrice = (!filterPrice.min || price >= Number(filterPrice.min)) &&
                        (!filterPrice.max || price <= Number(filterPrice.max));
    
    return matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name?.localeCompare(b.name) || 0;
      case 'price-low':
        return (a.price || a.minPrice || 0) - (b.price || b.minPrice || 0);
      case 'price-high':
        return (b.price || b.maxPrice || 0) - (a.price || a.maxPrice || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const paginatedProducts = sortedProducts.slice(0, visibleCount);

  const handleProductClick = (product) => {
    router.push(`/product/${product._id || product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading all products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Products</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAllProducts}
            className="bg-yellow-300 hover:bg-yellow-300 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Browse our complete collection of {products.length} products</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="Min price"
                value={filterPrice.min}
                onChange={(e) => setFilterPrice({...filterPrice, min: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="Max price"
                value={filterPrice.max}
                onChange={(e) => setFilterPrice({...filterPrice, max: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-300 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {paginatedProducts.length} of {filteredProducts.length} products
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h2>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => {
                const img = resolveImageUrl(product);
                const price = product.price || product.minPrice || product.maxPrice || 0;
                const hasMinMaxPricing = product.minPrice && product.maxPrice && product.minPrice !== product.maxPrice;
                const isOutOfStock = product.stock === 0 || product.quantity === 0;

                return (
                  <div
                    key={product._id || product.id || index}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 relative cursor-pointer group"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Out of Stock Badge */}
                    {isOutOfStock && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          OUT OF STOCK
                        </span>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      {img ? (
                        <Image
                          src={img}
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-gray-300 text-6xl mb-2">📦</div>
                            <span className="text-gray-400 text-sm font-medium">No Image</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="mb-2">
                        {hasMinMaxPricing ? (
                          <div className="text-sm">
                            <span className="text-gray-900 font-semibold">
                              ₹{product.minPrice} - ₹{product.maxPrice}
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <span className="text-gray-900 font-semibold">₹{price}</span>
                          </div>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex text-yellow-300">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.rating || 5})</span>
                      </div>

                      {/* Stock Status */}
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-xs text-gray-500">
                          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {paginatedProducts.length < sortedProducts.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors"
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                >
                  Load more products
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
