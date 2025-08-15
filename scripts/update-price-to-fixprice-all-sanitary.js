const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary');

// Function to update price to fixPrice in a ProductForm.jsx file
function updatePriceToFixPrice(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let updated = false;
    
    // 1. Update form state: price -> fixPrice
    if (content.includes('price: \'\'') && !content.includes('fixPrice: \'\'')) {
      updatedContent = updatedContent.replace(/price: \'\'/g, 'fixPrice: \'\'');
      updated = true;
    }
    
    // 2. Update handleChange function: price -> fixPrice
    if (content.includes('name === \'price\'') && !content.includes('name === \'fixPrice\'')) {
      updatedContent = updatedContent.replace(/name === 'price'/g, 'name === \'fixPrice\'');
      updated = true;
    }
    
    if (content.includes('prev.price') && !content.includes('prev.fixPrice')) {
      updatedContent = updatedContent.replace(/prev\.price/g, 'prev.fixPrice');
      updated = true;
    }
    
    // 3. Update UI label: Price -> Fix Price
    if (content.includes('>Price<') && !content.includes('>Fix Price<')) {
      updatedContent = updatedContent.replace(/>Price</g, '>Fix Price<');
      updated = true;
    }
    
    // 4. Update UI input name: name="price" -> name="fixPrice"
    if (content.includes('name="price"') && !content.includes('name="fixPrice"')) {
      updatedContent = updatedContent.replace(/name="price"/g, 'name="fixPrice"');
      updated = true;
    }
    
    // 5. Update UI input value: value={form.price} -> value={form.fixPrice}
    if (content.includes('value={form.price}') && !content.includes('value={form.fixPrice}')) {
      updatedContent = updatedContent.replace(/value={form\.price}/g, 'value={form.fixPrice}');
      updated = true;
    }
    
    // 6. Update UI placeholder: placeholder="Price" -> placeholder="Fix Price"
    if (content.includes('placeholder="Price"') && !content.includes('placeholder="Fix Price"')) {
      updatedContent = updatedContent.replace(/placeholder="Price"/g, 'placeholder="Fix Price"');
      updated = true;
    }
    
    // 7. Update validation: form.price -> form.fixPrice
    if (content.includes('form.price') && !content.includes('form.fixPrice')) {
      updatedContent = updatedContent.replace(/form\.price/g, 'form.fixPrice');
      updated = true;
    }
    
    // 8. Update parseFloat calls: parseFloat(form.price) -> parseFloat(form.fixPrice)
    if (content.includes('parseFloat(form.price)') && !content.includes('parseFloat(form.fixPrice)')) {
      updatedContent = updatedContent.replace(/parseFloat\(form\.price\)/g, 'parseFloat(form.fixPrice)');
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
      if (updatePriceToFixPrice(itemPath)) {
        processedCount++;
        console.log(`✅ Updated ${dirName}/ProductForm.jsx: price -> fixPrice`);
      } else {
        console.log(`ℹ️  ${dirName}/ProductForm.jsx already uses fixPrice or no changes needed`);
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting to update price to fixPrice in all Sanitary ProductForm.jsx files...\n');
console.log('📋 This will update ALL ProductForm.jsx files to use fixPrice instead of price\n');
console.log('🔄 Updating to match AcrylicProducts format:\n');
console.log('   - Form state: price -> fixPrice');
console.log('   - handleChange function: price -> fixPrice');
console.log('   - UI label: Price -> Fix Price');
console.log('   - Input name: name="price" -> name="fixPrice"');
console.log('   - Input value: value={form.price} -> value={form.fixPrice}');
console.log('   - Placeholder: placeholder="Price" -> placeholder="Fix Price"');
console.log('   - Validation: form.price -> form.fixPrice');
console.log('   - parseFloat: parseFloat(form.price) -> parseFloat(form.fixPrice)\n');

// Process all ProductForm.jsx files recursively
const totalProcessed = processDirectory(frontendDir);

console.log(`\n🎉 Price to fixPrice update completed! Total files processed: ${totalProcessed}`);
console.log('✅ All ProductForm.jsx files now use fixPrice format!');
console.log('🔍 All forms now match the AcrylicProducts structure');
console.log('🚀 Consistent price field naming across all forms!');
