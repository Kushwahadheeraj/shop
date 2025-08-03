const fs = require('fs');
const path = require('path');

// API mappings from apiS.js - exact matches
const PAINTS_API_MAPPINGS = {
  // Main paints categories
  'Paints': '/paint/paints',

  // Paint subcategories from apiS.js
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
  'WoodMetal': '/paint/wood-metal'
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

console.log('🚀 Starting All Paints ProductList API URL updates...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');

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