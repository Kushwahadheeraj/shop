const fs = require('fs');
const path = require('path');

// List of directories that contain pages that should be dynamic
const dynamicDirs = [
  'app/Dashboard/ProductAdd',
  'app/Dashboard/ProductList', 
  'app/ShopPage'
];

// Function to remove revalidate export from a page file
function removeRevalidateExport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if revalidate export exists and remove it
    if (content.includes('export const revalidate = false;')) {
      console.log(`🔧 Removing revalidate export from: ${filePath}`);
      
      // Remove the revalidate export line
      const newContent = content.replace(/export const revalidate = false;\n?/g, '');
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Removed revalidate export from: ${filePath}`);
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
        removeRevalidateExport(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Process all dynamic directories
console.log('🚀 Removing revalidate exports...');

for (const dir of dynamicDirs) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing directory: ${dir}`);
    processDirectory(dir);
  } else {
    console.log(`⚠️ Directory not found: ${dir}`);
  }
}

console.log('✅ Revalidate exports removed!');
