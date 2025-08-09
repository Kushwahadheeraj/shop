const fs = require('fs');
const path = require('path');

// Function to recursively find all controller files
function findControllerFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findControllerFiles(filePath, fileList);
    } else if (file.endsWith('Controller.js') || file.endsWith('Controllers.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix category filtering issues
function fixCategoryIssues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const fileName = path.basename(filePath);
    
    // Extract category name from filename
    const categoryName = fileName.replace('Controller.js', '').replace('Controllers.js', '');
    const properCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    
    // Fix getAll function - add category filter
    const getAllRegex = new RegExp(`exports\\.getAll${properCategory}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*{[^}]*const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.find\\(\\);`, 'g');
    if (getAllRegex.test(content)) {
      content = content.replace(
        new RegExp(`(exports\\.getAll${properCategory}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*{[^}]*const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.find\\(\\);)`, 'g'),
        `$1.replace('find();', 'find({ category: '${properCategory}' });')`
      );
      content = content.replace(
        new RegExp(`(const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.find\\(\\);)`, 'g'),
        `const ${categoryName.toLowerCase()}s = await ${properCategory}Models.find({ category: '${properCategory}' });`
      );
      modified = true;
      console.log(`✅ Fixed getAll function in ${fileName}`);
    }
    
    // Fix getOne function - add category filter
    const getOneRegex = new RegExp(`exports\\.getOne${properCategory}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*{[^}]*const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.findById\\(req\\.params\\.id\\);`, 'g');
    if (getOneRegex.test(content)) {
      content = content.replace(
        new RegExp(`(const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.findById\\(req\\.params\\.id\\);)`, 'g'),
        `const ${categoryName.toLowerCase()} = await ${properCategory}Models.findOne({ _id: req.params.id, category: '${properCategory}' });`
      );
      modified = true;
      console.log(`✅ Fixed getOne function in ${fileName}`);
    }
    
    // Fix delete function - add category filter
    const deleteRegex = new RegExp(`exports\\.delete${properCategory}\\s*=\\s*async\\s*\\(req,\\s*res\\)\\s*=>\\s*{[^}]*const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.findByIdAndDelete\\(req\\.params\\.id\\);`, 'g');
    if (deleteRegex.test(content)) {
      content = content.replace(
        new RegExp(`(const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.findByIdAndDelete\\(req\\.params\\.id\\);)`, 'g'),
        `const ${categoryName.toLowerCase()} = await ${properCategory}Models.findOneAndDelete({ _id: req.params.id, category: '${properCategory}' });`
      );
      modified = true;
      console.log(`✅ Fixed delete function in ${fileName}`);
    }
    
    // Fix update function - add category filter
    const updateRegex = new RegExp(`const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.findOneAndUpdate\\(\\s*{\\s*_id:\\s*req\\.params\\.id\\s*},`, 'g');
    if (updateRegex.test(content)) {
      content = content.replace(
        new RegExp(`(const\\s+\\w+\\s*=\\s*await\\s+\\w+Models\\.findOneAndUpdate\\(\\s*{\\s*_id:\\s*req\\.params\\.id\\s*},)`, 'g'),
        `const ${categoryName.toLowerCase()} = await ${properCategory}Models.findOneAndUpdate({ _id: req.params.id, category: '${properCategory}' },`
      );
      modified = true;
      console.log(`✅ Fixed update function in ${fileName}`);
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
console.log('🔧 Fixing all category filtering issues...\n');

const controllersDir = path.join(__dirname, '../backend/controllers');
const allControllerFiles = findControllerFiles(controllersDir);

console.log(`📁 Found ${allControllerFiles.length} controller files to check...\n`);

let fixedCount = 0;
allControllerFiles.forEach(filePath => {
  const relativePath = path.relative(controllersDir, filePath);
  if (fixCategoryIssues(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} controllers successfully!`);
console.log(`📁 Total controllers processed: ${allControllerFiles.length}`);
