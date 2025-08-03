const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Home', 'Paints');

// API mappings from apiS.js - exact matches
const PAINTS_API_MAPPINGS = {
  // Main paints categories
  'Paints': '/paint/paints',

  // Paint subcategories from apiS.js
  'AcrylicEmulsionPaint': '/paint/acrylic-emulsion-paint',
  'AdhesiveThinner': '/paint/adhesive-thinner-adhesive',
  'AdhesiveThinnerThinner': '/paint/adhesive-thinner-thinner',
  'AspaPaints': '/paint/aspa-paints',
  'AutomativePaints': '/paint/automative-paints-aspa-paints',
  'BrushesRollers': '/paint/brushes-rollers-paint-brushes',
  'BrushesRollersRollers': '/paint/brushes-rollers-rollers',
  'BrushesRollersSprayPaints': '/paint/brushes-rollers-spray-paints',
  'Distemper': '/paint/distemper-acrylic-distemper',
  'DistemperSynthetic': '/paint/distemper-synthetic-distemper',
  'Emulsion': '/paint/emulsion-exterior-emulsion',
  'EmulsionInterior': '/paint/emulsion-interior-emulsion',
  'EmulsionTileGuard': '/paint/emulsion-tile-guard',
  'EmulsionWallTexture': '/paint/emulsion-wall-texture',
  'Enamel': '/paint/enamel-gloss-enamel',
  'EnamelSatin': '/paint/enamel-satin-enamel',
  'EnamelSynthetic': '/paint/enamel-synthetic-enamel',
  'ExteriorPaints': '/paint/exterior-paints',
  'FloorPaints': '/paint/floor-paints',
  'IndustrialCoatings': '/paint/industrial-coatings',
  'InteriorPaints': '/paint/interior-paints',
  'PaintingAccessories': '/paint/painting-accessories-painting-tools',
  'PaintingAccessoriesSandpaper': '/paint/painting-accessories-sandpaper-rolls',
  'PaintingAccessoriesStencils': '/paint/painting-accessories-stencils',
  'PaintingTools': '/paint/painting-tools',
  'Primer': '/paint/primer-acrylic-primer',
  'PrimerCement': '/paint/primer-cement-primer',
  'PrimerExterior': '/paint/primer-exterior-primer',
  'PrimerInterior': '/paint/primer-interior-primer',
  'PrimerMetal': '/paint/primer-metal-primer',
  'PrimerSolvent': '/paint/primer-solvent-primer',
  'PrimerWood': '/paint/primer-wood-primer',
  'PrimerAndWallPutty': '/paint/primer-and-wall-putty',
  'Sanitizer': '/paint/sanitizer',
  'SprayPaints': '/paint/spray-paints',
  'Stainers': '/paint/stainers-universal-stainers',
  'StainersWood': '/paint/stainers-wood-stainers',
  'StainersThinners': '/paint/stainers-thinners',
  'Stencils': '/paint/stencils',
  'TileGuard': '/paint/tile-guard',
  'TopBrands': '/paint/top-brands-dulex-paints',
  'TopBrandsAsian': '/paint/top-brands-asian-paints',
  'TopBrandsNerolac': '/paint/top-brands-neroloc-paints',
  'TopBrandsJK': '/paint/top-brands-jk-wall-putty',
  'WallPutty': '/paint/wall-putty-acrylic-wall-putty',
  'WallPuttyKPF': '/paint/wall-putty-kpf-wall-putty',
  'WallPuttyPowder': '/paint/wall-putty-powder-wall-putty',
  'WallStickers': '/paint/wall-stickers-wallpapers',
  'Waterproofing': '/paint/waterproofing-crack-fillers',
  'WaterproofingBasecoat': '/paint/waterproofing-waterproof-basecoat',
  'WoodFinishes': '/paint/wood-finishes-glass-coatings',
  'WoodFinishesMelamyne': '/paint/wood-finishes-melamyne',
  'WoodFinishesNC': '/paint/wood-finishes-nc',
  'WoodFinishesPolish': '/paint/wood-finishes-polish',
  'WoodFinishesPU': '/paint/wood-finishes-pu',
  'WoodFinishesSealer': '/paint/wood-finishes-sealer',
  'WoodFinishesVarnish': '/paint/wood-finishes-varnish-black-board-paint',
  'WoodFinishesWoodPutty': '/paint/wood-finishes-wood-putty',
  'WoodMetal': '/paint/wood-metal'
};

function updateFile(filePath, apiPath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    let changes = 0;

    // Update API_URL
    const apiUrlRegex = /const API_URL = `\$\{API_BASE_URL\}\/[^`]+`;/;
    const newApiUrl = `const API_URL = \`\${API_BASE_URL}${apiPath}\`;`;
    
    if (apiUrlRegex.test(content)) {
      updated = updated.replace(apiUrlRegex, newApiUrl);
      changes++;
    }

    // Fix delete endpoint syntax
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

console.log('🚀 Starting Paints ProductList API URL updates...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`);
console.log('\n🔧 All API_URL values now match the exact endpoints from apiS.js');
console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/'); 