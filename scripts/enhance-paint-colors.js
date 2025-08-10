const fs = require('fs');
const path = require('path');

// Function to update a single ProductForm.jsx file with enhanced color selection
function enhanceColorSelection(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Check if the file already has the enhanced color selection
    if (content.includes('Predefined Colors Select')) {
      console.log(`⏭️  Already enhanced: ${filePath}`);
      return false;
    }

    // Find the colors section and replace it with enhanced version
    const colorsSectionRegex = /{\/\* Colors \*\/}[\s\S]*?{\/\* Description \*\/}/;
    const colorsSectionMatch = content.match(colorsSectionRegex);
    
    if (colorsSectionMatch) {
      const oldColorsSection = colorsSectionMatch[0];
      const enhancedColorsSection = `      {/* Colors */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Colors</label>
        
        {/* Predefined Colors Select */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 mb-2">Select from predefined colors:</p>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {colorOptions.map((color) => (
              <Button
                key={color}
                type="button"
                variant={form.colors.includes(color) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (!form.colors.includes(color)) {
                    setForm(prev => ({ ...prev, colors: [...prev.colors, color] }));
                  }
                }}
                className="text-xs"
                disabled={form.colors.includes(color)}
              >
                {color}
              </Button>
            ))}
          </div>
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
      </div>
      {/* Description */}`;

      content = content.replace(oldColorsSection, enhancedColorsSection);
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Enhanced: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️  No colors section found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error enhancing ${filePath}:`, error.message);
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
const productFormFiles = findProductFormFiles(paintDir);

console.log(`Found ${productFormFiles.length} ProductForm.jsx files in Paint directory:`);
console.log('=' .repeat(60));

let enhancedCount = 0;
for (const file of productFormFiles) {
  if (enhanceColorSelection(file)) {
    enhancedCount++;
  }
}

console.log('=' .repeat(60));
console.log(`Enhancement complete! Enhanced ${enhancedCount} files.`);
console.log(`Total files processed: ${productFormFiles.length}`);
