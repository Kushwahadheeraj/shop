import { NextResponse } from 'next/server';

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    const code = searchParams.get('code') || '';

    console.log('🔍 HSN Lookup API called with:', { search, category, code });

    let filteredData = hsnDatabase;

    // Filter by search term
    if (search) {
      filteredData = filteredData.filter(item => 
        item.code.includes(search) || 
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      filteredData = filteredData.filter(item => item.category === category);
    }

    // Filter by specific code
    if (code) {
      filteredData = filteredData.filter(item => item.code === code);
    }

    console.log('📊 HSN Lookup Results:', {
      total: hsnDatabase.length,
      filtered: filteredData.length,
      search,
      category
    });

    return NextResponse.json({
      success: true,
      data: {
        hsnCodes: filteredData,
        total: filteredData.length,
        categories: ['All', 'Steel Products', 'Construction', 'Tools', 'Electrical', 'Plumbing', 'Paint', 'Hardware', 'Wood', 'Glass']
      },
      message: 'HSN codes retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ HSN Lookup API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'HSN_LOOKUP_ERROR',
        message: 'Failed to retrieve HSN codes',
        details: error.message
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, description, category } = body;

    console.log('🔍 HSN Search API called with:', { code, description, category });

    let searchResults = hsnDatabase;

    // Search by code
    if (code) {
      searchResults = searchResults.filter(item => item.code.includes(code));
    }

    // Search by description
    if (description) {
      searchResults = searchResults.filter(item => 
        item.description.toLowerCase().includes(description.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      searchResults = searchResults.filter(item => item.category === category);
    }

    console.log('📊 HSN Search Results:', {
      total: hsnDatabase.length,
      filtered: searchResults.length,
      searchTerm: { code, description, category }
    });

    return NextResponse.json({
      success: true,
      data: {
        hsnCodes: searchResults,
        total: searchResults.length,
        searchTerm: { code, description, category }
      },
      message: 'HSN search completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ HSN Search API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'HSN_SEARCH_ERROR',
        message: 'Failed to search HSN codes',
        details: error.message
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
