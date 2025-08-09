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

// Function to extract category names from controller content
function extractCategoryNames(content) {
  const categories = new Set();
  
  // Find all category assignments
  const categoryMatches = content.match(/category:\s*['"`]([^'"`]+)['"`]/g);
  if (categoryMatches) {
    categoryMatches.forEach(match => {
      const category = match.match(/category:\s*['"`]([^'"`]+)['"`]/)[1];
      categories.add(category);
    });
  }
  
  return Array.from(categories);
}

// Function to check for category mismatches in a controller
function checkCategoryMismatches(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const categories = extractCategoryNames(content);
    
    if (categories.length > 1) {
      return {
        file: path.relative(process.cwd(), filePath),
        categories: categories,
        hasMismatch: true
      };
    }
    
    return {
      file: path.relative(process.cwd(), filePath),
      categories: categories,
      hasMismatch: false
    };
  } catch (error) {
    return {
      file: path.relative(process.cwd(), filePath),
      categories: [],
      hasMismatch: false,
      error: error.message
    };
  }
}

// Function to fix category mismatches
function fixCategoryMismatches(filePath, targetCategory) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace all category assignments with the target category
    const categoryRegex = /category:\s*['"`]([^'"`]+)['"`]/g;
    content = content.replace(categoryRegex, `category: '${targetCategory}'`);
    modified = true;
    
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
console.log('🔍 Checking all controllers for category mismatches...\n');

const controllersDir = path.join(__dirname, '../backend/controllers');
const allControllerFiles = findControllerFiles(controllersDir);

console.log(`📁 Found ${allControllerFiles.length} controller files to check...\n`);

const mismatches = [];
const allResults = [];

allControllerFiles.forEach(filePath => {
  const result = checkCategoryMismatches(filePath);
  allResults.push(result);
  
  if (result.hasMismatch) {
    mismatches.push(result);
    console.log(`❌ MISMATCH FOUND: ${result.file}`);
    console.log(`   Categories: ${result.categories.join(', ')}`);
    console.log('');
  }
});

console.log(`\n📊 Summary:`);
console.log(`✅ Files without mismatches: ${allResults.filter(r => !r.hasMismatch).length}`);
console.log(`❌ Files with mismatches: ${mismatches.length}`);

if (mismatches.length > 0) {
  console.log(`\n🔧 Fixing category mismatches...\n`);
  
  let fixedCount = 0;
  mismatches.forEach(mismatch => {
    // Determine the correct category (usually the first one or the one with proper capitalization)
    const targetCategory = mismatch.categories[0];
    
    const filePath = path.join(process.cwd(), mismatch.file);
    if (fixCategoryMismatches(filePath, targetCategory)) {
      console.log(`✅ Fixed: ${mismatch.file} → ${targetCategory}`);
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Fixed ${fixedCount} controllers successfully!`);
} else {
  console.log(`\n🎉 No category mismatches found!`);
}

// Also check for common issues
console.log(`\n🔍 Checking for common issues...\n`);

let commonIssues = 0;
allControllerFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  // Check for lowercase category names
  const lowercaseMatches = content.match(/category:\s*'([a-z][a-zA-Z]*)'/g);
  if (lowercaseMatches) {
    console.log(`⚠️  Lowercase category in ${fileName}: ${lowercaseMatches.join(', ')}`);
    commonIssues++;
  }
  
  // Check for old error response format
  if (content.includes('res.status(500).json({ message: err.message });')) {
    console.log(`⚠️  Old error response format in ${fileName}`);
    commonIssues++;
  }
  
  if (content.includes('res.status(404).json({ message: \'Not found\' });')) {
    console.log(`⚠️  Old 404 error response format in ${fileName}`);
    commonIssues++;
  }
});

if (commonIssues === 0) {
  console.log(`✅ No common issues found!`);
} else {
  console.log(`\n⚠️  Found ${commonIssues} common issues that should be addressed.`);
}
