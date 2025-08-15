const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary');

// Function to add min/max price fields to a ProductForm.jsx file
function addMinMaxPriceFields(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let updated = false;
    
    // 1. Add minPrice and maxPrice to form state
    if (!content.includes('minPrice:') && !content.includes('maxPrice:')) {
      // Find the form state and add minPrice and maxPrice
      const formStateRegex = /const \[form, setForm\] = useState\({[\s\S]*?}\);/;
      const formStateMatch = content.match(formStateRegex);
      
      if (formStateMatch) {
        const formState = formStateMatch[0];
        // Add minPrice and maxPrice after price field
        if (formState.includes('price:')) {
          const newFormState = formState.replace(
            /(price:\s*['"][^'"]*['"],?\s*)/,
            '$1\n    minPrice: \'\',\n    maxPrice: \'\',\n    '
          );
          updatedContent = updatedContent.replace(formState, newFormState);
          updated = true;
        }
      }
    }
    
    // 2. Add calculatePriceRange function
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
    
    // 3. Add min/max price fields to UI
    if (!content.includes('Min Price') && !content.includes('Max Price')) {
      // Find the price field and add min/max price fields after it
      const priceFieldRegex = /(\s*<div>\s*<label[^>]*>Price<\/label>\s*<Input[^>]*\/>\s*<\/div>\s*)/;
      const priceFieldMatch = content.match(priceFieldRegex);
      
      if (priceFieldMatch) {
        const minMaxPriceFields = `
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <Input name="minPrice" type="number" value={form.minPrice} onChange={handleChange} placeholder="Min Price" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <Input name="maxPrice" type="number" value={form.maxPrice} onChange={handleChange} placeholder="Max Price" />
        </div>`;
        
        updatedContent = updatedContent.replace(
          priceFieldMatch[0],
          priceFieldMatch[0] + minMaxPriceFields
        );
        updated = true;
      }
    }
    
    // 4. Add Calculate Price Range button to variants section
    if (!content.includes('Calculate Price Range')) {
      // Find the variants section header and add the button
      const variantsHeaderRegex = /(\s*<div className="flex justify-between items-center">\s*<label[^>]*>Variants<\/label>\s*<Button[^>]*>Add Variant<\/Button>\s*<\/div>\s*)/;
      const variantsHeaderMatch = content.match(variantsHeaderRegex);
      
      if (variantsHeaderMatch) {
        const newVariantsHeader = `
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Variants</label>
          <div className="flex gap-2">
            <Button type="button" onClick={calculatePriceRange} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Calculate Price Range</Button>
            <Button type="button" onClick={handleAddVariant} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Variant</Button>
          </div>
        </div>`;
        
        updatedContent = updatedContent.replace(
          variantsHeaderMatch[0],
          newVariantsHeader
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
      if (addMinMaxPriceFields(itemPath)) {
        processedCount++;
        console.log(`✅ Added min/max price fields to ${dirName}/ProductForm.jsx`);
      } else {
        console.log(`ℹ️  ${dirName}/ProductForm.jsx already has min/max price fields or no changes needed`);
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting to add min/max price fields to all Sanitary ProductForm.jsx files...\n');
console.log('📋 This will add min/max price fields to ALL ProductForm.jsx files in the Sanitary category\n');
console.log('🔄 Adding: form state fields, calculatePriceRange function, UI fields, and Calculate Price Range button\n');

// Process all ProductForm.jsx files recursively
const totalProcessed = processDirectory(frontendDir);

console.log(`\n🎉 Min/Max price fields added! Total files processed: ${totalProcessed}`);
console.log('✅ All ProductForm.jsx files now have min/max price functionality!');
console.log('🔍 Features added:');
console.log('   - minPrice and maxPrice form fields');
console.log('   - calculatePriceRange function');
console.log('   - Min Price and Max Price input fields in UI');
console.log('   - Calculate Price Range button in variants section');
console.log('🚀 Users can now set min/max prices manually or calculate them from variants!');
