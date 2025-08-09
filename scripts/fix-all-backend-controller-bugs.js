const fs = require('fs');
const path = require('path');

// Function to fix individual controller file
function fixControllerFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix model reference mismatches
    const modelFixes = [
      // Main controllers
      { from: 'Home.find()', to: 'HomeModels.find()' },
      { from: 'Uncategorized.find()', to: 'UncategorizedModels.find()' },
      { from: 'Hardware.find()', to: 'HardwareModels.find()' },
      { from: 'Fitting.find()', to: 'FittingModels.find()' },
      { from: 'Fiber.find()', to: 'FiberModels.find()' },
      { from: 'Brush.find()', to: 'BrushModels.find()' },
      { from: 'Lighting.find()', to: 'LightingModels.find()' },
      { from: 'HomeDecor.find()', to: 'HomeDecorModels.find()' },
      
      // findOneAndUpdate fixes
      { from: 'FittingModels.findOneAndUpdate(', to: 'FittingModels.findOneAndUpdate(' },
      { from: 'FiberModels.findOneAndUpdate(', to: 'FiberModels.findOneAndUpdate(' },
      { from: 'UncategorizedModels.findOneAndUpdate(', to: 'UncategorizedModels.findOneAndUpdate(' },
      
      // findOneAndDelete fixes
      { from: 'FittingModels.findOneAndDelete(', to: 'FittingModels.findOneAndDelete(' },
      { from: 'FiberModels.findOneAndDelete(', to: 'FiberModels.findOneAndDelete(' },
      { from: 'UncategorizedModels.findOneAndDelete(', to: 'UncategorizedModels.findOneAndDelete(' },
    ];

    modelFixes.forEach(fix => {
      if (content.includes(fix.from)) {
        content = content.replace(new RegExp(fix.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.to);
        modified = true;
        console.log(`✅ Fixed model reference in: ${filePath} (${fix.from} → ${fix.to})`);
      }
    });

    // 2. Add try-catch error handling if missing
    if (content.includes('const getAll') && !content.includes('try {')) {
      const getAllMatch = content.match(/const getAll[^{]*{[\s\S]*?}/);
      if (getAllMatch) {
        const getAllFunction = getAllMatch[0];
        if (!getAllFunction.includes('try {')) {
          const newGetAllFunction = getAllFunction.replace(
            /const getAll[^{]*{/,
            `const getAll = async (req, res) => {
    try {`
          ).replace(
            /res\.json\([^)]+\);/,
            `res.json({ success: true, data: products });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }`
          );
          content = content.replace(getAllFunction, newGetAllFunction);
          modified = true;
          console.log(`✅ Added error handling to getAll in: ${filePath}`);
        }
      }
    }

    // 3. Add try-catch error handling for create function
    if (content.includes('const create') && !content.includes('try {')) {
      const createMatch = content.match(/const create[^{]*{[\s\S]*?}/);
      if (createMatch) {
        const createFunction = createMatch[0];
        if (!createFunction.includes('try {')) {
          const newCreateFunction = createFunction.replace(
            /const create[^{]*{/,
            `const create = async (req, res) => {
    try {`
          ).replace(
            /res\.status\(201\)\.json\([^)]+\);/,
            `res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }`
          );
          content = content.replace(createFunction, newCreateFunction);
          modified = true;
          console.log(`✅ Added error handling to create in: ${filePath}`);
        }
      }
    }

    // 4. Add try-catch error handling for update function
    if (content.includes('const update') && !content.includes('try {')) {
      const updateMatch = content.match(/const update[^{]*{[\s\S]*?}/);
      if (updateMatch) {
        const updateFunction = updateMatch[0];
        if (!updateFunction.includes('try {')) {
          const newUpdateFunction = updateFunction.replace(
            /const update[^{]*{/,
            `const update = async (req, res) => {
    try {`
          ).replace(
            /res\.json\([^)]+\);/,
            `res.json({ success: true, data: product });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }`
          );
          content = content.replace(updateFunction, newUpdateFunction);
          modified = true;
          console.log(`✅ Added error handling to update in: ${filePath}`);
        }
      }
    }

    // 5. Add try-catch error handling for delete function
    if (content.includes('const delete') && !content.includes('try {')) {
      const deleteMatch = content.match(/const delete[^{]*{[\s\S]*?}/);
      if (deleteMatch) {
        const deleteFunction = deleteMatch[0];
        if (!deleteFunction.includes('try {')) {
          const newDeleteFunction = deleteFunction.replace(
            /const delete[^{]*{/,
            `const delete = async (req, res) => {
    try {`
          ).replace(
            /res\.json\([^)]+\);/,
            `res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }`
          );
          content = content.replace(deleteFunction, newDeleteFunction);
          modified = true;
          console.log(`✅ Added error handling to delete in: ${filePath}`);
        }
      }
    }

    // 6. Add input validation if missing
    if (content.includes('const create') && !content.includes('if (!req.body.name)')) {
      const createMatch = content.match(/const create[^{]*{[\s\S]*?}/);
      if (createMatch) {
        const createFunction = createMatch[0];
        if (!createFunction.includes('if (!req.body.name)')) {
          const newCreateFunction = createFunction.replace(
            /try {/,
            `try {
      // Input validation
      if (!req.body.name) {
        return res.status(400).json({ success: false, error: 'Name is required' });
      }
      if (!req.body.totalProduct) {
        return res.status(400).json({ success: false, error: 'Total product is required' });
      }`
          );
          content = content.replace(createFunction, newCreateFunction);
          modified = true;
          console.log(`✅ Added input validation in: ${filePath}`);
        }
      }
    }

    // 7. Add proper error responses for not found cases
    if (content.includes('if (!product)') && !content.includes('res.status(404)')) {
      content = content.replace(
        /if \(!product\) {[\s\S]*?}/g,
        `if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }`
      );
      modified = true;
      console.log(`✅ Added proper 404 responses in: ${filePath}`);
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

// Function to recursively find all controller files
function findControllerFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('Controller.js') || item.endsWith('controller.js')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Main execution
function main() {
  console.log('🔧 Starting Backend Controller bugs fix...\n');
  
  const controllersDir = path.join(__dirname, '..', 'backend', 'controllers');
  const controllerFiles = findControllerFiles(controllersDir);
  
  console.log(`📁 Found ${controllerFiles.length} controller files\n`);
  
  let fixedCount = 0;
  let errorCount = 0;
  
  for (const filePath of controllerFiles) {
    try {
      const wasFixed = fixControllerFile(filePath);
      if (wasFixed) {
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Files fixed: ${fixedCount}`);
  console.log(`❌ Files with errors: ${errorCount}`);
  console.log(`📁 Total files processed: ${controllerFiles.length}`);
  console.log('\n🎉 Backend Controller bugs fix completed!');
}

main();
