const fs = require('fs');
const path = require('path');

// List of directories that contain pages that should be dynamic
const dynamicDirs = [
  'app/Dashboard/ProductAdd',
  'app/Dashboard/ProductList', 
  'app/ShopPage'
];

// Function to add dynamic export to a page file
function makePageDynamic(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has dynamic export
    if (content.includes('export const dynamic = ')) {
      return;
    }
    
    // Add dynamic export at the top after imports
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].startsWith('"use client"')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '' && insertIndex > 0) {
        insertIndex = i + 1;
        break;
      }
    }
    
    // Insert dynamic export
    lines.splice(insertIndex, 0, '');
    lines.splice(insertIndex + 1, 0, '// Force dynamic rendering to prevent build timeouts');
    lines.splice(insertIndex + 2, 0, 'export const dynamic = "force-dynamic";');
    lines.splice(insertIndex + 3, 0, '');
    
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`✅ Made dynamic: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Function to recursively find and process page files
function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return;
  }
  
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (item === 'page.js' || item === 'page.jsx') {
      makePageDynamic(fullPath);
    }
  }
}

// Process all directories
console.log('🚀 Making pages dynamic to prevent build timeouts...');
dynamicDirs.forEach(dir => {
  console.log(`\n📁 Processing directory: ${dir}`);
  processDirectory(dir);
});

console.log('\n✅ Done! All specified pages are now dynamic.');
