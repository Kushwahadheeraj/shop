const fs = require('fs');
const path = require('path');

// List of directories that contain pages that should be dynamic
const dynamicDirs = [
  'app/Dashboard/ProductAdd',
  'app/Dashboard/ProductList', 
  'app/ShopPage'
];

// Function to fix ALL duplicate declarations in a page file
function fixAllDuplicates(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for any duplicates
    const dynamicMatches = content.match(/export const dynamic = "force-dynamic";/g);
    const runtimeMatches = content.match(/export const runtime = "nodejs";/g);
    const revalidateMatches = content.match(/export const revalidate = 0;/g);
    
    if ((dynamicMatches && dynamicMatches.length > 1) || 
        (runtimeMatches && runtimeMatches.length > 1) || 
        (revalidateMatches && revalidateMatches.length > 1)) {
      console.log(`🔧 Fixing ALL duplicates in: ${filePath}`);
      
      // Remove ALL dynamic-related exports and comments
      let newContent = content
        .replace(/\/\/ Force dynamic rendering to prevent build timeouts\s*/g, '')
        .replace(/export const dynamic = "force-dynamic";\s*/g, '')
        .replace(/export const runtime = "nodejs";\s*/g, '')
        .replace(/export const revalidate = 0;\s*/g, '');
      
      // Clean up extra whitespace and empty lines
      newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
      newContent = newContent.replace(/\n\s*\n$/g, '\n');
      
      // Add single dynamic configuration at the end
      newContent = newContent.trim() + '\n\n// Force dynamic rendering to prevent build timeouts\nexport const dynamic = "force-dynamic";\nexport const runtime = "nodejs";\nexport const revalidate = 0;';
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed ALL duplicates in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively process directories
function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processDirectory(fullPath);
      } else if (item === 'page.js') {
        fixAllDuplicates(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Process all dynamic directories
console.log('🚀 Fixing ALL duplicate declarations...');

for (const dir of dynamicDirs) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing directory: ${dir}`);
    processDirectory(dir);
  } else {
    console.log(`⚠️ Directory not found: ${dir}`);
  }
}

console.log('✅ ALL duplicate declarations fixed!');
