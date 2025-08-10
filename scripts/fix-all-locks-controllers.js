const fs = require('fs');
const path = require('path');

// Function to fix a controller file
function fixController(filePath, controllerName) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix 1: Add image validation and required fields to create method
    const createMethodRegex = new RegExp(`exports\\.create${controllerName}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*\\{[^}]*\\}`, 's');
    const createMethodMatch = content.match(createMethodRegex);
    
    if (createMethodMatch) {
      const oldCreateMethod = createMethodMatch[0];
      
      // Check if it already has image validation
      if (!oldCreateMethod.includes('req.files.length < 1')) {
        // Add image validation and required fields
        const newCreateMethod = `exports.create${controllerName} = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    const product = new Lock({
      ...req.body,
      photos: photoUrls,
      category: '${controllerName}',
      type: '${controllerName}',
      productNo: req.body.productNo || '${controllerName.charAt(0).toUpperCase() + controllerName.slice(1)}-' + Date.now(),
      productQualityName: req.body.productQualityName || 'Standard'
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}`;
        
        content = content.replace(oldCreateMethod, newCreateMethod);
        modified = true;
        console.log(`✅ Fixed create method in ${path.basename(filePath)}`);
      }
    }

    // Fix 2: Change 'type' to 'category' in getAll method
    const getAllMethodRegex = new RegExp(`exports\\.getAll${controllerName}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*\\{[^}]*\\}`, 's');
    const getAllMethodMatch = content.match(getAllMethodRegex);
    
    if (getAllMethodMatch) {
      const oldGetAllMethod = getAllMethodMatch[0];
      
      if (oldGetAllMethod.includes("type: '") || oldGetAllMethod.includes('type: "')) {
        const newGetAllMethod = oldGetAllMethod.replace(/type:\s*['"][^'"]*['"]/g, "category: '${controllerName}'");
        content = content.replace(oldGetAllMethod, newGetAllMethod);
        modified = true;
        console.log(`✅ Fixed getAll method in ${path.basename(filePath)}`);
      }
    }

    // Fix 3: Change 'type' to 'category' in delete method
    const deleteMethodRegex = new RegExp(`exports\\.delete${controllerName}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*\\{[^}]*\\}`, 's');
    const deleteMethodMatch = content.match(deleteMethodRegex);
    
    if (deleteMethodMatch) {
      const oldDeleteMethod = deleteMethodMatch[0];
      
      if (oldDeleteMethod.includes("type: '") || oldDeleteMethod.includes('type: "')) {
        const newDeleteMethod = oldDeleteMethod.replace(/type:\s*['"][^'"]*['"]/g, "category: '${controllerName}'");
        content = content.replace(oldDeleteMethod, newDeleteMethod);
        modified = true;
        console.log(`✅ Fixed delete method in ${path.basename(filePath)}`);
      }
    }

    // Fix 4: Change 'type' to 'category' in getOne method
    const getOneMethodRegex = new RegExp(`exports\\.getOne${controllerName}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*\\{[^}]*\\}`, 's');
    const getOneMethodMatch = content.match(getOneMethodRegex);
    
    if (getOneMethodMatch) {
      const oldGetOneMethod = getOneMethodMatch[0];
      
      if (oldGetOneMethod.includes("type: '") || oldGetOneMethod.includes('type: "')) {
        const newGetOneMethod = oldGetOneMethod.replace(/type:\s*['"][^'"]*['"]/g, "category: '${controllerName}'");
        content = content.replace(oldGetOneMethod, newGetOneMethod);
        modified = true;
        console.log(`✅ Fixed getOne method in ${path.basename(filePath)}`);
      }
    }

    // Fix 5: Add image validation to update method if it exists
    const updateMethodRegex = new RegExp(`exports\\.update${controllerName}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*\\{[^}]*\\}`, 's');
    const updateMethodMatch = content.match(updateMethodRegex);
    
    if (updateMethodMatch) {
      const oldUpdateMethod = updateMethodMatch[0];
      
      if (!oldUpdateMethod.includes('req.files.length < 1')) {
        // Add image validation to update method
        const newUpdateMethod = oldUpdateMethod.replace(
          /try\s*\{/,
          `try {
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ error: 'No more than 5 images allowed.' });
      }
      const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
      req.body.photos = photoUrls;
    }`
        );
        
        content = content.replace(oldUpdateMethod, newUpdateMethod);
        modified = true;
        console.log(`✅ Fixed update method in ${path.basename(filePath)}`);
      }
    }

    // Fix 6: Fix error handling in delete method (ensure proper 404 message)
    if (deleteMethodMatch) {
      const oldDeleteMethod = deleteMethodMatch[0];
      if (oldDeleteMethod.includes('res.json({ error: err.message })') && oldDeleteMethod.includes('if (!item)')) {
        const newDeleteMethod = oldDeleteMethod.replace(
          /if\s*\(\s*!item\s*\)\s*\{[^}]*res\.json\(\s*\{\s*error:\s*err\.message\s*\}\s*\)[^}]*\}/g,
          `if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }`
        );
        
        if (newDeleteMethod !== oldDeleteMethod) {
          content = content.replace(oldDeleteMethod, newDeleteMethod);
          modified = true;
          console.log(`✅ Fixed error handling in delete method of ${path.basename(filePath)}`);
        }
      }
    }

    // Fix 7: Fix error handling in getOne method (ensure proper 404 message)
    if (getOneMethodMatch) {
      const oldGetOneMethod = getOneMethodMatch[0];
      if (oldGetOneMethod.includes('res.json({ error: err.message })') && oldGetOneMethod.includes('if (!item)')) {
        const newGetOneMethod = oldGetOneMethod.replace(
          /if\s*\(\s*!item\s*\)\s*\{[^}]*res\.json\(\s*\{\s*error:\s*err\.message\s*\}\s*\)[^}]*\}/g,
          `if (!item) {
      return res.status(404).json({ error: 'Not found' });
    }`
        );
        
        if (newGetOneMethod !== oldGetOneMethod) {
          content = content.replace(oldGetOneMethod, newGetOneMethod);
          modified = true;
          console.log(`✅ Fixed error handling in getOne method of ${path.basename(filePath)}`);
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`📝 Updated ${path.basename(filePath)}`);
    } else {
      console.log(`✅ ${path.basename(filePath)} is already fixed or doesn't need changes`);
    }

  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all controller files
function fixAllControllers(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      fixAllControllers(fullPath);
    } else if (item.endsWith('Controller.js') || item.endsWith('Controllers.js')) {
      // Extract controller name from filename
      let controllerName = item.replace(/Controller\.js$/, '').replace(/Controllers\.js$/, '');
      
      // Handle special cases
      if (controllerName === 'mortiseLockBody') controllerName = 'MortiseLockBody';
      else if (controllerName === 'morticeLocks') controllerName = 'MorticeLocks';
      else if (controllerName === 'patchFittings') controllerName = 'PatchFittings';
      
      console.log(`\n🔧 Processing ${item} (${controllerName})...`);
      fixController(fullPath, controllerName);
    }
  }
}

// Main execution
console.log('🚀 Starting systematic fix of all locks controllers...\n');

const locksControllersDir = path.join(__dirname, '..', 'backend', 'controllers', 'locks');
fixAllControllers(locksControllersDir);

console.log('\n✨ All controllers have been processed!');
console.log('\n📋 Summary of fixes applied:');
console.log('   ✅ Added image validation (min 1, max 5 photos) to create methods');
console.log('   ✅ Added required fields (type, productNo, productQualityName) to create methods');
console.log('   ✅ Fixed type vs category inconsistency in queries');
console.log('   ✅ Added image validation to update methods');
console.log('   ✅ Fixed error handling for 404 cases');
console.log('   ✅ Added minPrice and maxPrice fields to LocksModels.js (already done)');
