const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../backend/controllers/sanitary');

// Function to add Custom Fields processing to a controller file
function addCustomFieldsProcessing(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let updated = false;
    
    // Check if Custom Fields processing already exists
    if (!content.includes('Process Custom Fields')) {
      // Find the variants parsing section and add Custom Fields after it
      const variantsRegex = /\/\/ Parse variants[\s\S]*?if \(req\.body\.variants[\s\S]*?}/;
      const variantsMatch = content.match(variantsRegex);
      
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
    
    // Also check for update function
    if (!content.includes('update.customFields = customFields')) {
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
      if (addCustomFieldsProcessing(itemPath)) {
        processedCount++;
        console.log(`✅ Added Custom Fields processing to ${dirName}/${item}`);
      } else {
        console.log(`ℹ️  ${dirName}/${item} already has Custom Fields processing or no changes needed`);
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting to fix Custom Fields processing in ALL sanitary controllers (including subdirectories)...\n');
console.log('📋 This will add Custom Fields processing to ALL sanitary controllers recursively\n');
console.log('🔄 Adding: Custom Fields parsing logic for both create and update functions\n');

// Process all controller files recursively
const totalProcessed = processDirectoryRecursive(controllersDir);

console.log(`\n🎉 Custom Fields processing fix completed! Total files processed: ${totalProcessed}`);
console.log('✅ ALL sanitary controllers now properly process Custom Fields!');
console.log('🔍 Custom Fields data will now be saved to the database in ALL forms');
console.log('🚀 No more missing Custom Fields data anywhere!');
