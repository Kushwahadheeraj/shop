const fs = require('fs');
const path = require('path');

// List of directories that contain pages that should be dynamic
const dynamicDirs = [
  'app/Dashboard/ProductAdd',
  'app/Dashboard/ProductList', 
  'app/ShopPage'
];

// Function to enhance dynamic configuration in a page file
function enhanceDynamicPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has enhanced dynamic configuration
    if (content.includes('export const runtime = "nodejs"') || 
        content.includes('export const revalidate = 0')) {
      return;
    }
    
    // Add enhanced dynamic configuration
    const enhancedConfig = `
// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
`;
    
    // Add the configuration at the end of the file
    const newContent = content + enhancedConfig;
    
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Enhanced dynamic config for: ${filePath}`);
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
        enhanceDynamicPage(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dirPath}:`, error.message);
  }
}

// Process all dynamic directories
console.log('🚀 Enhancing dynamic configuration for problematic pages...');

for (const dir of dynamicDirs) {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing directory: ${dir}`);
    processDirectory(dir);
  } else {
    console.log(`⚠️ Directory not found: ${dir}`);
  }
}

console.log('✅ Dynamic configuration enhancement completed!');
