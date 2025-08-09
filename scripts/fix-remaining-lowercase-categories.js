const fs = require('fs');
const path = require('path');

// Function to recursively find all controller files
function findControllerFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findControllerFiles(filePath, fileList);
    } else if (file.endsWith('Controller.js') || file.endsWith('Controllers.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix lowercase category names
function fixLowercaseCategories(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Find all lowercase category patterns
    const lowercaseCategoryRegex = /category:\s*'([a-z][a-zA-Z]*)'/g;
    let match;
    
    while ((match = lowercaseCategoryRegex.exec(content)) !== null) {
      const oldCategory = match[1];
      const newCategory = oldCategory.charAt(0).toUpperCase() + oldCategory.slice(1);
      
      // Replace the specific occurrence
      const beforeMatch = content.substring(0, match.index);
      const afterMatch = content.substring(match.index + match[0].length);
      const replacement = `category: '${newCategory}'`;
      
      content = beforeMatch + replacement + afterMatch;
      modified = true;
      
      console.log(`✅ Fixed category: '${oldCategory}' → '${newCategory}' in ${path.basename(filePath)}`);
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔧 Fixing remaining lowercase categories...\n');

const controllersDir = path.join(__dirname, '../backend/controllers');
const allControllerFiles = findControllerFiles(controllersDir);

console.log(`📁 Found ${allControllerFiles.length} controller files to check...\n`);

let fixedCount = 0;
allControllerFiles.forEach(filePath => {
  const relativePath = path.relative(controllersDir, filePath);
  if (fixLowercaseCategories(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} controllers with lowercase categories!`);
