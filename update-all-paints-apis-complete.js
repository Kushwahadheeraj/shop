const fs = require('fs');
const path = require('path');

// Complete API mappings from apiS.js - including all nested subdirectories
const PAINTS_API_MAPPINGS = {
  // Main paints categories
  'Paints': '/paint/paints',

  // Paint subcategories from apiS.js - main categories
  'AcrylicEmulsionPaint': '/paint/acrylic-emulsion-paint',
  'AdhesiveThinner': '/paint/adhesive-thinner-adhesive',
  'AspaPaints': '/paint/aspa-paints',
  'BrushesRollers': '/paint/brushes-rollers-paint-brushes',
  'Distemper': '/paint/distemper-acrylic-distemper',
  'Emulsion': '/paint/emulsion-exterior-emulsion',
  'Enamel': '/paint/enamel-gloss-enamel',
  'ExteriorPaints': '/paint/exterior-paints',
  'FloorPaints': '/paint/floor-paints',
  'IndustrialCoatings': '/paint/industrial-coatings',
  'InteriorPaints': '/paint/interior-paints',
  'PaintingAccessories': '/paint/painting-accessories-painting-tools',
  'PaintingTools': '/paint/painting-tools',
  'Primer': '/paint/primer-acrylic-primer',
  'PrimerAndWallPutty': '/paint/primer-and-wall-putty',
  'Sanitizer': '/paint/sanitizer',
  'SprayPaints': '/paint/spray-paints',
  'Stainers': '/paint/stainers-universal-stainers',
  'StainersThinners': '/paint/stainers-thinners',
  'Stencils': '/paint/stencils',
  'TileGuard': '/paint/tile-guard',
  'TopBrands': '/paint/top-brands-dulex-paints',
  'WallPutty': '/paint/wall-putty-acrylic-wall-putty',
  'WallStickersWallpapers': '/paint/wall-stickers-wallpapers',
  'Waterproofing': '/paint/waterproofing-crack-fillers',
  'WoodFinishes': '/paint/wood-finishes-glass-coatings',
  'WoodMetal': '/paint/wood-metal',

  // Nested subdirectories - AdhesiveThinner
  'AdhesiveThinner/Adhesive': '/paint/adhesive-thinner-adhesive',
  'AdhesiveThinner/Thinner': '/paint/adhesive-thinner-thinner',

  // Nested subdirectories - BrushesRollers
  'BrushesRollers/PaintBrushes': '/paint/brushes-rollers-paint-brushes',
  'BrushesRollers/Rollers': '/paint/brushes-rollers-rollers',
  'BrushesRollers/SprayPaints': '/paint/brushes-rollers-spray-paints',

  // Nested subdirectories - Distemper
  'Distemper/AcrylicDistemper': '/paint/distemper-acrylic-distemper',
  'Distemper/SyntheticDistemper': '/paint/distemper-synthetic-distemper',

  // Nested subdirectories - Emulsion
  'Emulsion/ExteriorEmulsion': '/paint/emulsion-exterior-emulsion',
  'Emulsion/InteriorEmulsion': '/paint/emulsion-interior-emulsion',
  'Emulsion/TileGuard': '/paint/emulsion-tile-guard',
  'Emulsion/WallTexture': '/paint/emulsion-wall-texture',

  // Nested subdirectories - Enamel
  'Enamel/GlossEnamel': '/paint/enamel-gloss-enamel',
  'Enamel/SatinEnamel': '/paint/enamel-satin-enamel',
  'Enamel/SyntheticEnamel': '/paint/enamel-synthetic-enamel',

  // Nested subdirectories - PaintingAccessories
  'PaintingAccessories/PaintingTools': '/paint/painting-accessories-painting-tools',
  'PaintingAccessories/SandpaperRolls': '/paint/painting-accessories-sandpaper-rolls',
  'PaintingAccessories/Stencils': '/paint/painting-accessories-stencils',

  // Nested subdirectories - Primer
  'Primer/AcrylicPrimer': '/paint/primer-acrylic-primer',
  'Primer/CementPrimer': '/paint/primer-cement-primer',
  'Primer/ExteriorPrimer': '/paint/primer-exterior-primer',
  'Primer/InteriorPrimer': '/paint/primer-interior-primer',
  'Primer/MetalPrimer': '/paint/primer-metal-primer',
  'Primer/SolventPrimer': '/paint/primer-solvent-primer',
  'Primer/WoodPrimer': '/paint/primer-wood-primer',

  // Nested subdirectories - Stainers
  'Stainers/UniversalStainers': '/paint/stainers-universal-stainers',
  'Stainers/WoodStainers': '/paint/stainers-wood-stainers',

  // Nested subdirectories - TopBrands
  'TopBrands/AgsarPaints': '/paint/top-brands-aspa-paints',
  'TopBrands/AsianPaints': '/paint/top-brands-asian-paints',
  'TopBrands/Dulux': '/paint/top-brands-dulex-paints',
  'TopBrands/GemPaints': '/paint/top-brands-dulex-paints',
  'TopBrands/JkWallPutty': '/paint/top-brands-jk-wall-putty',
  'TopBrands/Neroloc': '/paint/top-brands-neroloc-paints',

  // Nested subdirectories - WallPutty
  'WallPutty/AcrylicWallPutty': '/paint/wall-putty-acrylic-wall-putty',
  'WallPutty/KpfWallPutty': '/paint/wall-putty-kpf-wall-putty',
  'WallPutty/PowderWallPutty': '/paint/wall-putty-powder-wall-putty',

  // Nested subdirectories - Waterproofing
  'Waterproofing/CrackFillers': '/paint/waterproofing-crack-fillers',
  'Waterproofing/WaterproofBasecoat': '/paint/waterproofing-waterproof-basecoat',

  // Nested subdirectories - WoodFinishes
  'WoodFinishes/GlassCoatings': '/paint/wood-finishes-glass-coatings',
  'WoodFinishes/Melamyne': '/paint/wood-finishes-melamyne',
  'WoodFinishes/Nc': '/paint/wood-finishes-nc',
  'WoodFinishes/Polish': '/paint/wood-finishes-polish',
  'WoodFinishes/Pu': '/paint/wood-finishes-pu',
  'WoodFinishes/Sealer': '/paint/wood-finishes-sealer',
  'WoodFinishes/VarnishBlackBoardPaint': '/paint/wood-finishes-varnish-black-board-paint',
  'WoodFinishes/WoodPutty': '/paint/wood-finishes-wood-putty'
};

function updateFile(filePath, apiPath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    let changes = 0;

    // Update API_URL - handle different patterns
    const apiUrlPatterns = [
      /const API_URL = `\$\{API_BASE_URL\}\/[^`]+`;/,
      /const API_URL = `\$\{API_BASE_URL\}\/paint\/[^`]+`;/,
      /const API_URL = `\$\{API_BASE_URL\}\/home\/paints`;/
    ];

    let apiUrlUpdated = false;
    for (const pattern of apiUrlPatterns) {
      if (pattern.test(content)) {
        const newApiUrl = `const API_URL = \`\${API_BASE_URL}${apiPath}\`;`;
        updated = updated.replace(pattern, newApiUrl);
        changes++;
        apiUrlUpdated = true;
        break;
      }
    }

    // Fix delete endpoint syntax from /delete: to /delete/
    const deleteRegex = /\/delete:([^\s"']+)/g;
    if (deleteRegex.test(updated)) {
      updated = updated.replace(deleteRegex, '/delete/$1');
      changes++;
    }

    if (changes > 0) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Updated: ${filePath} -> ${apiPath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walk(dir, parentPath = '') {
  let updatedCount = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        // Check if this directory has a ProductList.jsx file
        const productListPath = path.join(fullPath, 'ProductList.jsx');
        if (fs.existsSync(productListPath)) {
          const apiPath = PAINTS_API_MAPPINGS[relativePath];
          if (apiPath) {
            if (updateFile(productListPath, apiPath)) {
              updatedCount++;
            }
          } else {
            console.log(`⚠️  No API mapping found for: ${relativePath}`);
          }
        }
        
        // Continue walking subdirectories
        updatedCount += walk(fullPath, relativePath);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return updatedCount;
}

// Update files in both Paint directories
const PAINT_DIRS = [
  path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Paint'),
  path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Home', 'Paints')
];

console.log('🚀 Starting Complete Paints ProductList API URL updates...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');
console.log('📋 Including all nested subdirectories\n');

let totalUpdated = 0;

for (const dir of PAINT_DIRS) {
  if (fs.existsSync(dir)) {
    console.log(`\n📁 Processing directory: ${dir}`);
    totalUpdated += walk(dir);
  } else {
    console.log(`⚠️  Directory not found: ${dir}`);
  }
}

console.log(`\n✅ Completed! Updated ${totalUpdated} files.`);
console.log('\n🔧 All API_URL values now match the exact endpoints from apiS.js');
console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/'); 