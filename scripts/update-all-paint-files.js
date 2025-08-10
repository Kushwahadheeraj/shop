const fs = require('fs');
const path = require('path');

// Function to update a single ProductForm.jsx file
function updateProductFormFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Check if file already has the import
    if (!content.includes('import { colorOptions } from "@/lib/colorOptions";')) {
      console.log(`❌ ${filePath} - Missing import, skipping...`);
      return false;
    }

    // Remove local colorOptions array if it exists
    const localColorOptionsPattern = /(\s+)\/\/ Predefined color options imported from shared config\s+const colorOptions = \[\s+["\w\s,]+"\]\s*;/;
    if (localColorOptionsPattern.test(content)) {
      content = content.replace(localColorOptionsPattern, '');
      updated = true;
      console.log(`✅ ${filePath} - Removed local colorOptions array`);
    }

    // Update the color UI section
    const oldColorUI = /(\s+)\{\/\* Colors \*\/\s+<div className="space-y-2">\s+<label className="block text-sm font-medium">Colors<\/label>\s+<div className="flex gap-2 mb-2">\s+<Input value={colorInput} onChange={e => setColorInput\(e\.target\.value\)} onKeyDown={e => \{ if \(e\.key === 'Enter'\) \{ e\.preventDefault\(\); handleAddColor\(\); \}\}} placeholder="Type color and press Enter or Add" \/>\s+<Button type="button" onClick={handleAddColor} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add<\/Button>\s+<\/div>\s+<div className="flex flex-wrap gap-2">\s+\{form\.colors\.map\(\(color, idx\) => \(\s+<Badge key={color} variant="secondary" className="flex items-center">\s+\{color\}\s+<button type="button" onClick={() => handleRemoveColor\(idx\)} className="ml-2 text-red-500">×<\/button>\s+<\/Badge>\s+\)\)\}\s+<\/div>\s+<\/div>/;

    const newColorUI = `      {/* Colors */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Colors</label>
        
        {/* Predefined Colors Select */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">Select from predefined colors:</p>
          <select 
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
            onChange={(e) => {
              const selectedColor = e.target.value;
              if (selectedColor && !form.colors.includes(selectedColor)) {
                setForm(prev => ({ ...prev, colors: [...prev.colors, selectedColor] }));
                e.target.value = ''; // Reset select
              }
            }}
          >
            <option value="">-- Select a color --</option>
            {colorOptions.map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>

        {/* Custom Color Input */}
         <div className="flex gap-2 mb-2">
          <Input 
            value={colorInput} 
            onChange={e => setColorInput(e.target.value)} 
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddColor(); }}} 
            placeholder="Type custom color and press Enter or Add" 
          />
           <Button type="button" onClick={handleAddColor} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add</Button>
        </div>

        {/* Selected Colors Display */}
         <div className="flex flex-wrap gap-2">
          {form.colors.map((color, idx) => (
            <Badge key={color} variant="secondary" className="flex items-center">
              {color}
              <button type="button" onClick={() => handleRemoveColor(idx)} className="ml-2 text-red-500">×</button>
            </Badge>
          ))}
        </div>
      </div>`;

    if (oldColorUI.test(content)) {
      content = content.replace(oldColorUI, newColorUI);
      updated = true;
      console.log(`✅ ${filePath} - Updated color UI section`);
    }

    // Write the updated content back to the file
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } else {
      console.log(`ℹ️  ${filePath} - Already up to date`);
      return false;
    }

  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Function to find all ProductForm.jsx files in the Paint directory
function findProductFormFiles(dirPath) {
  const files = [];
  
  function traverse(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);
      
      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (item === 'ProductForm.jsx') {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${currentPath}:`, error.message);
    }
  }
  
  traverse(dirPath);
  return files;
}

// Main execution
function main() {
  const paintDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd', 'Paint');
  
  if (!fs.existsSync(paintDir)) {
    console.error('❌ Paint directory not found:', paintDir);
    return;
  }
  
  console.log('🔍 Searching for ProductForm.jsx files in Paint directory...');
  const productFormFiles = findProductFormFiles(paintDir);
  
  if (productFormFiles.length === 0) {
    console.log('❌ No ProductForm.jsx files found in Paint directory');
    return;
  }
  
  console.log(`📁 Found ${productFormFiles.length} ProductForm.jsx files`);
  console.log('🚀 Starting batch update...\n');
  
  let updatedCount = 0;
  let skippedCount = 0;
  
  for (const filePath of productFormFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const wasUpdated = updateProductFormFile(relativePath);
    
    if (wasUpdated) {
      updatedCount++;
    } else {
      skippedCount++;
    }
    
    console.log(''); // Add spacing between files
  }
  
  console.log('🎉 Batch update completed!');
  console.log(`📊 Summary:`);
  console.log(`   ✅ Updated: ${updatedCount} files`);
  console.log(`   ℹ️  Skipped: ${skippedCount} files`);
  console.log(`   📁 Total: ${productFormFiles.length} files`);
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { updateProductFormFile, findProductFormFiles };
