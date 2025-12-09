"use client";
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import API_BASE_URL from "@/lib/apiConfig";

const categories = [
  { name: 'Adhesives', key: 'adhesives', color: 'bg-blue-100 text-blue-800' },
  { name: 'Brush', key: 'brush', color: 'bg-green-100 text-green-800' },
  { name: 'Cements', key: 'cements', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Cleaning', key: 'cleaning', color: 'bg-purple-100 text-purple-800' },
  { name: 'Dry', key: 'dry', color: 'bg-orange-100 text-orange-800' },
  { name: 'Electrical', key: 'electrical', color: 'bg-red-100 text-red-800' },
  { name: 'Fiber', key: 'fiber', color: 'bg-indigo-100 text-indigo-800' },
  { name: 'Fitting', key: 'fitting', color: 'bg-pink-100 text-pink-800' },
  { name: 'Hardware', key: 'hardware', color: 'bg-gray-100 text-gray-800' },
  { name: 'Home', key: 'home', color: 'bg-teal-100 text-teal-800' },
  { name: 'Home Decor', key: 'homedecor', color: 'bg-cyan-100 text-cyan-800' },
  { name: 'Locks', key: 'locks', color: 'bg-amber-100 text-amber-800' },
  { name: 'Paint', key: 'paint', color: 'bg-lime-100 text-lime-800' },
  { name: 'Pipe', key: 'pipe', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'PVC Mats', key: 'pvcmats', color: 'bg-violet-100 text-violet-800' },
  { name: 'Roofer', key: 'roofer', color: 'bg-rose-100 text-rose-800' },
  { name: 'Sanitary', key: 'sanitary', color: 'bg-sky-100 text-sky-800' },
  { name: 'Tools', key: 'tools', color: 'bg-stone-100 text-stone-800' },
  { name: 'Uncategorized', key: 'uncategorized', color: 'bg-slate-100 text-slate-800' },
  { name: 'Water Proofing', key: 'waterproofing', color: 'bg-zinc-100 text-zinc-800' },
];

export default function CategoryListPage() {
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  const fetchCategoryCounts = async () => {
    try {
      setLoading(true);
      
      // Try new API endpoint first
      try {
        const res = await fetch(`${API_BASE_URL}/category-count`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.data) {
            setCategoryCounts(data.data);
            return;
          }
        }
      } catch (apiError) {
        console.log('New API not available, trying fallback...');
      }
      
      // Fallback: try old API endpoints
      const counts = {};
      await Promise.all(
        categories.map(async (category) => {
          try {
            const res = await fetch(`${API_BASE_URL}/${category.key}`);
            if (res.ok) {
              const data = await res.json();
              counts[category.key] = Array.isArray(data) ? data.length : 0;
            } else {
              counts[category.key] = 0;
            }
          } catch {
            counts[category.key] = 0;
          }
        })
      );
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error fetching category counts:', error);
      // Set default counts if everything fails
      const defaultCounts = {};
      categories.forEach(category => {
        defaultCounts[category.key] = 0;
      });
      setCategoryCounts(defaultCounts);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryKey) => {
    try {
      setSubcategoriesLoading(true);
      
      // Try new API endpoint first
      try {
        const res = await fetch(`${API_BASE_URL}/category-count/${categoryKey}/subcategories`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && data.data) {
            setSubcategories(data.data);
            return;
          }
        }
      } catch (apiError) {
        console.log('New subcategory API not available, trying fallback...');
      }
      
      // Fallback: try old API endpoint
      const fallbackRes = await fetch(`${API_BASE_URL}/${categoryKey}`);
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (Array.isArray(data)) {
          // Group products by subcategory
          const subcategoryMap = {};
          data.forEach(product => {
            const subcategory = product.subcategory || product.category || 'General';
            if (!subcategoryMap[subcategory]) {
              subcategoryMap[subcategory] = {
                name: subcategory,
                count: 0
              };
            }
            subcategoryMap[subcategory].count++;
          });
          setSubcategories(Object.values(subcategoryMap));
        } else {
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  const fetchCategoryProducts = async (categoryKey, subcategoryName = null) => {
    try {
      setProductsLoading(true);
      console.log(`Fetching products for category: ${categoryKey}, subcategory: ${subcategoryName}`);
      
      // Try to fetch from database first
      const res = await fetch(`${API_BASE_URL}/${categoryKey}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`API Response for ${categoryKey}:`, data);
        console.log(`Total products in API response: ${Array.isArray(data) ? data.length : 0}`);
        
        if (Array.isArray(data)) {
          let filteredProducts = data;
          if (subcategoryName) {
            console.log(`Filtering by subcategory: ${subcategoryName}`);
            console.log(`All products before filtering:`, data.map(p => ({ name: p.name, category: p.category, subcategory: p.subcategory })));
            filteredProducts = data.filter(product => {
              // For AdhesivesModels, we need to check category field, not subcategory
              const productSubcategory = (product.subcategory || product.category || 'General').trim().toLowerCase();
              const targetSubcategory = subcategoryName.trim().toLowerCase();
              const matches = productSubcategory === targetSubcategory;
              console.log(`Product: ${product.name}, Category: "${product.category}", Subcategory: "${product.subcategory}", Looking for: "${targetSubcategory}", Matches: ${matches}`);
              return matches;
            });
            console.log(`Products after subcategory filter: ${filteredProducts.length}`);
          }
          console.log(`Final filtered products count:`, filteredProducts.length);
          setCategoryProducts(filteredProducts);
        } else {
          console.log('Data is not an array:', data);
          setCategoryProducts([]);
        }
      } else {
        console.log(`API Error for ${categoryKey}:`, res.status);
        setCategoryProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setCategoryProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    fetchSubcategories(category.key);
    fetchCategoryProducts(category.key); // Fetch all products for this category
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log('Subcategory clicked:', subcategory);
    console.log('Selected category:', selectedCategory);
    setSelectedSubcategory(subcategory);
    fetchCategoryProducts(selectedCategory.key, subcategory.name);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubcategories = selectedCategory ? subcategories.filter(subcategory =>
    subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.name.replace(/([A-Z])/g, ' $1').toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const filteredProducts = selectedCategory ? categoryProducts.filter(product => {
    // If a subcategory is selected, filter by that subcategory
    if (selectedSubcategory) {
      const productSubcategory = product.subcategory || product.category || 'General';
      const matchesSubcategory = productSubcategory === selectedSubcategory.name;
      const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           productSubcategory.toLowerCase().includes(searchTerm.toLowerCase());
      console.log(`Filtering product: ${product.name}, subcategory: ${productSubcategory}, matches: ${matchesSubcategory}`);
      return matchesSubcategory && matchesSearch;
    }
    
    // If no subcategory selected, show ALL products in this category with search filter
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.subcategory || product.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    console.log(`Showing all products: ${product.name}, matches search: ${matchesSearch}`);
    return matchesSearch;
  }) : [];

  console.log('Filtered products count:', filteredProducts.length);
  console.log('Selected subcategory:', selectedSubcategory);

  // Function to format subcategory names for better display
  const formatSubcategoryName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  useEffect(() => {
    console.log('CategoryList component mounted, fetching data...');
    fetchCategoryCounts();
    
    // Listen for order updates to refresh counts
    const handleOrderUpdate = () => {
      console.log('Order updated, refreshing counts...');
      fetchCategoryCounts();
    };
    
    window.addEventListener('orders-updated', handleOrderUpdate);
    return () => window.removeEventListener('orders-updated', handleOrderUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Category List</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">View all product categories and their inventory counts</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories or products..."
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500"
            />
          </div>
          <button
            onClick={fetchCategoryCounts}
            className="px-4 py-2 w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 border-b">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Categories</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span className="text-xs sm:text-sm">Loading categories...</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <div
                    key={category.key}
                    onClick={() => handleCategoryClick(category)}
                    className={`p-3 sm:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedCategory?.key === category.key ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${category.color} truncate`}>
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">
                          {categoryCounts[category.key] || 0}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">products</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subcategories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 border-b">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
              {selectedCategory ? `${selectedCategory.name} Subcategories` : 'Select a category'}
            </h2>
            {selectedCategory && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                {subcategories.length} subcategories found • {subcategories.reduce((sum, sub) => sum + sub.count, 0)} total products
              </p>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!selectedCategory ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm">
                Click on a category to view its subcategories
              </div>
            ) : subcategoriesLoading ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm">Loading subcategories...</div>
            ) : filteredSubcategories.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm break-words">
                {searchTerm ? 'No subcategories found matching your search' : 'No subcategories in this category'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSubcategories.map((subcategory, index) => (
                  <div
                    key={index}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className={`p-2.5 sm:p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedSubcategory?.name === subcategory.name ? 'bg-green-50 border-r-4 border-green-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                            {formatSubcategoryName(subcategory.name)}
                          </span>
                          {subcategory.parent && (
                            <span className="text-xs text-gray-400 break-words">
                              ({formatSubcategoryName(subcategory.parent)})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 flex-shrink-0">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {subcategory.count}
                        </span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">products</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-3 sm:p-4 border-b">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 break-words">
              {selectedSubcategory 
                ? `${formatSubcategoryName(selectedSubcategory.name)} Products` 
                : selectedCategory 
                  ? `${selectedCategory.name} Products` 
                  : 'Select a category'
              }
            </h2>
            {selectedCategory && (
              <div className="mt-1 sm:mt-2">
                <p className="text-xs sm:text-sm text-gray-500 break-words">
                  {filteredProducts.length} products found
                  {selectedSubcategory && ` in ${formatSubcategoryName(selectedSubcategory.name)}`}
                </p>
              </div>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!selectedCategory ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm">
                Click on a category to view its products
              </div>
            ) : productsLoading ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm break-words">
                {searchTerm 
                  ? 'No products found matching your search' 
                  : selectedSubcategory 
                    ? `No products found in ${formatSubcategoryName(selectedSubcategory.name)}` 
                    : 'No products in this category'
                }
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="divide-y divide-gray-200">
                  {filteredProducts.map((product, index) => (
                    <div key={product._id || index} className="p-3 sm:p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs sm:text-sm font-medium text-gray-900 break-words">
                            {product.name || 'Unnamed Product'}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-green-100 text-green-800 rounded-full whitespace-nowrap">
                            {product.totalProduct || 0} products
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
