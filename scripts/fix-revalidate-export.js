const fs = require('fs');
const path = require('path');

// List of directories that contain pages that should be dynamic
const dynamicDirs = [
  'app/Dashboard/ProductAdd',
  'app/Dashboard/ProductList', 
  'app/ShopPage'
];

// Function to fix revalidate export in a page file
function fixRevalidateExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if revalidate is set to 0 and change it to false
    if (content.includes('export const revalidate = 0;')) {
      console.log(`🔧 Fixing revalidate export in: ${filePath}`);
      
      // Replace revalidate = 0 with revalidate = false
      const newContent = content.replace('export const revalidate = 0;', 'export const revalidate = false;');
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed revalidate export in: ${filePath}`);
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
        fixRevalidateExport(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Process all dynamic directories
console.log('🚀 Fixing revalidate export issues...');

for (const dir of dynamicDirs) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing directory: ${dir}`);
    processDirectory(dir);
  } else {
    console.log(`⚠️ Directory not found: ${dir}`);
  }
}

console.log('✅ Revalidate export issues fixed!');
