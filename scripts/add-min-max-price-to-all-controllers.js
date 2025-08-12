const fs = require('fs');
const path = require('path');

// Function to recursively find all JavaScript files in a directory
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to add minPrice and maxPrice fields to a controller file
function addMinMaxPriceFields(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if the file contains a create method
    if (content.includes('exports.create') || content.includes('const product = new Lock')) {
      
      // Add minPrice and maxPrice to the Lock constructor
      const lockConstructorRegex = /const (?:product|item) = new Lock\(\s*\{([^}]+)\s*\}\s*\);/;
      const match = content.match(lockConstructorRegex);
      
      if (match) {
        const constructorContent = match[1];
        
        // Check if minPrice and maxPrice are already present
        if (!constructorContent.includes('minPrice') && !constructorContent.includes('maxPrice')) {
          // Add minPrice and maxPrice before the closing brace
          const newConstructorContent = constructorContent.replace(
            /(\s*\}\s*\);)/,
            `,\n      minPrice: req.body.minPrice || undefined,\n      maxPrice: req.body.maxPrice || undefined$1`
          );
          
          content = content.replace(lockConstructorRegex, 
            `const ${match[0].includes('product') ? 'product' : 'item'} = new Lock({${newConstructorContent}});`
          );
          
          modified = true;
          console.log(`✅ Added minPrice and maxPrice to: ${path.basename(filePath)}`);
        } else {
          console.log(`ℹ️  minPrice and maxPrice already present in: ${path.basename(filePath)}`);
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
function main() {
  const controllersDir = path.join(__dirname, '..', 'backend', 'controllers', 'locks');
  
  if (!fs.existsSync(controllersDir)) {
    console.error('❌ Controllers directory not found:', controllersDir);
    return;
  }
  
  console.log('🔍 Searching for controller files...');
  const jsFiles = findJsFiles(controllersDir);
  
  console.log(`📁 Found ${jsFiles.length} JavaScript files`);
  console.log('🚀 Starting to add minPrice and maxPrice fields...\n');
  
  let processedCount = 0;
  let modifiedCount = 0;
  
  jsFiles.forEach(filePath => {
    if (path.basename(filePath).includes('Controller')) {
      processedCount++;
      addMinMaxPriceFields(filePath);
    }
  });
  
  console.log(`\n✨ Processed ${processedCount} controller files`);
  console.log('🎉 All controllers now have optional minPrice and maxPrice fields!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { addMinMaxPriceFields, findJsFiles };
