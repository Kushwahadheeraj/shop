const fs = require('fs');
const path = require('path');

// Function to recursively find all controller files
function findControllerFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findControllerFiles(filePath, fileList);
    } else if (file.endsWith('Controller.js') || file.endsWith('Controllers.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix category names and error responses
function fixController(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Extract category name from file path
    const fileName = path.basename(filePath);
    const categoryName = fileName.replace('Controller.js', '').replace('Controllers.js', '');
    
    // Convert to proper case
    const oldCategory = categoryName.charAt(0).toLowerCase() + categoryName.slice(1);
    const newCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    
    // Special cases for category names
    const categoryMappings = {
      'creacksJoints': 'CracksJoints',
      'patchFittings': 'PatchFittings',
      'morticeLocks': 'MorticeLocks',
      'mortiseLockBody': 'MortiseLockBody',
      'woodMetal': 'WoodMetal',
      'wallStickersWallpapers': 'WallStickersWallpapers',
      'tileGuard': 'TileGuard',
      'stainersThinners': 'StainersThinners',
      'sprayPaints': 'SprayPaints',
      'primerAndWallPutty': 'PrimerAndWallPutty',
      'paintingTools': 'PaintingTools',
      'interiorPaints': 'InteriorPaints',
      'industrialCoatings': 'IndustrialCoatings',
      'floorPaints': 'FloorPaints',
      'exteriorPaints': 'ExteriorPaints',
      'aspaPaints': 'AspaPaints',
      'acrylicEmulsionPaint': 'AcrylicEmulsionPaint',
      'allenKeys': 'AllenKeys',
      'carpenterPincer': 'CarpenterPincer',
      'centrePunches': 'CentrePunches',
      'gardenTools': 'GardenTools',
      'gearPullers': 'GearPullers',
      'glassCutter': 'GlassCutter',
      'greaseGun': 'GreaseGun',
      'hacksawBlades': 'HacksawBlades',
      'hammerDrills': 'HammerDrills',
      'handtools': 'Handtools',
      'lubrications': 'Lubrications',
      'measurementScale': 'MeasurementScale',
      'measuringTape': 'MeasuringTape',
      'polishingAccessories': 'PolishingAccessories',
      'powertools': 'Powertools',
      'screwDriver': 'ScrewDriver',
      'siliconGun': 'SiliconGun',
      'socketset': 'Socketset',
      'spareMalets': 'SpareMalets',
      'toolCompartments': 'ToolCompartments',
      'toolkitset': 'Toolkitset',
      'varioustoolbits': 'VariousToolBits',
      'woodChisel': 'WoodChisel',
      'woodItems': 'WoodItems',
      'washbasins': 'Washbasins',
      'kitchenSinks': 'KitchenSinks',
      'healthFaucet': 'HealthFaucet',
      'hardwareBathroomAccessories': 'HardwareBathroomAccessories',
      'bathroomAccessories': 'BathroomAccessories',
      'acrylicProducts': 'AcrylicProducts'
    };
    
    const finalOldCategory = categoryMappings[oldCategory] || oldCategory;
    const finalNewCategory = categoryMappings[newCategory] || newCategory;
    
    // Fix category in create function
    if (content.includes(`category: '${finalOldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${finalOldCategory}'`, 'g'), `category: '${finalNewCategory}'`);
      modified = true;
    }
    
    if (content.includes(`category: rest.category || '${finalOldCategory}'`)) {
      content = content.replace(new RegExp(`category: rest\.category \\|\\| '${finalOldCategory}'`, 'g'), `category: rest.category || '${finalNewCategory}'`);
      modified = true;
    }
    
    // Fix error response format
    if (content.includes('res.status(500).json({ message: err.message });')) {
      content = content.replace(/res\.status\(500\)\.json\(\{ message: err\.message \}\);/g, 'res.status(500).json({ error: err.message });');
      modified = true;
    }
    
    if (content.includes('res.status(404).json({ message: \'Not found\' });')) {
      content = content.replace(/res\.status\(404\)\.json\(\{ message: 'Not found' \}\);/g, 'res.status(404).json({ error: \'Not found\' });');
      modified = true;
    }
    
    // Fix model name mismatches in delete operations
    const modelMappings = {
      'Uncategorized': 'UncategorizedModels',
      'Lighting': 'LightingModels',
      'HomeDecor': 'HomeDecorModels',
      'Home': 'HomeModels',
      'Hardware': 'HardwareModels',
      'Fitting': 'FittingModels',
      'Fiber': 'FiberModels',
      'Brush': 'BrushModels',
      'Cleaning': 'CleaningModels',
      'Adhesives': 'AdhesivesModels',
      'Cements': 'CementsModels',
      'Dry': 'DryModels'
    };
    
    Object.entries(modelMappings).forEach(([oldModel, newModel]) => {
      if (content.includes(`${oldModel}.findByIdAndDelete`)) {
        content = content.replace(new RegExp(`${oldModel}\\.findByIdAndDelete`, 'g'), `${newModel}.findByIdAndDelete`);
        modified = true;
      }
    });
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔧 Fixing all remaining controllers...\n');

const controllersDir = path.join(__dirname, '../backend/controllers');
const allControllerFiles = findControllerFiles(controllersDir);

console.log(`Found ${allControllerFiles.length} controller files to check...\n`);

let fixedCount = 0;
allControllerFiles.forEach(filePath => {
  const relativePath = path.relative(controllersDir, filePath);
  if (fixController(filePath)) {
    console.log(`✅ Fixed: ${relativePath}`);
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} controllers successfully!`);
console.log(`📁 Total controllers processed: ${allControllerFiles.length}`);
