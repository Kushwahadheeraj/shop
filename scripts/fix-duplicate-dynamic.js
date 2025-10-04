const fs = require('fs');
const path = require('path');

// List of directories that contain pages that should be dynamic
const dynamicDirs = [
  'app/Dashboard/ProductAdd',
  'app/Dashboard/ProductList', 
  'app/ShopPage'
];

// Function to fix duplicate dynamic declarations in a page file
function fixDuplicateDynamic(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if there are duplicate dynamic declarations
    const dynamicMatches = content.match(/export const dynamic = "force-dynamic";/g);
    
    if (dynamicMatches && dynamicMatches.length > 1) {
      console.log(`🔧 Fixing duplicates in: ${filePath}`);
      
      // Remove all dynamic declarations
      let newContent = content.replace(/export const dynamic = "force-dynamic";\s*/g, '');
      
      // Remove any extra whitespace and comments
      newContent = newContent.replace(/\/\/ Force dynamic rendering to prevent build timeouts\s*/g, '');
      
      // Add a single dynamic declaration at the end
      newContent = newContent.trim() + '\n\n// Force dynamic rendering to prevent build timeouts\nexport const dynamic = "force-dynamic";\nexport const runtime = "nodejs";\nexport const revalidate = 0;';
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed duplicates in: ${filePath}`);
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
        fixDuplicateDynamic(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Process all dynamic directories
console.log('🚀 Fixing duplicate dynamic declarations...');

for (const dir of dynamicDirs) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing directory: ${dir}`);
    processDirectory(dir);
  } else {
    console.log(`⚠️ Directory not found: ${dir}`);
  }
}

console.log('✅ Duplicate dynamic declarations fixed!');
