"use client";
import React, { useState, useEffect } from 'react';
import { Search, Package, Info, Copy, Check, X, Loader } from 'lucide-react';

const HSNLookup = ({ onClose, onSelectHSN, selectedHSN }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // HSN Code Database
  const hsnDatabase = [
    // Steel and Metal Products
    { code: '7214', description: 'Steel rods and bars', category: 'Steel Products', gstRate: 18, unit: 'Kg' },
    { code: '7215', description: 'Steel wire', category: 'Steel Products', gstRate: 18, unit: 'Kg' },
    { code: '7216', description: 'Steel angles, shapes and sections', category: 'Steel Products', gstRate: 18, unit: 'Kg' },
    { code: '7217', description: 'Steel wire rope', category: 'Steel Products', gstRate: 18, unit: 'Kg' },
    { code: '7308', description: 'Steel structures and parts', category: 'Steel Products', gstRate: 18, unit: 'Kg' },
    
    // Construction Materials
    { code: '2523', description: 'Portland cement', category: 'Construction', gstRate: 28, unit: 'Bag' },
    { code: '2517', description: 'Pebbles, gravel, broken stone', category: 'Construction', gstRate: 5, unit: 'Ton' },
    { code: '6801', description: 'Setts, curbstones and flagstones', category: 'Construction', gstRate: 18, unit: 'Sq M' },
    { code: '6802', description: 'Worked monumental or building stone', category: 'Construction', gstRate: 18, unit: 'Sq M' },
    { code: '6809', description: 'Articles of plaster or of compositions', category: 'Construction', gstRate: 18, unit: 'Kg' },
    
    // Tools and Hardware
    { code: '8205', description: 'Hand tools', category: 'Tools', gstRate: 12, unit: 'Pcs' },
    { code: '8206', description: 'Tools of two or more materials', category: 'Tools', gstRate: 12, unit: 'Pcs' },
    { code: '8207', description: 'Interchangeable tools', category: 'Tools', gstRate: 12, unit: 'Pcs' },
    { code: '8208', description: 'Knives and cutting blades', category: 'Tools', gstRate: 12, unit: 'Pcs' },
    { code: '8209', description: 'Plates, sticks, tips and the like', category: 'Tools', gstRate: 12, unit: 'Pcs' },
    
    // Electrical Items
    { code: '8536', description: 'Electrical apparatus for switching', category: 'Electrical', gstRate: 18, unit: 'Pcs' },
    { code: '8537', description: 'Boards, panels, consoles, desks', category: 'Electrical', gstRate: 18, unit: 'Pcs' },
    { code: '8544', description: 'Insulated wire, cable and other conductors', category: 'Electrical', gstRate: 18, unit: 'Meter' },
    { code: '8545', description: 'Carbon electrodes, carbon brushes', category: 'Electrical', gstRate: 18, unit: 'Pcs' },
    { code: '8546', description: 'Electrical insulators', category: 'Electrical', gstRate: 18, unit: 'Pcs' },
    
    // Plumbing
    { code: '7308', description: 'Structures and parts of structures', category: 'Plumbing', gstRate: 18, unit: 'Pcs' },
    { code: '7309', description: 'Reservoirs, tanks, vats', category: 'Plumbing', gstRate: 18, unit: 'Pcs' },
    { code: '7310', description: 'Tanks, casks, drums, cans, boxes', category: 'Plumbing', gstRate: 18, unit: 'Pcs' },
    { code: '7311', description: 'Containers for compressed or liquefied gas', category: 'Plumbing', gstRate: 18, unit: 'Pcs' },
    { code: '7312', description: 'Stranded wire, ropes, cables', category: 'Plumbing', gstRate: 18, unit: 'Meter' },
    
    // Paint and Chemicals
    { code: '3208', description: 'Paints and varnishes', category: 'Paint', gstRate: 18, unit: 'Liter' },
    { code: '3209', description: 'Pigments and preparations', category: 'Paint', gstRate: 18, unit: 'Kg' },
    { code: '3210', description: 'Other paints and varnishes', category: 'Paint', gstRate: 18, unit: 'Liter' },
    { code: '3211', description: 'Prepared driers', category: 'Paint', gstRate: 18, unit: 'Kg' },
    { code: '3212', description: 'Pigments dispersed in non-aqueous media', category: 'Paint', gstRate: 18, unit: 'Kg' },
    
    // General Hardware
    { code: '8301', description: 'Padlocks and locks', category: 'Hardware', gstRate: 18, unit: 'Pcs' },
    { code: '8302', description: 'Base metal mountings, fittings', category: 'Hardware', gstRate: 18, unit: 'Pcs' },
    { code: '8303', description: 'Armoured or reinforced safes', category: 'Hardware', gstRate: 18, unit: 'Pcs' },
    { code: '8304', description: 'Filing cabinets, card-index cabinets', category: 'Hardware', gstRate: 18, unit: 'Pcs' },
    { code: '8305', description: 'Fittings for loose-leaf binders', category: 'Hardware', gstRate: 18, unit: 'Pcs' },
    
    // Wood Products
    { code: '4407', description: 'Wood sawn or chipped lengthwise', category: 'Wood', gstRate: 12, unit: 'Cubic M' },
    { code: '4408', description: 'Sheets for veneering', category: 'Wood', gstRate: 12, unit: 'Sq M' },
    { code: '4409', description: 'Wood continuously shaped', category: 'Wood', gstRate: 12, unit: 'Meter' },
    { code: '4410', description: 'Particle board and similar board', category: 'Wood', gstRate: 12, unit: 'Sq M' },
    { code: '4411', description: 'Fibreboard of wood or other ligneous materials', category: 'Wood', gstRate: 12, unit: 'Sq M' },
    
    // Glass Products
    { code: '7003', description: 'Cast glass and rolled glass', category: 'Glass', gstRate: 18, unit: 'Sq M' },
    { code: '7004', description: 'Drawn glass and blown glass', category: 'Glass', gstRate: 18, unit: 'Sq M' },
    { code: '7005', description: 'Float glass and surface ground glass', category: 'Glass', gstRate: 18, unit: 'Sq M' },
    { code: '7006', description: 'Glass of heading 7003, 7004 or 7005', category: 'Glass', gstRate: 18, unit: 'Sq M' },
    { code: '7007', description: 'Safety glass', category: 'Glass', gstRate: 18, unit: 'Sq M' }
  ];

  const categories = ['All', 'Steel Products', 'Construction', 'Tools', 'Electrical', 'Plumbing', 'Paint', 'Hardware', 'Wood', 'Glass'];

  const filteredHSN = hsnDatabase.filter(item => {
    const matchesSearch = item.code.includes(searchTerm) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = async (code) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, you would call your HSN API here
      console.log('Searching HSN code:', code);
    } catch (error) {
      console.error('HSN search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHSN = (hsn) => {
    onSelectHSN(hsn);
    onClose();
  };

  const handleOpenHSNList = () => {
    // Open HSN list in new window
    const hsnWindow = window.open('/hsn-list', 'HSNList', 'width=1000,height=700,scrollbars=yes,resizable=yes');
    
    // Listen for HSN selection from the new window
    const handleMessage = (event) => {
      if (event.data.type === 'HSN_SELECTED') {
        handleSelectHSN(event.data.hsn);
        hsnWindow.close();
        window.removeEventListener('message', handleMessage);
      }
    };
    
    window.addEventListener('message', handleMessage);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getGSTRateColor = (rate) => {
    if (rate <= 5) return 'text-green-600 bg-green-100';
    if (rate <= 12) return 'text-blue-600 bg-blue-100';
    if (rate <= 18) return 'text-yellow-300 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-gray-100 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">HSN Code Lookup</h2>
              <p className="text-sm sm:text-base text-gray-600">Search and select HSN codes with descriptions</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-4 sm:p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_auto] gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by HSN code or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={handleOpenHSNList}
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="h-4 w-4" />
              <span>Open Full List</span>
            </button>
          </div>
        </div>

        {/* HSN List */}
        <div className="p-4 sm:p-6">
          {filteredHSN.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No HSN codes found</h3>
              <p className="text-gray-600">Try adjusting your search terms or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredHSN.map((hsn, index) => (
                <div
                  key={index}
                  className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    selectedHSN?.code === hsn.code ? 'ring-2 ring-purple-500 border-purple-500' : 'border-gray-200'
                  }`}
                  onClick={() => handleSelectHSN(hsn)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{hsn.code}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCode(hsn.code);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          {copiedCode === hsn.code ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{hsn.description}</p>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {hsn.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${getGSTRateColor(hsn.gstRate)}`}>
                          {hsn.gstRate}% GST
                        </span>
                        <span className="text-xs text-gray-500">
                          {hsn.unit}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                      <Info className="h-4 w-4" />
                      <span>Click to select</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectHSN(hsn);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-xs sm:text-sm hover:bg-purple-700 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Reference */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-medium text-gray-900">Steel Products</div>
              <div className="text-gray-600">7214, 7215, 7216</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-medium text-gray-900">Construction</div>
              <div className="text-gray-600">2523, 2517, 6801</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-medium text-gray-900">Tools</div>
              <div className="text-gray-600">8205, 8206, 8207</div>
            </div>
            <div className="bg-white p-3 rounded-lg border">
              <div className="font-medium text-gray-900">Electrical</div>
              <div className="text-gray-600">8536, 8537, 8544</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HSNLookup;
