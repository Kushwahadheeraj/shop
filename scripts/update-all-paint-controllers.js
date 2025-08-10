const fs = require('fs');
const path = require('path');

// Function to update a single controller file
function updateController(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // 1. Remove type field parsing and validation
    if (content.includes('Parse the type field if it\'s a JSON string')) {
      content = content.replace(/\/\/ Parse the type field if it's a JSON string[\s\S]*?} catch \(err\) \{[\s\S]*?return res\.status\(400\)\.json\(\{ error: 'Invalid type data format' \}\);[\s\S]*?}/g, '');
      updated = true;
    }

    // 2. Remove type validation
    if (content.includes('Validate that type array has at least one option with price')) {
      content = content.replace(/\/\/ Validate that type array has at least one option with price[\s\S]*?}/g, '');
      updated = true;
    }

    // 3. Add variants parsing if not present
    if (!content.includes('Parse variants if it\'s a JSON string')) {
      content = content.replace(/(const photoUrls = await Promise\.all\(req\.files\.map\(file => uploadToCloudinary\(file\.buffer\)\)\));/g, 
        `$1
    
    // Parse variants if it's a JSON string
    let productData = { ...req.body };
    if (req.body.variants && typeof req.body.variants === 'string') {
      try {
        productData.variants = JSON.parse(req.body.variants);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid variants data format' });
      }
    }`);
      updated = true;
    }

    // 4. Update the product creation to use productData instead of req.body
    if (content.includes('const product = new Paint({ ...req.body, photos: photoUrls')) {
      content = content.replace(/const product = new Paint\(\{ \.\.\.req\.body, photos: photoUrls/g, 'const product = new Paint({ ...productData, photos: photoUrls');
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

// Function to find all controller files in paint directory
function findControllerFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('Controller.js')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

// Main execution
const paintControllersDir = path.join(__dirname, '..', 'backend', 'controllers', 'paint');
console.log('Scanning for controller files in:', paintControllersDir);

const controllerFiles = findControllerFiles(paintControllersDir);
console.log(`Found ${controllerFiles.length} controller files`);

let updatedCount = 0;
let skippedCount = 0;

for (const filePath of controllerFiles) {
  const relativePath = path.relative(process.cwd(), filePath);
  console.log(`\nProcessing: ${relativePath}`);
  
  if (updateController(filePath)) {
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
console.log(`Total: ${controllerFiles.length} files`);
