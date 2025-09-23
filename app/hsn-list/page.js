"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronDown, X, ArrowUp, ArrowDown } from 'lucide-react';

const HSNListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortField, setSortField] = useState('code');
  const [sortOrder, setSortOrder] = useState('asc');
  const [hsnData, setHsnData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(21856);

  // Extended HSN Database (simulating 21,856 items)
  const generateHSNData = () => {
    const baseHSNCodes = [
      { code: '010190', description: 'Other' },
      { code: '01011020', description: 'LIVE HORSES, ASSES, MULESANDHINNIES PURE-BRED BREEDING ANIMALS ASSES' },
      { code: '0101', description: 'LIVE HORSES, ASSES, MULES AND HINNIES - Horses:' },
      { code: '01029090', description: 'LIVE BOVINE ANIMALS - OTHER - OTHER' },
      { code: '010511', description: 'LIVE ANIMALS~Live poultry, that is to say, fowls of the species Gallus domesticus, ducks, geese, turkeys and guinea fowls.~Fowls of the species Gallus domesticus' },
      { code: '01051900', description: 'SPECIES GALLU SDOMESTICUS, DUCKS, GEESE, TURKEYS AND GUINEA FOWLS WEIGHING NOT MORE THAN 185G : OTHER' },
      { code: '01052000', description: 'LIVE POULTRY, THAT IS TO SAY, FOWLS OF THE SPECIES GALLUS DOMESTICUS, DUCKS, GEESE, TURKEYS AND GUINEA FOWLS WEIGHING NOT MORE THAN 185G' },
      { code: '7214', description: 'Steel rods and bars' },
      { code: '7215', description: 'Steel wire' },
      { code: '7216', description: 'Steel angles, shapes and sections' },
      { code: '2523', description: 'Portland cement' },
      { code: '2517', description: 'Pebbles, gravel, broken stone' },
      { code: '6801', description: 'Setts, curbstones and flagstones' },
      { code: '8205', description: 'Hand tools' },
      { code: '8206', description: 'Tools of two or more materials' },
      { code: '8536', description: 'Electrical apparatus for switching' },
      { code: '8537', description: 'Boards, panels, consoles, desks' },
      { code: '8544', description: 'Insulated wire, cable and other conductors' },
      { code: '3208', description: 'Paints and varnishes' },
      { code: '8301', description: 'Padlocks and locks' },
      { code: '4407', description: 'Wood sawn or chipped lengthwise' },
      { code: '7003', description: 'Cast glass and rolled glass' },
      { code: '7308', description: 'Steel structures and parts' },
      { code: '7310', description: 'Tanks, casks, drums, cans, boxes' },
      { code: '3210', description: 'Other paints and varnishes' },
      { code: '8302', description: 'Base metal mountings, fittings' },
      { code: '4408', description: 'Sheets for veneering' },
      { code: '7004', description: 'Drawn glass and blown glass' },
      { code: '7311', description: 'Containers for compressed or liquefied gas' },
      { code: '3211', description: 'Prepared driers' },
      { code: '8303', description: 'Armoured or reinforced safes' },
      { code: '4409', description: 'Wood continuously shaped' },
      { code: '7005', description: 'Float glass and surface ground glass' },
      { code: '7312', description: 'Stranded wire, ropes, cables' },
      { code: '3212', description: 'Pigments dispersed in non-aqueous media' },
      { code: '8304', description: 'Filing cabinets, card-index cabinets' },
      { code: '4410', description: 'Particle board and similar board' },
      { code: '7006', description: 'Glass of heading 7003, 7004 or 7005' },
      { code: '8305', description: 'Fittings for loose-leaf binders' },
      { code: '4411', description: 'Fibreboard of wood or other ligneous materials' },
      { code: '7007', description: 'Safety glass' },
      { code: '8545', description: 'Carbon electrodes, carbon brushes' },
      { code: '8546', description: 'Electrical insulators' },
      { code: '6802', description: 'Worked monumental or building stone' },
      { code: '6809', description: 'Articles of plaster or of compositions' },
      { code: '8207', description: 'Interchangeable tools' },
      { code: '8208', description: 'Knives and cutting blades' },
      { code: '8209', description: 'Plates, sticks, tips and the like' },
      { code: '7309', description: 'Reservoirs, tanks, vats' }
    ];

    // Generate more data to simulate 21,856 items
    const extendedData = [];
    for (let i = 0; i < 21856; i++) {
      const baseItem = baseHSNCodes[i % baseHSNCodes.length];
      extendedData.push({
        id: i + 1,
        code: baseItem.code + (i > baseHSNCodes.length ? String(i).padStart(3, '0') : ''),
        description: baseItem.description + (i > baseHSNCodes.length ? ` - Variant ${i}` : ''),
        gstRate: [0, 5, 12, 18, 28][i % 5],
        category: ['Steel', 'Construction', 'Tools', 'Electrical', 'Plumbing'][i % 5]
      });
    }
    return extendedData;
  };

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = generateHSNData();
      setHsnData(data);
      setLoading(false);
    }, 500);
  }, []);

  const filteredData = hsnData.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelectHSN = (hsn) => {
    // Send selected HSN back to parent window
    if (window.opener) {
      window.opener.postMessage({ type: 'HSN_SELECTED', hsn }, '*');
      window.close();
    }
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
                <h1 className="text-2xl font-bold text-gray-900">HSN/SAC List</h1>
                <p className="text-gray-600 mt-1">Select HSN/SAC to apply</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  →
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
                <span className="font-semibold">{totalItems.toLocaleString()}</span> items
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
                      onClick={() => handleSort('code')}
                      className="flex items-center space-x-1 hover:bg-purple-700 rounded px-2 py-1 -mx-2 -my-1"
                    >
                      <span>HSN Code</span>
                      {sortField === 'code' ? (
                        sortOrder === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        <span>Loading HSN codes...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleSelectHSN(item)}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono text-sm text-gray-900 border-r border-gray-200">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.description}
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
                Total {filteredData.length} HSN codes available
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

export default HSNListPage;
