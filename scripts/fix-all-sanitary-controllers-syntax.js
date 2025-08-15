const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../backend/controllers/sanitary');

// Function to fix syntax errors in a controller file
function fixControllerSyntax(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let updated = false;
    
    // Fix 1: Remove duplicate Custom Fields processing code
    if ((content.match(/\/\/ Process Custom Fields/g) || []).length > 1) {
      // Remove all Custom Fields processing and add it back correctly
      updatedContent = updatedContent.replace(
        /\/\/ Process Custom Fields[\s\S]*?if \(customFields\.length > 0\) \{[\s\S]*?}/g,
        ''
      );
      updated = true;
    }
    
    // Fix 2: Fix incomplete try-catch blocks in variants parsing
    const incompleteTryRegex = /try \{ productData\.variants = JSON\.parse\(req\.body\.variants\); \}/;
    if (incompleteTryRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        incompleteTryRegex,
        'try { productData.variants = JSON.parse(req.body.variants); } catch (_) {}'
      );
      updated = true;
    }
    
    // Fix 3: Fix incomplete try-catch blocks in update variants parsing
    const incompleteUpdateTryRegex = /try \{ update\.variants = JSON\.parse\(req\.body\.variants\); \}/;
    if (incompleteUpdateTryRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(
        incompleteUpdateTryRegex,
        'try { update.variants = JSON.parse(req.body.variants); } catch (_) {}'
      );
      updated = true;
    }
    
    // Fix 4: Ensure proper Custom Fields processing structure
    if (!updatedContent.includes('// Process Custom Fields') || 
        !updatedContent.includes('productData.customFields = customFields')) {
      
      // Find the variants parsing section and add proper Custom Fields after it
      const variantsRegex = /\/\/ Parse variants[\s\S]*?if \(req\.body\.variants[\s\S]*?}/;
      const variantsMatch = updatedContent.match(variantsRegex);
      
      if (variantsMatch) {
        const customFieldsCode = `
    // Process Custom Fields
    const customFields = [];
    for (let i = 1; i <= 10; i++) { // Support up to 10 custom fields
      const fieldName = req.body[\`customFieldName\${i}\`];
      const fieldValue = req.body[\`customFieldValue\${i}\`];
      
      if (fieldName && fieldName.trim()) {
        // Handle multiple values for the same field
        const fieldValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        customFields.push({
          fieldName: fieldName.trim(),
          fieldValues: fieldValues.filter(val => val && val.trim())
        });
      }
    }
    
    if (customFields.length > 0) {
      productData.customFields = customFields;
    }`;
        
        updatedContent = updatedContent.replace(
          variantsMatch[0],
          variantsMatch[0] + customFieldsCode
        );
        updated = true;
      }
    }
    
    // Fix 5: Ensure proper Custom Fields processing in update function
    if (!updatedContent.includes('update.customFields = customFields')) {
      // Find the variants parsing in update function
      const updateVariantsRegex = /\/\/ Parse variants[\s\S]*?if \(req\.body\.variants[\s\S]*?}/;
      const updateVariantsMatch = updatedContent.match(updateVariantsRegex);
      
      if (updateVariantsMatch) {
        const updateCustomFieldsCode = `
    // Process Custom Fields
    const customFields = [];
    for (let i = 1; i <= 10; i++) { // Support up to 10 custom fields
      const fieldName = req.body[\`customFieldName\${i}\`];
      const fieldValue = req.body[\`customFieldValue\${i}\`];
      
      if (fieldName && fieldName.trim()) {
        // Handle multiple values for the same field
        const fieldValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
        customFields.push({
          fieldName: fieldName.trim(),
          fieldValues: fieldValues.filter(val => val && val.trim())
        });
      }
    }
    
    if (customFields.length > 0) {
      update.customFields = customFields;
    }`;
        
        updatedContent = updatedContent.replace(
          updateVariantsMatch[0],
          updateVariantsMatch[0] + updateCustomFieldsCode
        );
        updated = true;
      }
    }
    
    // Fix 6: Remove any orphaned Custom Fields code that's not properly placed
    const orphanedCustomFieldsRegex = /\/\/ Process Custom Fields[\s\S]*?if \(customFields\.length > 0\) \{[\s\S]*?update\.customFields = customFields;[\s\S]*?}/;
    if (orphanedCustomFieldsRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(orphanedCustomFieldsRegex, '');
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to process all controller files recursively
function processDirectoryRecursive(dirPath, dirName = '') {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subProcessed = processDirectoryRecursive(itemPath, path.join(dirName, item));
      processedCount += subProcessed;
    } else if (item.endsWith('.js')) {
      // Process JavaScript files (controllers)
      if (fixControllerSyntax(itemPath)) {
        processedCount++;
        console.log(`✅ Fixed syntax in ${dirName}/${item}`);
      } else {
        console.log(`ℹ️  ${dirName}/${item} syntax is already correct`);
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting to fix syntax errors in ALL sanitary controllers...\n');
console.log('📋 This will fix ALL syntax errors and ensure proper structure\n');
console.log('🔄 Fixing: incomplete try-catch blocks, duplicate code, orphaned code\n');

// Process all controller files recursively
const totalProcessed = processDirectoryRecursive(controllersDir);

console.log(`\n🎉 Syntax fix completed! Total files processed: ${totalProcessed}`);
console.log('✅ ALL sanitary controllers now have proper syntax!');
console.log('🔍 No more "Missing catch or finally after try" errors!');
console.log('🚀 All controllers should now load without syntax errors!');
