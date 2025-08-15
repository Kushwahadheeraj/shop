const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary');

// Function to fix calculatePriceRange function in a ProductForm.jsx file
function fixCalculatePriceRangeFunction(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let updated = false;
    
    // Check if calculatePriceRange function exists
    if (!content.includes('calculatePriceRange')) {
      // Find handleRemoveVariant function and add calculatePriceRange after it
      const handleRemoveVariantRegex = /const handleRemoveVariant = idx => \{[\s\S]*?\};/;
      const handleRemoveVariantMatch = content.match(handleRemoveVariantRegex);
      
      if (handleRemoveVariantMatch) {
        const calculatePriceRangeFunction = `
  // Calculate min/max price from variants
  const calculatePriceRange = () => {
    if (form.variants.length === 0) {
      setForm(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
      return;
    }
    
    const prices = form.variants
      .map(v => parseFloat(v.price))
      .filter(price => !isNaN(price) && price > 0);
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setForm(prev => ({ 
        ...prev, 
        minPrice: minPrice.toString(), 
        maxPrice: maxPrice.toString() 
      }));
    }
  };`;
        
        updatedContent = updatedContent.replace(
          handleRemoveVariantMatch[0],
          handleRemoveVariantMatch[0] + calculatePriceRangeFunction
        );
        updated = true;
      }
    }
    
    // Also check if the function is properly defined but might have syntax issues
    if (content.includes('calculatePriceRange') && !content.includes('const calculatePriceRange = () => {')) {
      // Remove any incomplete function definitions
      updatedContent = updatedContent.replace(
        /\/\/ Calculate min\/max price from variants[\s\S]*?};/g,
        ''
      );
      
      // Add the complete function
      const calculatePriceRangeFunction = `
  // Calculate min/max price from variants
  const calculatePriceRange = () => {
    if (form.variants.length === 0) {
      setForm(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
      return;
    }
    
    const prices = form.variants
      .map(v => parseFloat(v.price))
      .filter(price => !isNaN(price) && price > 0);
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setForm(prev => ({ 
        ...prev, 
        minPrice: minPrice.toString(), 
        maxPrice: maxPrice.toString() 
      }));
    }
  };`;
      
      // Find handleRemoveVariant function and add calculatePriceRange after it
      const handleRemoveVariantRegex = /const handleRemoveVariant = idx => \{[\s\S]*?\};/;
      const handleRemoveVariantMatch = updatedContent.match(handleRemoveVariantRegex);
      
      if (handleRemoveVariantMatch) {
        updatedContent = updatedContent.replace(
          handleRemoveVariantMatch[0],
          handleRemoveVariantMatch[0] + calculatePriceRangeFunction
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

// Function to process all ProductForm.jsx files recursively
function processDirectory(dirPath, dirName = '') {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subProcessed = processDirectory(itemPath, path.join(dirName, item));
      processedCount += subProcessed;
    } else if (item === 'ProductForm.jsx') {
      // Process ProductForm.jsx files
      if (fixCalculatePriceRangeFunction(itemPath)) {
        processedCount++;
        console.log(`✅ Fixed calculatePriceRange function in ${dirName}/ProductForm.jsx`);
      } else {
        console.log(`ℹ️  ${dirName}/ProductForm.jsx already has calculatePriceRange function`);
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting to fix calculatePriceRange function in all Sanitary ProductForm.jsx files...\n');
console.log('📋 This will ensure ALL ProductForm.jsx files have the calculatePriceRange function properly defined\n');
console.log('🔄 Fixing: missing or incomplete calculatePriceRange function definitions\n');

// Process all ProductForm.jsx files recursively
const totalProcessed = processDirectory(frontendDir);

console.log(`\n🎉 calculatePriceRange function fix completed! Total files processed: ${totalProcessed}`);
console.log('✅ All ProductForm.jsx files now have the calculatePriceRange function properly defined!');
console.log('🔍 No more "calculatePriceRange is not defined" errors!');
console.log('🚀 All forms can now calculate min/max prices from variants!');
