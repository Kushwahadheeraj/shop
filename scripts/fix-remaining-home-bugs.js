const fs = require('fs');
const path = require('path');

// Function to fix individual ProductForm file
function fixProductFormFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix missing onSave prop in function signature
    if (content.includes('export default function ProductForm() {') && 
        content.includes('onSave && onSave()')) {
      content = content.replace(
        'export default function ProductForm() {',
        'export default function ProductForm({ onSave }) {'
      );
      modified = true;
      console.log(`✅ Fixed onSave prop in: ${filePath}`);
    }

    // 2. Fix field name mismatches (tags → tag)
    if (content.includes('tags.forEach(tag =>') && !content.includes('tag.forEach(tag =>')) {
      content = content.replace(/tags\.forEach\(tag =>/g, 'tag.forEach(tag =>');
      content = content.replace(/formData\.append\("tags", tag\)/g, 'formData.append("tag", tag)');
      content = content.replace(/data\.append\('tags', tag\)/g, "data.append('tag', tag)");
      modified = true;
      console.log(`✅ Fixed tags → tag in: ${filePath}`);
    }

    // 3. Add error handling if missing
    if (content.includes('if (res.ok)') && !content.includes('else {')) {
      content = content.replace(
        /if \(res\.ok\) onSave && onSave\(\);/g,
        `if (res.ok) {
      alert('Product created successfully!');
      if (onSave) onSave();
    } else {
      const errorData = await res.json();
      alert(\`Error creating product: \${errorData.error || 'Unknown error'}\`);
    }`
      );
      modified = true;
      console.log(`✅ Added error handling in: ${filePath}`);
    }

    // Write back if modified
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
function main() {
  console.log('🔧 Starting remaining Home folder bugs fix...\n');
  
  const homeDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd', 'Home');
  const productFormFiles = [
    path.join(homeDir, 'Tools', 'ProductForm.jsx'),
    path.join(homeDir, 'Service', 'ProductForm.jsx'),
    path.join(homeDir, 'ProductTools', 'ProductForm.jsx'),
    path.join(homeDir, 'PopularProducts', 'ProductForm.jsx'),
    path.join(homeDir, 'Paints', 'ProductForm.jsx'),
    path.join(homeDir, 'Offer', 'ProductForm.jsx'),
    path.join(homeDir, 'Items', 'ProductForm.jsx'),
    path.join(homeDir, 'ImageSlider', 'ToolsImage', 'ProductForm.jsx'),
    path.join(homeDir, 'ImageSlider', 'SanitaryImage', 'ProductForm.jsx'),
    path.join(homeDir, 'ImageSlider', 'PaintsImage', 'ProductForm.jsx'),
    path.join(homeDir, 'ImageSlider', 'FaucetImage', 'ProductForm.jsx'),
    path.join(homeDir, 'ImageSlider', 'ElectricImage', 'ProductForm.jsx'),
    path.join(homeDir, 'Electrical', 'ProductForm.jsx'),
    path.join(homeDir, 'Categories', 'ProductForm.jsx'),
    path.join(homeDir, 'CardSlider', 'ProductForm.jsx'),
    path.join(homeDir, 'Card', 'ProductForm.jsx'),
    path.join(homeDir, 'Brands', 'ProductForm.jsx'),
  ];
  
  console.log(`📁 Found ${productFormFiles.length} ProductForm.jsx files in Home folder\n`);
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const filePath of productFormFiles) {
    try {
      if (fs.existsSync(filePath)) {
        const wasFixed = fixProductFormFile(filePath);
        if (wasFixed) {
          fixedCount++;
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Files with errors: ${errorCount}`);
  console.log(`📁 Total files processed: ${productFormFiles.length}`);
  console.log('\n🎉 Remaining Home folder bugs fix completed!');
}

main();
