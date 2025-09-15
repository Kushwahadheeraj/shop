const fs = require('fs');
const path = require('path');

// Function to remove redundant *Page.jsx files
function removeRedundantFiles(dir) {
  let removedCount = 0;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively check subdirectories
        removedCount += removeRedundantFiles(fullPath);
      } else if (item.endsWith('Page.jsx')) {
        // Check if there's a corresponding page.js file
        const pageJsPath = path.join(dir, 'page.js');
        if (fs.existsSync(pageJsPath)) {
          // Remove the *Page.jsx file since page.js exists
          fs.unlinkSync(fullPath);
          console.log(`Removed: ${fullPath}`);
          removedCount++;
        }
      }
    }
  } catch (error) {
    console.log(`Error processing directory ${dir}: ${error.message}`);
  }
  
  return removedCount;
}

// Start from the ShopPage directory
const shopPageDir = path.join(__dirname, 'app', 'ShopPage');
console.log('🧹 Removing redundant *Page.jsx files...');
console.log('📁 Starting from:', shopPageDir);
console.log('');

const removedCount = removeRedundantFiles(shopPageDir);

console.log('');
console.log('✅ Cleanup Complete!');
console.log(`🗑️ Removed ${removedCount} redundant files`);
console.log('');

if (removedCount === 0) {
  console.log('🎉 No redundant files found!');
} else {
  console.log('✨ All redundant files have been removed!');
}

