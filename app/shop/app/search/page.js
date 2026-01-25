'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { allCategories } from '../../lib/categoryData';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchCategories = () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Filter categories based on search query
        const filteredCategories = allCategories.filter(category => 
          category.name.toLowerCase().includes(query.toLowerCase()) ||
          category.description.toLowerCase().includes(query.toLowerCase())
        );

        setCategories(filteredCategories);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search categories');
      } finally {
        setLoading(false);
      }
    };

    searchCategories();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-300 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-gray-600">
            {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} found
          </p>
        </div>

        {/* Results */}
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try searching with different keywords</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      category.type === 'main' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <span className={`font-bold text-2xl ${
                        category.type === 'main' ? 'text-yellow-300' : 'text-blue-600'
                      }`}>
                        {category.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {category.description}
                      </p>
                      {category.type === 'sub' && (
                        <p className="text-xs text-blue-600 font-medium">Under {category.parent}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`inline-flex items-center px-4 py-2 font-medium rounded-full transition-colors ${
                      category.type === 'main' 
                        ? 'bg-yellow-300 text-white hover:bg-yellow-300' 
                        : 'bg-blue-400 text-white hover:bg-blue-500'
                    }`}>
                      View {category.name} Products
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
