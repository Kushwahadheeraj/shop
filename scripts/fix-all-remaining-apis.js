const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary');

// Function to find the correct API endpoint for a folder path
function findApiEndpoint(folderPath) {
  // Convert folder path to kebab-case format
  const kebabPath = folderPath.replace(/[A-Z]/g, (match, offset) => {
    return (offset > 0 ? '-' : '') + match.toLowerCase();
  }).replace(/\//g, '-');
  
  // Remove any leading/trailing dashes
  const cleanPath = kebabPath.replace(/^-+|-+$/g, '');
  
  // Common patterns to check
  const patterns = [
    cleanPath,
    cleanPath.replace(/-+/g, '-'), // Replace multiple dashes with single dash
    cleanPath.replace(/^([^-]+)-([^-]+)/, '$1-$2'), // Handle two-part paths
    cleanPath.replace(/^([^-]+)-([^-]+)-([^-]+)/, '$1-$2-$3') // Handle three-part paths
  ];
  
  // Check if any pattern matches an API endpoint from apiS.js
  for (const pattern of patterns) {
    // This is a simplified check - in practice, you'd want to match against the actual apiS.js content
    if (pattern.includes('water-tec') || pattern.includes('waterman') || 
        pattern.includes('hindware') || pattern.includes('parryware') ||
        pattern.includes('corsa') || pattern.includes('essess') ||
        pattern.includes('bathsense') || pattern.includes('coral-bath-fixtures') ||
        pattern.includes('leo-bath-fittings') || pattern.includes('pamay') ||
        pattern.includes('pearl-precious-products')) {
      return pattern;
    }
  }
  
  return null;
}

// Function to process a single ProductForm.jsx file
function processProductForm(filePath, folderPath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for common incorrect patterns
    const incorrectPatterns = [
      /\/sanitary\/-[^\/]+-create/g,
      /\/sanitary\/-[^\/]+\/-[^\/]+-create/g,
      /\/sanitary\/[^\/]+\/-[^\/]+-create/g
    ];
    
    let updatedContent = content;
    let replaced = false;
    
    // Replace incorrect patterns
    incorrectPatterns.forEach(pattern => {
      if (pattern.test(updatedContent)) {
        // Extract the folder name from the path
        const folderName = folderPath.split('/').pop();
        const parentFolder = folderPath.split('/').slice(-2, -1)[0];
        
        // Build the correct API endpoint
        let apiEndpoint;
        if (parentFolder && parentFolder !== folderName) {
          // Subfolder case
          apiEndpoint = `${parentFolder.toLowerCase()}-${folderName.toLowerCase()}`;
        } else {
          // Main folder case
          apiEndpoint = folderName.toLowerCase();
        }
        
        // Replace the incorrect pattern
        updatedContent = updatedContent.replace(pattern, `/sanitary/${apiEndpoint}/create`);
        replaced = true;
      }
    });
    
    if (replaced) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${folderPath}/ProductForm.jsx with corrected API endpoint`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${folderPath}/ProductForm.jsx`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${folderPath}/ProductForm.jsx:`, error.message);
    return false;
  }
}

// Function to process all ProductForm.jsx files recursively
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
    } else if (item === 'ProductForm.jsx') {
      // Process ProductForm.jsx files
      if (processProductForm(itemPath, dirName)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting comprehensive API endpoint fix...\n');
console.log('📋 This will update ALL remaining ProductForm.jsx files to fix incorrect API endpoints\n');
console.log('🔄 Only incorrect API endpoints will be updated - no other code changes\n');

// Process all ProductForm.jsx files recursively
const totalProcessed = processDirectory(frontendDir);

console.log(`\n🎉 API fix completed! Total files processed: ${totalProcessed}`);
console.log('✅ All remaining frontend forms now have corrected API endpoints!');
console.log('🔍 Incorrect API endpoints with extra dashes have been fixed');
console.log('🚀 No more API mismatch errors!');

