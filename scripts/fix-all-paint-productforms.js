const fs = require('fs');
const path = require('path');

// Function to fix a single ProductForm.jsx file
function fixProductFormFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    console.log(`Processing: ${filePath}`);
    
    // Fix 1: Change price to fixPrice in useState
    if (content.includes('price: \'\'') || content.includes('price: ""')) {
      content = content.replace(/price:\s*['"]/g, 'fixPrice: \'');
      hasChanges = true;
      console.log('  ✓ Fixed price to fixPrice in useState');
    }
    
    // Fix 2: Change price to fixPrice in input name
    if (content.includes('name="price"')) {
      content = content.replace(/name="price"/g, 'name="fixPrice"');
      hasChanges = true;
      console.log('  ✓ Fixed price to fixPrice in input name');
    }
    
    // Fix 3: Change price to fixPrice in handleChange logic
    if (content.includes('fixPrice: e.target.value')) {
      // Already fixed
    } else if (content.includes('price: e.target.value')) {
      content = content.replace(/price:\s*e\.target\.value/g, 'fixPrice: e.target.value');
      hasChanges = true;
      console.log('  ✓ Fixed price to fixPrice in handleChange');
    }
    
    // Fix 4: Change price to fixPrice in discount calculation
    if (content.includes('form.price')) {
      content = content.replace(/form\.price/g, 'form.fixPrice');
      hasChanges = true;
      console.log('  ✓ Fixed form.price to form.fixPrice in discount calculation');
    }
    
    // Fix 5: Remove sku field from useState
    if (content.includes('sku: \'N/A\'')) {
      content = content.replace(/sku:\s*['"]N\/A['"],?\s*/g, '');
      hasChanges = true;
      console.log('  ✓ Removed sku field from useState');
    }
    
    // Fix 6: Remove SKU input field
    if (content.includes('<label className="block text-sm font-medium mb-1">SKU</label>')) {
      const skuInputRegex = /<div>\s*<label className="block text-sm font-medium mb-1">SKU<\/label>\s*<Input name="sku" value={form\.sku} onChange={handleChange} placeholder="SKU" \/>\s*<\/div>/g;
      content = content.replace(skuInputRegex, '');
      hasChanges = true;
      console.log('  ✓ Removed SKU input field');
    }
    
    // Fix 7: Fix variants array submission (change JSON.stringify to proper array handling)
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
      console.log('  ✓ Fixed variants array submission');
    }
    
    // Fix 8: Fix variant price field references
    if (content.includes('v.price')) {
      content = content.replace(/v\.price/g, 'v.fixPrice');
      hasChanges = true;
      console.log('  ✓ Fixed variant price to fixPrice references');
    }
    
    // Fix 9: Fix variant input field names
    if (content.includes('onChange={e => handleVariantChange(idx, \'price\'')) {
      content = content.replace(/onChange=\{e => handleVariantChange\(idx, 'price'/g, 'onChange={e => handleVariantChange(idx, \'fixPrice\'');
      hasChanges = true;
      console.log('  ✓ Fixed variant onChange price to fixPrice');
    }
    
    // Fix 10: Fix variant input values
    if (content.includes('value={v.price}')) {
      content = content.replace(/value=\{v\.price\}/g, 'value={v.fixPrice}');
      hasChanges = true;
      console.log('  ✓ Fixed variant input value price to fixPrice');
    }
    
    // Fix 11: Fix handleVariantChange function
    if (content.includes('if (field === \'price\' || field === \'discount\')')) {
      content = content.replace(
        /if \(field === 'price' \|\| field === 'discount'\) \{\s*const price = parseFloat\(field === 'price' \? value : updated\[idx\]\.price\);/g,
        `if (field === 'fixPrice' || field === 'discount') {
            const price = parseFloat(field === 'fixPrice' ? value : updated[idx].fixPrice);`
      );
      hasChanges = true;
      console.log('  ✓ Fixed handleVariantChange price references');
    }
    
    // Fix 12: Add client-side validation if missing
    if (!content.includes('if (!form.name.trim())')) {
      const validationCode = `    if (!form.name.trim()) {
      setPhotoError("Product name is required.");
      return;
    }
    if (!form.fixPrice || form.fixPrice <= 0) {
      setPhotoError("Valid price is required.");
      return;
    }`;
      
      if (content.includes('setPhotoError("Please upload at least 1 photo.");')) {
        content = content.replace(
          /setPhotoError\("Please upload at least 1 photo\."\);\s*return;/g,
          `${validationCode}
    if (files.length === 0) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }`
        );
        hasChanges = true;
        console.log('  ✓ Added client-side validation');
      }
    }
    
    // Fix 13: Remove duplicate setPhotoError("") calls
    const duplicateSetPhotoErrorRegex = /setPhotoError\(""\);\s*\n\s*setPhotoError\(""\);/g;
    if (duplicateSetPhotoErrorRegex.test(content)) {
      content = content.replace(duplicateSetPhotoErrorRegex, 'setPhotoError("");');
      hasChanges = true;
      console.log('  ✓ Removed duplicate setPhotoError calls');
    }
    
    // Fix 14: Remove duplicate if (res.ok) checks
    const duplicateResOkRegex = /if \(res\.ok\) \{\s*onSave && onSave\(\);\s*\} else \{\s*if \(res\.ok\) \{\s*onSave && onSave\(\);\s*\} else \{\s*const errorData = await res\.json\(\);\s*setPhotoError\(errorData\.error \|\| 'Failed to create product'\);\s*\}\s*\}\s*\} catch/g;
    if (duplicateResOkRegex.test(content)) {
      content = content.replace(
        duplicateResOkRegex,
        `if (res.ok) {
        onSave && onSave();
      } else {
        const errorData = await res.json();
        setPhotoError(errorData.error || 'Failed to create product');
      }
    } catch`
      );
      hasChanges = true;
      console.log('  ✓ Removed duplicate if (res.ok) checks');
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ File updated: ${filePath}`);
    } else {
      console.log(`  - No changes needed: ${filePath}`);
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
  console.log('🔍 Finding all Paint ProductForm.jsx files...');
  const files = findPaintProductFormFiles();
  
  console.log(`📁 Found ${files.length} ProductForm.jsx files in Paint directory`);
  console.log('');
  
  let totalFixed = 0;
  
  for (const file of files) {
    const wasFixed = fixProductFormFile(file);
    if (wasFixed) totalFixed++;
    console.log('');
  }
  
  console.log(`🎉 Summary: Fixed ${totalFixed} out of ${files.length} files`);
  console.log('');
  console.log('✅ All Paint ProductForm files have been checked and updated!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixProductFormFile, findPaintProductFormFiles };
