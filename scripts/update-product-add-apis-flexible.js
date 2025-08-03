const fs = require('fs');
const path = require('path');

// Function to normalize folder names for matching
function normalizeFolderName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1$2');
}

// Function to find the correct API endpoint for a folder
function findApiEndpoint(folderPath) {
  const parts = folderPath.split('\\');
  const category = parts[0];
  
  // Simple folders
  if (parts.length === 1) {
    const simpleMappings = {
      'adhesives': 'adhesives/create',
      'brush': 'brush/create',
      'cements': 'cements/create',
      'cleaning': 'cleaning/create',
      'dry': 'dry/create',
      'fiber': 'fiber/create',
      'fitting': 'fitting/create',
      'hardware': 'hardware/create',
      'homedecor': 'homedecor/create',
      'uncategorized': 'uncategorized/create',
      'waterproofing': 'waterproofing/create',
      'tools': 'tools/create',
      'sanitary': 'sanitary/create',
      'roofer': 'roofer/create',
      'pvcmats': 'pvcmats/create',
      'pipe': 'pipe/create',
      'locks': 'locks/create',
    };
    return simpleMappings[category.toLowerCase()];
  }
  
  // Electrical subfolders
  if (category.toLowerCase() === 'electrical' && parts.length === 2) {
    const subfolder = parts[1].toLowerCase();
    const electricalMappings = {
      'adaptors': 'electrical/adaptors/create',
      'ceilingroses': 'electrical/ceilingRoses/create',
      'dimmer': 'electrical/dimmer/create',
      'distributionboards': 'electrical/distributionBoards/create',
      'doorbells': 'electrical/doorBells/create',
      'dpswitch': 'electrical/dPswitch/create',
      'earthingaccessories': 'electrical/earthingAccessories/create',
      'elcbsrccbs': 'electrical/eLCBsRCCBs/create',
      'flexibleconduit': 'electrical/flexibleConduit/create',
      'flexiblewires': 'electrical/flexibleWires/create',
      'fusecarriers': 'electrical/fuseCarriers/create',
      'holders': 'electrical/holders/create',
      'indicator': 'electrical/indicator/create',
      'insulationtapes': 'electrical/insulationTapes/create',
      'isolators': 'electrical/isolators/create',
      'jacks': 'electrical/jacks/create',
      'kitkatfuses': 'electrical/kITKATFuses/create',
      'mainswitch': 'electrical/mainSwitch/create',
      'mcb': 'electrical/mCB/create',
      'modularsurfacebox': 'electrical/modularSurfaceBox/create',
      'motors': 'electrical/motors/create',
      'motorstarters': 'electrical/motorStarters/create',
      'others': 'electrical/others/create',
      'pintop': 'electrical/pinTop/create',
      'plug': 'electrical/plug/create',
      'powerstrips': 'electrical/powerStrips/create',
      'pvcclips': 'electrical/pvCClips/create',
      'regulators': 'electrical/regulators/create',
      'rotaryswitch': 'electrical/rotarySwitch/create',
      'sockets': 'electrical/sockets/create',
      'switchandsocket': 'electrical/switchAndSocket/create',
      'switches': 'electrical/switches/create',
      'switchplates': 'electrical/switchPlates/create',
      'traveladaptor': 'electrical/travelAdaptor/create',
      'tvoutlets': 'electrical/tVOutlets/create',
      'uniswitch': 'electrical/uniSwitch/create',
      'waterheater': 'electrical/waterHeater/create',
      'waterheaters': 'electrical/waterHeater/create',
      'wiresandcables': 'electrical/wiresAndCables/create',
    };
    return electricalMappings[subfolder];
  }
  
  // Paint subfolders
  if (category.toLowerCase() === 'paint') {
    if (parts.length === 2) {
      const subfolder = parts[1].toLowerCase();
      const paintMappings = {
        'acrylicemulsionpaint': 'paint/acrylic-emulsion-paint/create',
        'aspapaints': 'paint/aspa-paints/create',
        'exteriorpaints': 'paint/exterior-paints/create',
        'floorpaints': 'paint/floor-paints/create',
        'industrialcoatings': 'paint/industrial-coatings/create',
        'interiorpaints': 'paint/interior-paints/create',
        'paintingtools': 'paint/painting-tools/create',
        'sanitizer': 'paint/sanitizer/create',
        'spraypaints': 'paint/spray-paints/create',
        'stencils': 'paint/stencils/create',
        'tileguard': 'paint/tile-guard/create',
        'wallstickerswallpapers': 'paint/wall-stickers-wallpapers/create',
        'woodmetal': 'paint/wood-metal/create',
      };
      return paintMappings[subfolder];
    }
  }
  
  // Pipe subfolders
  if (category.toLowerCase() === 'pipe' && parts.length === 2) {
    const subfolder = parts[1].toLowerCase();
    const pipeMappings = {
      'finolexpipes': 'pipe/finolex-pipes/create',
      'ashirvadpipes': 'pipe/ashirvad-pipes/create',
      'astralpipes': 'pipe/astral-pipes/create',
      'nepulpipes': 'pipe/nepul-pipes/create',
      'birlapipes': 'pipe/birla-pipes/create',
      'princepipes': 'pipe/prince-pipes/create',
      'prakashpipes': 'pipe/prakash-pipes/create',
      'supremepipes': 'pipe/supreme-pipes/create',
      'tatapipes': 'pipe/tata-pipes/create',
      'tsapipes': 'pipe/tsa-pipes/create',
    };
    return pipeMappings[subfolder];
  }
  
  // PvcMats subfolders
  if (category.toLowerCase() === 'pvcmats' && parts.length === 2) {
    const subfolder = parts[1].toLowerCase();
    const pvcMappings = {
      'door': 'pvcmats/door/create',
      'floor': 'pvcmats/floor/create',
    };
    return pvcMappings[subfolder];
  }
  
  // Roofer subfolders
  if (category.toLowerCase() === 'roofer' && parts.length === 2) {
    const subfolder = parts[1].toLowerCase();
    const rooferMappings = {
      'metal': 'roofer/metal/create',
      'shingles': 'roofer/shingles/create',
    };
    return rooferMappings[subfolder];
  }
  
  // WaterProofing subfolders
  if (category.toLowerCase() === 'waterproofing' && parts.length === 2) {
    const subfolder = parts[1].toLowerCase();
    const waterproofingMappings = {
      'bathrooms': 'waterproofing/bathroom/create',
      'cracksjoints': 'waterproofing/creacks-joints/create',
      'interiors': 'waterproofing/interiors/create',
    };
    return waterproofingMappings[subfolder];
  }
  
  // Tools subfolders
  if (category.toLowerCase() === 'tools') {
    if (parts.length === 2) {
      const subfolder = parts[1].toLowerCase();
      const toolsMappings = {
        'allenkeys': 'tools/allen-keys/create',
        'brush': 'tools/brush/create',
        'carpenterpincer': 'tools/carpenter-pincer/create',
        'centrepunches': 'tools/centre-punches/create',
        'chisels': 'tools/chisels/create',
        'clamps': 'tools/clamps/create',
        'cutters': 'tools/cutters/create',
        'files': 'tools/files/create',
        'gardentools': 'tools/garden-tools/create',
        'gearpullers': 'tools/gear-pullers/create',
        'glasscutter': 'tools/glass-cutter/create',
        'gluegun': 'tools/gluegun/create',
        'greasegun': 'tools/grease-gun/create',
        'hacksawblades': 'tools/hacksaw-blades/create',
        'hammer': 'tools/hammer/create',
        'hammerdrills': 'tools/hammer-drlls/create',
        'handtools': 'tools/handtools/create',
        'level': 'tools/level/create',
        'lubrications': 'tools/lubrications/create',
        'measurementscale': 'tools/measurement-scale/create',
        'measuringtape': 'tools/measuring-tape/create',
        'multimeter': 'tools/multimeter/create',
        'plier': 'tools/plier/create',
        'polishingaccessories': 'tools/polishing-accessories/create',
        'saw': 'tools/saw/create',
        'screwdriver': 'tools/screw-driver/create',
        'silicongun': 'tools/silicon-gun/create',
        'socketset': 'tools/socketset/create',
        'spanners': 'tools/spanners/create',
        'sparemalets': 'tools/spare-malets/create',
        'toolcompartments': 'tools/tool-compartments/create',
        'toolkitset': 'tools/toolkitset/create',
        'varioustoolbits': 'tools/various-tool-bits/create',
        'woodchisel': 'tools/wood-chisel/create',
        'wooditems': 'tools/wood-items/create',
        'wrench': 'tools/wrench/create',
      };
      return toolsMappings[subfolder];
    }
  }
  
  // Home subfolders
  if (category.toLowerCase() === 'home' && parts.length === 2) {
    const subfolder = parts[1].toLowerCase();
    const homeMappings = {
      'brands': 'home/brands/create',
      'card': 'home/card/create',
      'cardslider': 'home/cardSlider/create',
      'categories': 'home/categories/create',
      'electrical': 'home/electrical/create',
      'items': 'home/items/create',
      'paints': 'home/paints/create',
      'service': 'home/service/create',
      'tools': 'home/tools/create',
    };
    return homeMappings[subfolder];
  }
  
  return null;
}

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
  console.log('🚀 Starting flexible API endpoint update...\n');
  
  const productAddDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd');
  const files = findProductFormFiles(productAddDir);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const correctEndpoint = findApiEndpoint(file.folderPath);
    
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