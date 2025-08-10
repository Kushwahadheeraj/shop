const fs = require('fs');
const path = require('path');

// Function to fix template variables in a controller file
function fixTemplateVariables(filePath, controllerName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix template variables
    if (content.includes('${controllerName}')) {
      content = content.replace(/\$\{controllerName\}/g, controllerName);
      modified = true;
      console.log(`✅ Fixed template variables in ${path.basename(filePath)}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`📝 Updated ${path.basename(filePath)}`);
    } else {
      console.log(`✅ ${path.basename(filePath)} is already fixed`);
    }

  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all controller files
function fixAllControllers(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixAllControllers(fullPath);
    } else if (item.endsWith('Controller.js') || item.endsWith('Controllers.js')) {
      // Extract controller name from filename
      let controllerName = item.replace(/Controller\.js$/, '').replace(/Controllers\.js$/, '');
      
      // Handle special cases
      if (controllerName === 'mortiseLockBody') controllerName = 'MortiseLockBody';
      else if (controllerName === 'morticeLocks') controllerName = 'MorticeLocks';
      else if (controllerName === 'patchFittings') controllerName = 'PatchFittings';
      else if (controllerName === 'popularMortiseSeries') controllerName = 'PopularMortiseSeries';
      else if (controllerName === 'premiumMortiseSeries') controllerName = 'PremiumMortiseSeries';
      else if (controllerName === 'leverMortiseLocks') controllerName = 'LeverMortiseLocks';
      else if (controllerName === 'glassHardware') controllerName = 'GlassHardware';
      else if (controllerName === 'rimLocks') controllerName = 'RimLocks';
      else if (controllerName === 'padlocks') controllerName = 'Padlocks';
      else if (controllerName === 'furnitureFittings') controllerName = 'FurnitureFittings';
      else if (controllerName === 'foldingBrackets') controllerName = 'FoldingBrackets';
      else if (controllerName === 'doorAccessories') controllerName = 'DoorAccessories';
      else if (controllerName === 'doorControls') controllerName = 'DoorControls';
      else if (controllerName === 'doorHandles') controllerName = 'DoorHandles';
      else if (controllerName === 'doorLocks') controllerName = 'DoorLocks';
      
      console.log(`\n🔧 Processing ${item} (${controllerName})...`);
      fixTemplateVariables(fullPath, controllerName);
    }
  }
}

// Main execution
console.log('🚀 Starting fix of template variables in all locks controllers...\n');

const locksControllersDir = path.join(__dirname, '..', 'backend', 'controllers', 'locks');
fixAllControllers(locksControllersDir);

console.log('\n✨ All controllers have been processed!');
console.log('\n📋 Summary of fixes applied:');
console.log('   ✅ Fixed ${controllerName} template variables');
console.log('   ✅ Replaced with actual controller names');
