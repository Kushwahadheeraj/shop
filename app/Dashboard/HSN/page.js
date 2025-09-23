"use client";
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Download, Filter, Eye, FileText, BarChart3 } from 'lucide-react';
import sandboxDocs from '../../api/sandbox-docs';

const HSNPage = () => {
  const [hsnData, setHsnData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [apiData, setApiData] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);

  // Fetch HSN codes from API
  const fetchHSNCodes = async () => {
    setLoading(true);
    try {
      console.log('🚀 Fetching HSN codes from API...');
      const response = await fetch('/api/hsn-codes');
      const result = await response.json();
      
      if (result.success) {
        console.log('📊 HSN API Response:', result.data);
        setHsnData(result.data);
      } else {
        console.error('❌ Error fetching HSN codes:', result.error);
      }
    } catch (error) {
      console.error('❌ Error fetching HSN codes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load HSN codes on component mount
  useEffect(() => {
    fetchHSNCodes();
  }, []);

  // Mock HSN Data (fallback - will be replaced by API data)
  const mockHSNData = [
    { code: '7214', description: 'Bars and rods, of iron or non-alloy steel, not further worked than forged, hot-rolled, hot-drawn or hot-extruded, but including those twisted after rolling', gstRate: 18, category: 'Steel Products' },
    { code: '7215', description: 'Other bars and rods of iron or non-alloy steel', gstRate: 18, category: 'Steel Products' },
    { code: '7216', description: 'Angles, shapes and sections of iron or non-alloy steel', gstRate: 18, category: 'Steel Products' },
    { code: '7217', description: 'Wire of iron or non-alloy steel', gstRate: 18, category: 'Steel Products' },
    { code: '7308', description: 'Structures (excluding prefabricated buildings of heading 9406) and parts of structures (for example, bridges and bridge-sections, lock-gates, towers, lattice masts, roofs, roofing frameworks, doors and windows and their frames and thresholds for doors, shutters, balustrades, pillars and columns), of iron or steel; plates, rods, angles, shapes, sections, tubes and the like, prepared for use in structures, of iron or steel', gstRate: 18, category: 'Steel Products' },
    { code: '2523', description: 'Portland cement, aluminous cement, slag cement, supersulphate cement and similar hydraulic cements, whether or not coloured or in the form of clinkers', gstRate: 28, category: 'Construction Materials' },
    { code: '2517', description: 'Pebbles, gravel, broken or crushed stone, of a kind commonly used for concrete aggregates, for road metalling or for railway or other ballast, shingle and flint, whether or not heat-treated; macadam of slag or similar industrial waste, whether or not incorporating the materials cited in the first part of the heading; tarred macadam; granules, chippings and powder of stones of heading 2515 or 2516, whether or not agglomerated by a binder', gstRate: 5, category: 'Construction Materials' },
    { code: '6801', description: 'Setts, curbstones and flagstones, of natural stone (except slate)', gstRate: 18, category: 'Construction Materials' },
    { code: '6802', description: 'Worked monumental or building stone (except slate) and articles thereof, other than goods of heading 6801; mosaic cubes and the like, of natural stone (including slate), whether or not on a backing; artificially coloured granules, chippings and powder of natural stone (including slate)', gstRate: 18, category: 'Construction Materials' },
    { code: '6809', description: 'Articles of plaster or of compositions based on plaster', gstRate: 12, category: 'Construction Materials' },
    { code: '8205', description: 'Hand tools (including glaziers\' diamonds), not elsewhere specified or included; blow lamps; vices, clamps and the like, other than accessories for and parts of, machine tools; anvils; portable forges; grinding wheels with frameworks, hand or pedal-operated', gstRate: 12, category: 'Tools' },
    { code: '8206', description: 'Tools of two or more of the headings 8202 to 8205, put up in sets for retail sale', gstRate: 12, category: 'Tools' },
    { code: '8207', description: 'Interchangeable tools for hand tools, whether or not power-operated, or for machine-tools (for example, for pressing, stamping, punching, tapping, threading, drilling, boring, broaching, milling, turning or screw driving), including dies for drawing or extruding metal, and rock drilling or earth boring tools', gstRate: 12, category: 'Tools' },
    { code: '8208', description: 'Knives and cutting blades, for machines or for mechanical appliances', gstRate: 12, category: 'Tools' },
    { code: '8209', description: 'Plates, sticks, tips and the like for tools, unmounted, of cermets', gstRate: 12, category: 'Tools' },
    { code: '8536', description: 'Electrical apparatus for switching or protecting electrical circuits, or for making connections to or in electrical circuits (for example, switches, relays, fuses, surge suppressors, plugs, sockets, lamp-holders, junction boxes), for a voltage not exceeding 1,000 volts; connectors for optical fibres, optical fibre bundles or cables', gstRate: 18, category: 'Electrical Goods' },
    { code: '8537', description: 'Boards, panels, consoles, desks, cabinets and other bases, equipped with two or more apparatus of heading 8535 or 8536, for electric control or the distribution of electricity, including those incorporating instruments or apparatus of Chapter 90, and numerical control apparatus, other than switching apparatus of heading 8517', gstRate: 18, category: 'Electrical Goods' },
    { code: '8544', description: 'Insulated (including enamelled or anodised) wire, cable (including co-axial cable) and other insulated electric conductors, whether or not fitted with connectors; optical fibre cables, made up of individually sheathed fibres, whether or not assembled with electric conductors or fitted with connectors', gstRate: 18, category: 'Electrical Goods' },
    { code: '8545', description: 'Carbon electrodes, carbon brushes, lamp carbons, battery carbons and other articles of graphite or other carbon, with or without metal, of a kind used for electrical purposes', gstRate: 18, category: 'Electrical Goods' },
    { code: '8546', description: 'Electrical insulators of any material', gstRate: 18, category: 'Electrical Goods' },
    { code: '7309', description: 'Reservoirs, tanks, vats and similar containers for any material (other than compressed or liquefied gas), of iron or steel, of a capacity exceeding 300 l, whether or not lined or heat-insulated, but not fitted with mechanical or thermal equipment', gstRate: 18, category: 'Plumbing & Sanitary' },
    { code: '7310', description: 'Tanks, casks, drums, cans, boxes and similar containers, for any material (other than compressed or liquefied gas), of iron or steel, of a capacity not exceeding 300 l, whether or not lined or heat-insulated, but not fitted with mechanical or thermal equipment', gstRate: 18, category: 'Plumbing & Sanitary' },
    { code: '7311', description: 'Containers for compressed or liquefied gas, of iron or steel', gstRate: 18, category: 'Plumbing & Sanitary' },
    { code: '7312', description: 'Stranded wire, ropes, cables, plaited bands, slings and the like, of iron or steel, not electrically insulated', gstRate: 18, category: 'Plumbing & Sanitary' },
    { code: '3208', description: 'Paints and varnishes (including enamels and lacquers) based on synthetic polymers or chemically modified natural polymers, dispersed or dissolved in a non-aqueous medium; solutions as defined in Note 4 to this Chapter', gstRate: 18, category: 'Paints & Chemicals' },
    { code: '3209', description: 'Paints and varnishes (including enamels and lacquers) based on synthetic polymers or chemically modified natural polymers, dispersed or dissolved in an aqueous medium', gstRate: 18, category: 'Paints & Chemicals' },
    { code: '3210', description: 'Other paints and varnishes (including enamels, lacquers and distempers); prepared water pigments of a kind used for finishing leather; prepared pigments, opacifiers and colours, vitrifiable enamels and glazes, engobes (slips), liquid lustres and similar preparations, of a kind used in the ceramic, enamelling or glass industry; glass frit and other glass, in powder, granules or flakes', gstRate: 18, category: 'Paints & Chemicals' },
    { code: '3211', description: 'Prepared driers', gstRate: 18, category: 'Paints & Chemicals' },
    { code: '3212', description: 'Pigments (including metallic powders and metallic flakes) dispersed in non-aqueous media, in liquid or paste form, of a kind used in the manufacture of paints (including enamels); stamping foils; dyes and other colouring matter put up in forms or packings for retail sale', gstRate: 18, category: 'Paints & Chemicals' },
    { code: '8301', description: 'Padlocks and locks (key, combination or electrically operated), of base metal; clasps and frames with clasps, incorporating locks, of base metal; keys for any of the foregoing articles, of base metal', gstRate: 18, category: 'Hardware & Fittings' },
    { code: '8302', description: 'Base metal mountings, fittings and similar articles suitable for furniture, doors, staircases, windows, blinds, coachwork, saddlery, trunks, caskets, or the like; hat-racks, hat-pegs, brackets and similar fixtures, of base metal; castors with mountings of base metal; automatic door closers of base metal', gstRate: 18, category: 'Hardware & Fittings' },
    { code: '8303', description: 'Armoured or reinforced safes, strong-boxes and doors and safe deposit lockers for strong-rooms, cash or document boxes and similar articles, of base metal', gstRate: 18, category: 'Hardware & Fittings' },
    { code: '8304', description: 'Filing cabinets, card-index cabinets, paper trays, paper rests, pen trays, office-type desk accessories and similar office or desk equipment, of base metal, other than office furniture of heading 9403', gstRate: 18, category: 'Hardware & Fittings' },
    { code: '8305', description: 'Fittings for loose-leaf binders or files, letter clips, letter corners, paper clips, indexing tags and similar office articles, of base metal; staples in strips (for example, for offices, upholstery, packaging), of base metal', gstRate: 18, category: 'Hardware & Fittings' },
    { code: '4407', description: 'Wood sawn or chipped lengthwise, sliced or peeled, whether or not planed, sanded or end-jointed, of a thickness exceeding 6 mm', gstRate: 12, category: 'Wood & Timber' },
    { code: '4408', description: 'Sheets for veneering (including those obtained by slicing laminated wood), for plywood or for similar laminated wood and other wood, sawn lengthwise, sliced or peeled, whether or not planed, sanded, spliced or end-jointed, of a thickness not exceeding 6 mm', gstRate: 12, category: 'Wood & Timber' },
    { code: '4409', description: 'Wood (including strips and friezes for parquet flooring, not assembled) continuously shaped (tongued, grooved, rebated, chamfered, V-jointed, beaded, moulded, rounded or the like) along any of its edges or faces, whether or not planed, sanded or end-jointed', gstRate: 12, category: 'Wood & Timber' },
    { code: '4410', description: 'Particle board, oriented strand board (OSB) and similar board (for example, waferboard) of wood or other ligneous materials, whether or not agglomerated with resins or other organic binding substances', gstRate: 12, category: 'Wood & Timber' },
    { code: '4411', description: 'Fibreboard of wood or other ligneous materials, whether or not bonded with resins or other organic substances', gstRate: 12, category: 'Wood & Timber' },
    { code: '7003', description: 'Cast glass and rolled glass, in sheets or profiles, whether or not having an absorbent, reflecting or non-reflecting layer, but not otherwise worked', gstRate: 18, category: 'Glass & Mirrors' },
    { code: '7004', description: 'Drawn glass and blown glass, in sheets, whether or not having an absorbent, reflecting or non-reflecting layer, but not otherwise worked', gstRate: 18, category: 'Glass & Mirrors' },
    { code: '7005', description: 'Float glass and surface ground or polished glass, in sheets, whether or not having an absorbent, reflecting or non-reflecting layer, but not otherwise worked', gstRate: 18, category: 'Glass & Mirrors' },
    { code: '7006', description: 'Glass of heading 7003, 7004 or 7005, bent, edge-worked, engraved, drilled, enamelled or otherwise worked, but not framed or fitted with other materials', gstRate: 18, category: 'Glass & Mirrors' },
    { code: '7007', description: 'Safety glass, consisting of toughened (tempered) or laminated glass', gstRate: 18, category: 'Glass & Mirrors' }
  ];

  const categories = ['All', ...new Set(hsnData.map(item => item.category))];

  // Fetch data from eWayBill API
  const fetchEWayBillData = async () => {
    setApiLoading(true);
    try {
      console.log('🚀 Fetching eWayBill data...');
      const { data } = await sandboxDocs.eWayBillSearchGstinApi();
      console.log('📊 eWayBill API Response:', data);
      setApiData(data);
    } catch (error) {
      console.error('❌ Error fetching eWayBill data:', error);
    } finally {
      setApiLoading(false);
    }
  };

  // Filter HSN data based on search term and category
  const filteredHSN = hsnData.filter(item => {
    const matchesSearch = item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHSN.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHSN = filteredHSN.slice(startIndex, endIndex);

  const getGstRateColor = (rate) => {
    if (rate === 0) return 'bg-gray-100 text-gray-800';
    if (rate <= 5) return 'bg-green-100 text-green-800';
    if (rate <= 12) return 'bg-blue-100 text-blue-800';
    if (rate <= 18) return 'bg-purple-100 text-purple-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HSN Code Management</h1>
          <p className="text-gray-600">Search and manage HSN codes and their details</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchHSNCodes}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loading ? 'Loading HSN Codes...' : 'Refresh HSN Codes'}
          </button>
          <button
            onClick={fetchEWayBillData}
            disabled={apiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {apiLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {apiLoading ? 'Fetching API Data...' : 'Fetch eWayBill Data'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* API Data Display */}
      {apiData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">eWayBill API Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-700">Business Details</h4>
              <p className="text-sm text-gray-600">GSTIN: {apiData.businessDetails?.gstin || 'N/A'}</p>
              <p className="text-sm text-gray-600">Name: {apiData.businessDetails?.businessName || 'N/A'}</p>
              <p className="text-sm text-gray-600">Status: {apiData.businessDetails?.status || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-700">Address</h4>
              <p className="text-sm text-gray-600">State: {apiData.addressInformation?.state || 'N/A'}</p>
              <p className="text-sm text-gray-600">District: {apiData.addressInformation?.district || 'N/A'}</p>
              <p className="text-sm text-gray-600">Pincode: {apiData.addressInformation?.pincode || 'N/A'}</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h4 className="font-medium text-gray-700">GST Details</h4>
              <p className="text-sm text-gray-600">CGST: {apiData.gstDetails?.cgstRate || 'N/A'}%</p>
              <p className="text-sm text-gray-600">SGST: {apiData.gstDetails?.sgstRate || 'N/A'}%</p>
              <p className="text-sm text-gray-600">IGST: {apiData.gstDetails?.igstRate || 'N/A'}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search HSN codes or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total HSN Codes</p>
              <p className="text-2xl font-semibold text-gray-900">{hsnData.length.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Complete GST HSN Database</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredHSN.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Filter className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-semibold text-gray-900">{categories.length - 1}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Page</p>
              <p className="text-2xl font-semibold text-gray-900">{currentPage} / {totalPages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* HSN Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">HSN Codes & Details</h3>
          {loading && (
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Loading HSN codes from API...
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HSN Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Loading HSN codes from API...</span>
                    </div>
                  </td>
                </tr>
              ) : currentHSN.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No HSN codes found. Click "Refresh HSN Codes" to load data.
                  </td>
                </tr>
              ) : (
                currentHSN.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                    <div className="truncate" title={item.description}>
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGstRateColor(item.gstRate)}`}>
                      {item.gstRate}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredHSN.length)}</span> of{' '}
                  <span className="font-medium">{filteredHSN.length}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HSNPage;
