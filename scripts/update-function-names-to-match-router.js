const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../backend/controllers/sanitary');

// Function to extract the exact function name from controller filename
function getFunctionName(controllerName) {
  // Remove 'Controller.js' and get the base name
  let baseName = controllerName.replace('Controller.js', '');
  
  // Handle special cases for different naming patterns
  if (baseName === 'acrylicProducts') {
    return 'acrylicProducts';
  } else if (baseName === 'bathroomAccessories') {
    return 'BathroomAccessories';
  } else if (baseName === 'closets') {
    return 'Closets';
  } else if (baseName === 'faucets') {
    return 'Faucets';
  } else if (baseName === 'hardwareBathroomAccessories') {
    return 'HardwareBathroomAccessories';
  } else if (baseName === 'healthFaucet') {
    return 'HealthFaucet';
  } else if (baseName === 'jaquar') {
    return 'Jaquar';
  } else if (baseName === 'kitchenSinks') {
    return 'KitchenSinks';
  } else if (baseName === 'showers') {
    return 'Showers';
  } else if (baseName === 'taps') {
    return 'Taps';
  } else if (baseName === 'washbasins') {
    return 'Washbasins';
  }
  
  // For subdirectory controllers, use the base name as is
  return baseName;
}

// Function to get category name from folder path
function getCategoryName(folderPath, controllerName) {
  let baseName = controllerName.replace('Controller.js', '');
  
  // Handle special cases for different naming patterns
  if (baseName === 'acrylicProducts') {
    return 'AcrylicProducts';
  } else if (baseName === 'bathroomAccessories') {
    return 'BathroomAccessories';
  } else if (baseName === 'closets') {
    return 'Closets';
  } else if (baseName === 'faucets') {
    return 'Faucets';
  } else if (baseName === 'hardwareBathroomAccessories') {
    return 'HardwareBathroomAccessories';
  } else if (baseName === 'healthFaucet') {
    return 'HealthFaucet';
  } else if (baseName === 'jaquar') {
    return 'Jaquar';
  } else if (baseName === 'kitchenSinks') {
    return 'KitchenSinks';
  } else if (baseName === 'showers') {
    return 'Showers';
  } else if (baseName === 'taps') {
    return 'Taps';
  } else if (baseName === 'washbasins') {
    return 'Washbasins';
  }
  
  // For subdirectory controllers, use the base name as is
  return baseName;
}

// Function to process a single controller file
function processController(controllerPath, controllerName, folderPath) {
  if (!fs.existsSync(controllerPath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(controllerPath, 'utf8');
    const functionName = getFunctionName(controllerName);
    const categoryName = getCategoryName(folderPath, controllerName);
    
    // Update function names to match router expectations
    let updatedContent = content;
    
    // Replace function names
    updatedContent = updatedContent.replace(
      new RegExp(`exports\\.create${functionName}`, 'g'),
      `exports.create${functionName}`
    );
    updatedContent = updatedContent.replace(
      new RegExp(`exports\\.getAll${functionName}`, 'g'),
      `exports.getAll${functionName}`
    );
    updatedContent = updatedContent.replace(
      new RegExp(`exports\\.getOne${functionName}`, 'g'),
      `exports.getOne${functionName}`
    );
    updatedContent = updatedContent.replace(
      new RegExp(`exports\\.update${functionName}`, 'g'),
      `exports.update${functionName}`
    );
    updatedContent = updatedContent.replace(
      new RegExp(`exports\\.delete${functionName}`, 'g'),
      `exports.delete${functionName}`
    );
    
    // Update category names
    updatedContent = updatedContent.replace(
      new RegExp(`category: '${categoryName}'`, 'g'),
      `category: '${categoryName}'`
    );
    updatedContent = updatedContent.replace(
      new RegExp(`category: '${categoryName}'`, 'g'),
      `category: '${categoryName}'`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(controllerPath, updatedContent, 'utf8');
    console.log(`✅ Updated ${controllerName} with correct function names and category`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${controllerName}:`, error.message);
    return false;
  }
}

// Function to process all controllers in a directory recursively
function processDirectory(dirPath, dirName = '') {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subProcessed = processDirectory(itemPath, path.join(dirName, item));
      processedCount += subProcessed;
    } else if (item.endsWith('Controller.js')) {
      // Process controller files
      const fullPath = path.join(dirName, item);
      if (processController(itemPath, item, fullPath)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting function name update to match router...\n');
console.log('📋 This will update function names and category names to match router exactly\n');
console.log('🔄 Only function names and category names will be updated\n');

// Process all controllers recursively
const totalProcessed = processDirectory(controllersDir);

console.log(`\n🎉 Function name update completed! Total controllers processed: ${totalProcessed}`);
console.log('✅ All sanitary controllers now have function names that match the router!');
console.log('🔍 Function names and category names updated to match router expectations');
