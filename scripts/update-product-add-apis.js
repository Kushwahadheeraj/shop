const fs = require('fs');
const path = require('path');

// API endpoints mapping
const API_ENDPOINTS = {
  // Simple folders
  'Adhesives': 'adhesives/create',
  'Brush': 'brush/create',
  'Cements': 'cements/create',
  'Cleaning': 'cleaning/create',
  'Dry': 'dry/create',
  'Fiber': 'fiber/create',
  'Fitting': 'fitting/create',
  'Hardware': 'hardware/create',
  'HomeDecor': 'homedecor/create',
  'Uncategorized': 'uncategorized/create',
  'WaterProofing': 'waterproofing/create',
  'Tools': 'tools/create',
  'Sanitary': 'sanitary/create',
  'Roofer': 'roofer/create',
  'PvcMats': 'pvcmats/create',
  'Pipe': 'pipe/create',
  'Locks': 'locks/create',

  // Electrical subfolders
  'Electrical/Adaptors': 'electrical/adaptors/create',
  'Electrical/CeilingRoses': 'electrical/ceilingRoses/create',
  'Electrical/Dimmer': 'electrical/dimmer/create',
  'Electrical/DistributionBoards': 'electrical/distributionBoards/create',
  'Electrical/DoorBells': 'electrical/doorBells/create',
  'Electrical/DPswitch': 'electrical/dPswitch/create',
  'Electrical/EarthingAccessories': 'electrical/earthingAccessories/create',
  'Electrical/ELCBsRCCBs': 'electrical/eLCBsRCCBs/create',
  'Electrical/FlexibleConduit': 'electrical/flexibleConduit/create',
  'Electrical/FlexibleWires': 'electrical/flexibleWires/create',
  'Electrical/FuseCarriers': 'electrical/fuseCarriers/create',
  'Electrical/Holders': 'electrical/holders/create',
  'Electrical/Indicator': 'electrical/indicator/create',
  'Electrical/InsulationTapes': 'electrical/insulationTapes/create',
  'Electrical/Isolators': 'electrical/isolators/create',
  'Electrical/Jacks': 'electrical/jacks/create',
  'Electrical/KITKATFuses': 'electrical/kITKATFuses/create',
  'Electrical/MainSwitch': 'electrical/mainSwitch/create',
  'Electrical/MCB': 'electrical/mCB/create',
  'Electrical/ModularSurfaceBox': 'electrical/modularSurfaceBox/create',
  'Electrical/Motors': 'electrical/motors/create',
  'Electrical/MotorStarters': 'electrical/motorStarters/create',
  'Electrical/Others': 'electrical/others/create',
  'Electrical/PinTop': 'electrical/pinTop/create',
  'Electrical/Plug': 'electrical/plug/create',
  'Electrical/PowerStrips': 'electrical/powerStrips/create',
  'Electrical/PVCClips': 'electrical/pvCClips/create',
  'Electrical/Regulators': 'electrical/regulators/create',
  'Electrical/RotarySwitch': 'electrical/rotarySwitch/create',
  'Electrical/Sockets': 'electrical/sockets/create',
  'Electrical/SwitchAndSocket': 'electrical/switchAndSocket/create',
  'Electrical/Switches': 'electrical/switches/create',
  'Electrical/SwitchPlates': 'electrical/switchPlates/create',
  'Electrical/TravelAdaptor': 'electrical/travelAdaptor/create',
  'Electrical/TVOutlets': 'electrical/tVOutlets/create',
  'Electrical/UniSwitch': 'electrical/uniSwitch/create',
  'Electrical/WaterHeater': 'electrical/waterHeater/create',
  'Electrical/WaterHeaters': 'electrical/waterHeater/create',
  'Electrical/WiresAndCables': 'electrical/wiresAndCables/create',

  // Paint subfolders
  'Paint/AcrylicEmulsionPaint': 'paint/acrylic-emulsion-paint/create',
  'Paint/AdhesiveThinner/Adhesive': 'paint/adhesive-thinner-adhesive/create',
  'Paint/AdhesiveThinner/Thinner': 'paint/adhesive-thinner-thinner/create',
  'Paint/AspaPaints': 'paint/aspa-paints/create',
  'Paint/ExteriorPaints': 'paint/exterior-paints/create',
  'Paint/FloorPaints': 'paint/floor-paints/create',
  'Paint/IndustrialCoatings': 'paint/industrial-coatings/create',
  'Paint/InteriorPaints': 'paint/interior-paints/create',
  'Paint/PaintingTools': 'paint/painting-tools/create',
  'Paint/Sanitizer': 'paint/sanitizer/create',
  'Paint/SprayPaints': 'paint/spray-paints/create',
  'Paint/Stencils': 'paint/stencils/create',
  'Paint/TileGuard': 'paint/tile-guard/create',
  'Paint/WallStickersWallpapers': 'paint/wall-stickers-wallpapers/create',
  'Paint/WoodMetal': 'paint/wood-metal/create',
};

// Find all ProductForm.jsx files
function findProductFormFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const productFormPath = path.join(fullPath, 'ProductForm.jsx');
      if (fs.existsSync(productFormPath)) {
        files.push({
          fullPath: productFormPath,
          folderPath: relativePath
        });
      }
      files.push(...findProductFormFiles(fullPath, relativePath));
    }
  }
  
  return files;
}

// Update API endpoint in file
function updateApiEndpoint(filePath, folderPath, correctEndpoint) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const apiRegex = /const res = await fetch\(\`\$\{API_BASE_URL\}\/([^`]+)\`, \{ method: ['"]POST['"]/;
    const match = content.match(apiRegex);
    
    if (match) {
      const currentEndpoint = match[1];
      if (currentEndpoint !== correctEndpoint) {
        console.log(`📝 Updating ${folderPath}: ${currentEndpoint} → ${correctEndpoint}`);
        content = content.replace(
          `\`\${API_BASE_URL}/${currentEndpoint}\``,
          `\`\${API_BASE_URL}/${correctEndpoint}\``
        );
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
      } else {
        console.log(`✅ ${folderPath}: Already correct`);
        return false;
      }
    } else {
      console.log(`❌ ${folderPath}: Could not find API endpoint`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error updating ${folderPath}: ${error.message}`);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Starting API endpoint update...\n');
  
  const productAddDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd');
  const files = findProductFormFiles(productAddDir);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const correctEndpoint = API_ENDPOINTS[file.folderPath];
    
    if (correctEndpoint) {
      const wasUpdated = updateApiEndpoint(file.fullPath, file.folderPath, correctEndpoint);
      if (wasUpdated) updatedCount++;
      else skippedCount++;
    } else {
      console.log(`⚠️  ${file.folderPath}: No mapping found`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Summary: Updated ${updatedCount}, Skipped ${skippedCount}, Errors ${errorCount}`);
}

main(); 