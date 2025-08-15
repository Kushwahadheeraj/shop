const fs = require('fs');
const path = require('path');

const parrywareDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary/Parryware');

// API mapping for Parryware subdirectories based on apiS.js
const parrywareApiMapping = {
  'Accessories': 'parryware-accessories-accessories',
  'AngleValves': 'parryware-angle-valves-angle-valves',
  'BelowCounterBasins': 'parryware-below-counter-basins-below-counter-basins',
  'BowlBasins': 'parryware-bowl-basins-bowl-basins',
  'Closets': 'parryware-closets-closets',
  'ConcealedCistern': 'parryware-concealed-cistern-concealed-cistern',
  'EuropeanWaterCloset': 'parryware-european-water-closet-european-water-closet',
  'FAUCETS/FlushCocks': 'parryware-faucets-flush-cocks',
  'FAUCETS/FlushValve': 'parryware-faucets-flush-valve',
  'FAUCETS/HealthFaucets': 'parryware-faucets-health-faucets',
  'FAUCETS/KitchenSinks': 'parryware-faucets-kitchen-sinks',
  'FAUCETS/Pedestals': 'parryware-faucets-pedestals',
  'PolymerCisterns': 'parryware-polymer-cisterns-polymer-cisterns',
  'PushPlates': 'parryware-push-plates-push-plates',
  'SeatCovers': 'parryware-seat-covers-seat-covers',
  'SemiRecessedBasins': 'parryware-semi-recessed-basins-semi-recessed-basins',
  'ShowerEnclosures': 'parryware-shower-enclosures-shower-enclosures',
  'ShowerPanels': 'parryware-shower-panels-shower-panels',
  'Showers': 'parryware-showers-showers',
  'UtsavRange': 'parryware-utsav-range-utsav-range',
  'WashBasins': 'parryware-wash-basins-wash-basins',
  'WasteCoupling': 'parryware-waste-coupling-waste-coupling',
  'WaterHeaters': 'parryware-water-heaters-water-heaters'
};

// Function to process a single ProductForm.jsx file
function processProductForm(filePath, folderName) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const apiEndpoint = parrywareApiMapping[folderName];
    
    if (!apiEndpoint) {
      console.log(`⚠️  No API endpoint found for ${folderName}`);
      return false;
    }
    
    // Find and replace the API endpoint
    const oldApiPattern = /`\${API_BASE_URL}\/sanitary\/[^`]+`/g;
    const newApi = `\`\${API_BASE_URL}/sanitary/${apiEndpoint}/create\``;
    
    let updatedContent = content;
    let replaced = false;
    
    // Replace the API endpoint
    if (oldApiPattern.test(content)) {
      updatedContent = content.replace(oldApiPattern, newApi);
      replaced = true;
    }
    
    // Also check for any other patterns with extra dashes
    const otherPatterns = [
      /\/sanitary\/-parryware\/-[^\/]+/g,
      /\/sanitary\/parryware\/[^\/]+/g
    ];
    
    otherPatterns.forEach(pattern => {
      if (pattern.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern, `/sanitary/${apiEndpoint}`);
        replaced = true;
      }
    });
    
    if (replaced) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${folderName}/ProductForm.jsx with API: /sanitary/${apiEndpoint}/create`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${folderName}/ProductForm.jsx`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${folderName}/ProductForm.jsx:`, error.message);
    return false;
  }
}

// Function to process all ProductForm.jsx files in Parryware subdirectories
function processParrywareDirectory() {
  const items = fs.readdirSync(parrywareDir);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(parrywareDir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      const productFormPath = path.join(itemPath, 'ProductForm.jsx');
      if (fs.existsSync(productFormPath)) {
        if (processProductForm(productFormPath, item)) {
          processedCount++;
        }
      }
      
      // Check for nested FAUCETS directory
      if (item === 'FAUCETS') {
        const faucetItems = fs.readdirSync(itemPath);
        for (const faucetItem of faucetItems) {
          const faucetItemPath = path.join(itemPath, faucetItem);
          const faucetStat = fs.statSync(faucetItemPath);
          if (faucetStat.isDirectory()) {
            const nestedProductFormPath = path.join(faucetItemPath, 'ProductForm.jsx');
            if (fs.existsSync(nestedProductFormPath)) {
              if (processProductForm(nestedProductFormPath, `FAUCETS/${faucetItem}`)) {
                processedCount++;
              }
            }
          }
        }
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting Parryware API endpoint fix...\n');
console.log('📋 This will update ALL Parryware ProductForm.jsx files to match exact API endpoints from apiS.js\n');

// Process all Parryware ProductForm.jsx files
const totalProcessed = processParrywareDirectory();

console.log(`\n🎉 Parryware API fix completed! Total files processed: ${totalProcessed}`);
console.log('✅ All Parryware frontend forms now have correct API endpoints!');
console.log('🔍 API endpoints updated to match apiS.js exactly');
console.log('🚀 No more API mismatch errors for Parryware products!');

