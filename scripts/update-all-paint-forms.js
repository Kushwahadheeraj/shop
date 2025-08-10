const fs = require('fs');
const path = require('path');

// Function to update a single ProductForm.jsx file
function updateProductForm(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // 1. Remove type field from form state
    if (content.includes("type: [{ price: '', liter: '', kg: '' }]")) {
      content = content.replace(/type:\s*\[\s*\{\s*price:\s*['"]\s*,\s*liter:\s*['"]\s*,\s*kg:\s*['"]\s*\}\s*\],?\s*\/\/\s*Added required 'type' field for backend model/g, '');
      updated = true;
    }

    // 2. Add minPrice and maxPrice to form state
    if (!content.includes('minPrice: \'\'')) {
      content = content.replace(/(variants:\s*\[\s*\]\s*,?\s*\/\/\s*\{[^}]*\})/g, '$1\n    minPrice: \'\',\n    maxPrice: \'\',');
      updated = true;
    }

    // 3. Remove required attribute from fixPrice input
    if (content.includes('name="fixPrice" type="number" value={form.fixPrice} onChange={handleChange} placeholder="Price" required')) {
      content = content.replace(/name="fixPrice" type="number" value={form\.fixPrice} onChange={handleChange} placeholder="Price" required/g, 'name="fixPrice" type="number" value={form.fixPrice} onChange={handleChange} placeholder="Price"');
      updated = true;
    }

    // 4. Add minPrice and maxPrice input fields after totalProduct
    if (!content.includes('Min Price')) {
      content = content.replace(/(<div>\s*<label className="block text-sm font-medium mb-1">Total Product<\/label>\s*<Input name="totalProduct" type="number" value={form\.totalProduct} onChange={handleChange} placeholder="Total Product" \/>\s*<\/div>)/g, 
        `$1
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <Input name="minPrice" type="number" value={form.minPrice} onChange={handleChange} placeholder="Min Price" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <Input name="maxPrice" type="number" value={form.maxPrice} onChange={handleChange} placeholder="Max Price" />
        </div>`);
      updated = true;
    }

    // 5. Update validation logic to only require name and tags
    if (content.includes('Validate required fields')) {
      content = content.replace(/\/\/ Validate required fields[\s\S]*?return;/g, 
        `// Validate required fields - only name and tags are required
    if (!form.name || form.name.trim() === '') {
      setPhotoError("Product name is required.");
      return;
    }
    
    // Validate tags - at least one tag is required
    if (!form.tags || form.tags.length === 0) {
      setPhotoError("At least one tag is required.");
      return;
    }`);
      updated = true;
    }

    // 6. Remove type validation
    if (content.includes('Validate type array has at least one option with price')) {
      content = content.replace(/\/\/ Validate type array has at least one option with price[\s\S]*?return;/g, '');
      updated = true;
    }

    // 7. Remove colors validation
    if (content.includes('Validate colors array has at least one color')) {
      content = content.replace(/\/\/ Validate colors array has at least one color[\s\S]*?return;/g, '');
      updated = true;
    }

    // 8. Remove type handling from FormData
    if (content.includes('Handle type array properly')) {
      content = content.replace(/} else if \(k === 'type'\) \{[\s\S]*?\} else \{/g, '} else {');
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Function to find all ProductForm.jsx files in Paint directory
function findProductFormFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item === 'ProductForm.jsx') {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Main execution
const paintDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd', 'Paint');
console.log('Scanning for ProductForm.jsx files in:', paintDir);

const productFormFiles = findProductFormFiles(paintDir);
console.log(`Found ${productFormFiles.length} ProductForm.jsx files`);

let updatedCount = 0;
let skippedCount = 0;

for (const filePath of productFormFiles) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`\nProcessing: ${relativePath}`);
  
  if (updateProductForm(filePath)) {
    console.log(`✅ Updated: ${relativePath}`);
    updatedCount++;
  } else {
    console.log(`⏭️  Skipped: ${relativePath} (no changes needed)`);
    skippedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`Updated: ${updatedCount} files`);
console.log(`Skipped: ${skippedCount} files`);
console.log(`Total: ${productFormFiles.length} files`);
