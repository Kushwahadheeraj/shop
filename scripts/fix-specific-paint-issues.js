const fs = require('fs');
const path = require('path');

// Function to fix specific issues in Paint ProductForm files
function fixSpecificIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    console.log(`Processing: ${filePath}`);
    
    // Fix 1: Fix malformed handleSubmit function with duplicate if statements
    const malformedSubmitRegex = /if \(files\.length === 0\) \{\s*if \(!form\.name\.trim\(\)\) \{\s*setPhotoError\("Product name is required\."\);\s*return;\s*\}\s*if \(!form\.fixPrice \|\| form\.fixPrice <= 0\) \{\s*setPhotoError\("Valid price is required\."\);\s*return;\s*\}\s*if \(files\.length === 0\) \{\s*setPhotoError\("Please upload at least 1 photo\."\);\s*return;\s*\}\s*\}\s*\/\/ Validate required fields - only name and tags are required\s*if \(!form\.name \|\| form\.name\.trim\(\) === ''\) \{\s*setPhotoError\("Product name is required\."\);\s*return;\s*\}\s*\/\/ Validate tags - at least one tag is required\s*if \(!form\.tags \|\| form\.tags\.length === 0\) \{\s*setPhotoError\("At least one tag is required\."\);\s*return;\s*\}\s*/g;
    
    if (malformedSubmitRegex.test(content)) {
      content = content.replace(
        malformedSubmitRegex,
        `// Validate required fields
    if (!form.name.trim()) {
      setPhotoError("Product name is required.");
      return;
    }
    if (!form.fixPrice || form.fixPrice <= 0) {
      setPhotoError("Valid price is required.");
      return;
    }
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    
    `
      );
      hasChanges = true;
      console.log('  ✓ Fixed malformed handleSubmit function');
    }
    
    // Fix 2: Fix duplicate validation logic
    const duplicateValidationRegex = /if \(!form\.name\.trim\(\)\) \{\s*setPhotoError\("Product name is required\."\);\s*return;\s*\}\s*if \(!form\.name\.trim\(\)\) \{\s*setPhotoError\("Product name is required\."\);\s*return;\s*\}\s*/g;
    
    if (duplicateValidationRegex.test(content)) {
      content = content.replace(
        duplicateValidationRegex,
        `if (!form.name.trim()) {
      setPhotoError("Product name is required.");
      return;
    }
    `
      );
      hasChanges = true;
      console.log('  ✓ Fixed duplicate validation logic');
    }
    
    // Fix 3: Fix malformed if statements
    const malformedIfRegex = /if \(files\.length === 0\) \{\s*if \(!form\.name\.trim\(\)\) \{\s*setPhotoError\("Product name is required\."\);\s*return;\s*\}\s*if \(!form\.fixPrice \|\| form\.fixPrice <= 0\) \{\s*setPhotoError\("Valid price is required\."\);\s*return;\s*\}\s*if \(files\.length === 0\) \{\s*setPhotoError\("Please upload at least 1 photo\."\);\s*return;\s*\}\s*\}\s*/g;
    
    if (malformedIfRegex.test(content)) {
      content = content.replace(
        malformedIfRegex,
        `if (!form.name.trim()) {
      setPhotoError("Product name is required.");
      return;
    }
    if (!form.fixPrice || form.fixPrice <= 0) {
      setPhotoError("Valid price is required.");
      return;
    }
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    
    `
      );
      hasChanges = true;
      console.log('  ✓ Fixed malformed if statements');
    }
    
    // Fix 4: Fix missing variants array handling
    if (content.includes('data.append(k, JSON.stringify(v))')) {
      content = content.replace(
        /} else if \(k === 'variants'\) \{\s*data\.append\(k, JSON\.stringify\(v\)\);\s*\}/g,
        `} else if (k === 'variants') {
        // Handle variants array properly - send as individual fields
        if (v && v.length > 0) {
          v.forEach((variant, idx) => {
            data.append(\`variants[\${idx}][variantName]\`, variant.variantName || '');
            data.append(\`variants[\${idx}][fixPrice]\`, variant.fixPrice || '');
            data.append(\`variants[\${idx}][discountPrice]\`, variant.discountPrice || '');
          });
        }
      }`
      );
      hasChanges = true;
      console.log('  ✓ Fixed variants array handling');
    }
    
    // Fix 5: Fix price field references that might still exist
    if (content.includes('name="price"')) {
      content = content.replace(/name="price"/g, 'name="fixPrice"');
      hasChanges = true;
      console.log('  ✓ Fixed price input name to fixPrice');
    }
    
    if (content.includes('form.price')) {
      content = content.replace(/form\.price/g, 'form.fixPrice');
      hasChanges = true;
      console.log('  ✓ Fixed form.price references to form.fixPrice');
    }
    
    if (content.includes('v.price')) {
      content = content.replace(/v\.price/g, 'v.fixPrice');
      hasChanges = true;
      console.log('  ✓ Fixed variant price references to fixPrice');
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ File updated: ${filePath}`);
    } else {
      console.log(`  - No specific issues found: ${filePath}`);
    }
    
    return hasChanges;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to find all ProductForm.jsx files in Paint directory
function findPaintProductFormFiles() {
  const paintDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd', 'Paint');
  const productFormFiles = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item === 'ProductForm.jsx') {
        productFormFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(paintDir);
  return productFormFiles;
}

// Main execution
function main() {
  console.log('🔍 Finding all Paint ProductForm.jsx files for specific fixes...');
  const files = findPaintProductFormFiles();
  
  console.log(`📁 Found ${files.length} ProductForm.jsx files in Paint directory`);
  console.log('');
  
  let totalFixed = 0;
  
  for (const file of files) {
    const wasFixed = fixSpecificIssues(file);
    if (wasFixed) totalFixed++;
    console.log('');
  }
  
  console.log(`🎉 Summary: Fixed ${totalFixed} out of ${files.length} files`);
  console.log('');
  console.log('✅ All Paint ProductForm files have been checked for specific issues!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixSpecificIssues, findPaintProductFormFiles };
