"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, X, ArrowUp, ArrowDown } from 'lucide-react';

const GSTRateListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortField, setSortField] = useState('rate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [gstRates, setGstRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(100);

  // GST Rate Database
  const generateGSTRates = () => {
    const baseRates = [
      { rate: 0, description: 'Exempted', category: 'Exempted', applicable: 'All goods' },
      { rate: 0.25, description: 'Diamond & Gold', category: 'Precious Metals', applicable: 'Diamonds, gold jewelry' },
      { rate: 3, description: 'Gold & Silver', category: 'Precious Metals', applicable: 'Gold, silver articles' },
      { rate: 5, description: 'Essential Items', category: 'Essential', applicable: 'Food items, medicines, books' },
      { rate: 12, description: 'Standard Rate', category: 'Standard', applicable: 'Most goods and services' },
      { rate: 18, description: 'Standard Rate', category: 'Standard', applicable: 'Most goods and services' },
      { rate: 28, description: 'Luxury Items', category: 'Luxury', applicable: 'Luxury cars, tobacco, aerated drinks' }
    ];

    // Generate more data to simulate 100 items
    const extendedData = [];
    for (let i = 0; i < 100; i++) {
      const baseRate = baseRates[i % baseRates.length];
      extendedData.push({
        id: i + 1,
        rate: baseRate.rate + (i > baseRates.length ? (i * 0.1) : 0),
        description: baseRate.description + (i > baseRates.length ? ` - Variant ${i}` : ''),
        category: baseRate.category,
        applicable: baseRate.applicable
      });
    }
    return extendedData;
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateGSTRates();
      setGstRates(data);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = gstRates.filter(item =>
    item.rate.toString().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSelectRate = (rate) => {
    // Send selected GST rate back to parent window
    if (window.opener) {
      window.opener.postMessage({ type: 'GST_RATE_SELECTED', rate }, '*');
      window.close();
    }
  };

  const getRateColor = (rate) => {
    if (rate === 0) return 'bg-gray-100 text-gray-800';
    if (rate <= 5) return 'bg-green-100 text-green-800';
    if (rate <= 12) return 'bg-blue-100 text-blue-800';
    if (rate <= 18) return 'bg-purple-100 text-purple-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">GST Rate List</h1>
                <p className="text-gray-600 mt-1">Select GST Rate to apply</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => window.close()}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pagination Info */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(endIndex, filteredData.length)}</span> items of{' '}
                <span className="font-semibold">{filteredData.length}</span> items
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(1)}
                        className="px-2 py-1 text-sm rounded hover:bg-gray-200"
                      >
                        1
                      </button>
                    )}
                    
                    {currentPage > 3 && <span className="px-1">...</span>}
                    
                    {currentPage > 2 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-2 py-1 text-sm rounded hover:bg-gray-200"
                      >
                        {currentPage - 1}
                      </button>
                    )}
                    
                    <button className="px-2 py-1 text-sm bg-purple-600 text-white rounded">
                      {currentPage}
                    </button>
                    
                    {currentPage < totalPages - 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-2 py-1 text-sm rounded hover:bg-gray-200"
                      >
                        {currentPage + 1}
                      </button>
                    )}
                    
                    {currentPage < totalPages - 2 && <span className="px-1">...</span>}
                    
                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-2 py-1 text-sm rounded hover:bg-gray-200"
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto max-h-96">
            <table className="w-full border-collapse">
              <thead className="bg-purple-600 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left border-r border-purple-500">
                    <button
                      onClick={() => handleSort('rate')}
                      className="flex items-center space-x-1 hover:bg-purple-700 rounded px-2 py-1 -mx-2 -my-1"
                    >
                      <span>GST Rate (%)</span>
                      {sortField === 'rate' ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left border-r border-purple-500">
                    <button
                      onClick={() => handleSort('description')}
                      className="flex items-center space-x-1 hover:bg-purple-700 rounded px-2 py-1 -mx-2 -my-1"
                    >
                      <span>Description</span>
                      {sortField === 'description' ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left border-r border-purple-500">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center space-x-1 hover:bg-purple-700 rounded px-2 py-1 -mx-2 -my-1"
                    >
                      <span>Category</span>
                      {sortField === 'category' ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span>Applicable To</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>Loading GST rates...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectRate(item)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-gray-900 border-r border-gray-200">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRateColor(item.rate)}`}>
                          {item.rate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.applicable}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Total {filteredData.length} GST rates available
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.close()}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => window.close()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTRateListPage;

