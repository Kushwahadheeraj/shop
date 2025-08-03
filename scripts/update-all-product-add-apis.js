const fs = require('fs');
const path = require('path');

// Function to get the correct API endpoint based on folder structure
function getCorrectApiEndpoint(folderPath) {
  const parts = folderPath.split('\\');
  
  // Convert folder path to API endpoint format
  let apiPath = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Handle special cases for casing
    if (i === 0) {
      // Main category - convert to lowercase
      apiPath = part.toLowerCase();
    } else {
      // Subfolders - handle special casing rules
      let subfolder = part;
      
      // Special cases for Electrical subfolders
      if (parts[0].toLowerCase() === 'electrical') {
        switch (part.toLowerCase()) {
          case 'ceilingroses': subfolder = 'ceilingRoses'; break;
          case 'distributionboards': subfolder = 'distributionBoards'; break;
          case 'doorbells': subfolder = 'doorBells'; break;
          case 'dpswitch': subfolder = 'dPswitch'; break;
          case 'earthingaccessories': subfolder = 'earthingAccessories'; break;
          case 'elcbsrccbs': subfolder = 'eLCBsRCCBs'; break;
          case 'flexibleconduit': subfolder = 'flexibleConduit'; break;
          case 'flexiblewires': subfolder = 'flexibleWires'; break;
          case 'fusecarriers': subfolder = 'fuseCarriers'; break;
          case 'insulationtapes': subfolder = 'insulationTapes'; break;
          case 'kitkatfuses': subfolder = 'kITKATFuses'; break;
          case 'mainswitch': subfolder = 'mainSwitch'; break;
          case 'mcb': subfolder = 'mCB'; break;
          case 'modularsurfacebox': subfolder = 'modularSurfaceBox'; break;
          case 'motorstarters': subfolder = 'motorStarters'; break;
          case 'powerstrips': subfolder = 'powerStrips'; break;
          case 'pvcclips': subfolder = 'pvCClips'; break;
          case 'rotaryswitch': subfolder = 'rotarySwitch'; break;
          case 'switchandsocket': subfolder = 'switchAndSocket'; break;
          case 'switchplates': subfolder = 'switchPlates'; break;
          case 'traveladaptor': subfolder = 'travelAdaptor'; break;
          case 'tvoutlets': subfolder = 'tVOutlets'; break;
          case 'uniswitch': subfolder = 'uniSwitch'; break;
          case 'waterheater': subfolder = 'waterHeater'; break;
          case 'waterheaters': subfolder = 'waterHeater'; break;
          case 'wiresandcables': subfolder = 'wiresAndCables'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for Paint subfolders
      if (parts[0].toLowerCase() === 'paint') {
        switch (part.toLowerCase()) {
          case 'acrylicemulsionpaint': subfolder = 'acrylic-emulsion-paint'; break;
          case 'aspapaints': subfolder = 'aspa-paints'; break;
          case 'exteriorpaints': subfolder = 'exterior-paints'; break;
          case 'floorpaints': subfolder = 'floor-paints'; break;
          case 'industrialcoatings': subfolder = 'industrial-coatings'; break;
          case 'interiorpaints': subfolder = 'interior-paints'; break;
          case 'paintingtools': subfolder = 'painting-tools'; break;
          case 'spraypaints': subfolder = 'spray-paints'; break;
          case 'tileguard': subfolder = 'tile-guard'; break;
          case 'wallstickerswallpapers': subfolder = 'wall-stickers-wallpapers'; break;
          case 'woodmetal': subfolder = 'wood-metal'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for Pipe subfolders
      if (parts[0].toLowerCase() === 'pipe') {
        switch (part.toLowerCase()) {
          case 'finolexpipes': subfolder = 'finolex-pipes'; break;
          case 'ashirvadpipes': subfolder = 'ashirvad-pipes'; break;
          case 'astralpipes': subfolder = 'astral-pipes'; break;
          case 'nepulpipes': subfolder = 'nepul-pipes'; break;
          case 'birlapipes': subfolder = 'birla-pipes'; break;
          case 'princepipes': subfolder = 'prince-pipes'; break;
          case 'prakashpipes': subfolder = 'prakash-pipes'; break;
          case 'supremepipes': subfolder = 'supreme-pipes'; break;
          case 'tatapipes': subfolder = 'tata-pipes'; break;
          case 'tsapipes': subfolder = 'tsa-pipes'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for PvcMats subfolders
      if (parts[0].toLowerCase() === 'pvcmats') {
        switch (part.toLowerCase()) {
          case 'door': subfolder = 'door'; break;
          case 'floor': subfolder = 'floor'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for Roofer subfolders
      if (parts[0].toLowerCase() === 'roofer') {
        switch (part.toLowerCase()) {
          case 'metal': subfolder = 'metal'; break;
          case 'shingles': subfolder = 'shingles'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for WaterProofing subfolders
      if (parts[0].toLowerCase() === 'waterproofing') {
        switch (part.toLowerCase()) {
          case 'bathrooms': subfolder = 'bathroom'; break;
          case 'cracksjoints': subfolder = 'creacks-joints'; break;
          case 'interiors': subfolder = 'interiors'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for Tools subfolders
      if (parts[0].toLowerCase() === 'tools') {
        switch (part.toLowerCase()) {
          case 'allenkeys': subfolder = 'allen-keys'; break;
          case 'carpenterpincer': subfolder = 'carpenter-pincer'; break;
          case 'centrepunches': subfolder = 'centre-punches'; break;
          case 'gardentools': subfolder = 'garden-tools'; break;
          case 'gearpullers': subfolder = 'gear-pullers'; break;
          case 'glasscutter': subfolder = 'glass-cutter'; break;
          case 'greasegun': subfolder = 'grease-gun'; break;
          case 'hacksawblades': subfolder = 'hacksaw-blades'; break;
          case 'hammerdrills': subfolder = 'hammer-drlls'; break;
          case 'measurementscale': subfolder = 'measurement-scale'; break;
          case 'measuringtape': subfolder = 'measuring-tape'; break;
          case 'polishingaccessories': subfolder = 'polishing-accessories'; break;
          case 'screwdriver': subfolder = 'screw-driver'; break;
          case 'silicongun': subfolder = 'silicon-gun'; break;
          case 'sparemalets': subfolder = 'spare-malets'; break;
          case 'toolcompartments': subfolder = 'tool-compartments'; break;
          case 'varioustoolbits': subfolder = 'various-tool-bits'; break;
          case 'woodchisel': subfolder = 'wood-chisel'; break;
          case 'wooditems': subfolder = 'wood-items'; break;
          default: subfolder = part; break;
        }
      }
      
      // Special cases for Home subfolders
      if (parts[0].toLowerCase() === 'home') {
        switch (part.toLowerCase()) {
          case 'cardslider': subfolder = 'cardSlider'; break;
          default: subfolder = part; break;
        }
      }
      
      apiPath += '/' + subfolder;
    }
  }
  
  return apiPath + '/create';
}

// Find all ProductForm.jsx files recursively
function findAllProductFormFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Check if this directory has a ProductForm.jsx file
      const productFormPath = path.join(fullPath, 'ProductForm.jsx');
      if (fs.existsSync(productFormPath)) {
        files.push({
          fullPath: productFormPath,
          folderPath: relativePath
        });
      }
      // Recursively search subdirectories
      files.push(...findAllProductFormFiles(fullPath, relativePath));
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
        console.log(`📝 Updating ${folderPath}:`);
        console.log(`   From: ${currentEndpoint}`);
        console.log(`   To:   ${correctEndpoint}`);
        
        // Replace the endpoint
        content = content.replace(
          `\`\${API_BASE_URL}/${currentEndpoint}\``,
          `\`\${API_BASE_URL}/${correctEndpoint}\``
        );
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   ✅ Updated successfully\n`);
        return true;
      } else {
        console.log(`✅ ${folderPath}: Already correct (${currentEndpoint})\n`);
        return false;
      }
    } else {
      console.log(`❌ ${folderPath}: Could not find API endpoint pattern\n`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error updating ${folderPath}: ${error.message}\n`);
    return false;
  }
}

// Main function
function main() {
  console.log('🚀 Starting comprehensive API endpoint update for ALL ProductAdd files...\n');
  
  const productAddDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd');
  
  if (!fs.existsSync(productAddDir)) {
    console.log('❌ ProductAdd directory not found!');
    return;
  }
  
  const files = findAllProductFormFiles(productAddDir);
  console.log(`📁 Found ${files.length} ProductForm.jsx files\n`);
  
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const correctEndpoint = getCorrectApiEndpoint(file.folderPath);
    
    if (correctEndpoint) {
      const wasUpdated = updateApiEndpoint(file.fullPath, file.folderPath, correctEndpoint);
      if (wasUpdated) {
        updatedCount++;
      } else {
        skippedCount++;
      }
    } else {
      console.log(`⚠️  ${file.folderPath}: Could not determine API endpoint\n`);
      errorCount++;
    }
  }
  
  console.log('📊 Summary:');
  console.log(`   ✅ Updated: ${updatedCount} files`);
  console.log(`   ⏭️  Skipped: ${skippedCount} files (already correct)`);
  console.log(`   ❌ Errors: ${errorCount} files (could not determine endpoint)`);
  console.log(`   📁 Total: ${files.length} files processed`);
  
  if (errorCount > 0) {
    console.log('\n⚠️  Some files could not be updated. Check the mappings above.');
  }
  
  console.log('\n🎉 API endpoint update completed!');
}

// Run the script
main(); 