const fs = require('fs');
const path = require('path');

// Function to fix a single Paint controller file
function fixPaintController(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    console.log(`Processing: ${filePath}`);
    
    // Extract category name from the file path
    const fileName = path.basename(filePath, '.js');
    const categoryMatch = fileName.match(/^(.+?)Controller$/);
    if (!categoryMatch) {
      console.log('  - Skipping: Could not determine category name');
      return false;
    }
    
    const categoryName = categoryMatch[1];
    console.log(`  - Category: ${categoryName}`);
    
    // Fix 1: Update create function to handle variants
    if (content.includes('const product = new Paint({ ...req.body, photos: photoUrls, category:')) {
      // Check if variants handling is already present
      if (!content.includes('// Parse variants from form data')) {
        const createFunctionRegex = /exports\.create\w+ = async \(req, res\) => \{\s*try \{\s*if \(!req\.files \|\| req\.files\.length < 1\) \{\s*return res\.status\(400\)\.json\(\{ error: 'At least 1 image is required\.' \}\);\s*\}\s*if \(req\.files\.length > 5\) \{\s*return res\.status\(400\)\.json\(\{ error: 'No more than 5 images allowed\.' \}\);\s*\}\s*const photoUrls = await Promise\.all\(req\.files\.map\(file => uploadToCloudinary\(file\.buffer\)\)\);\s*const product = new Paint\(\{ \.\.\.req\.body, photos: photoUrls, category:/g;
        
        if (createFunctionRegex.test(content)) {
          content = content.replace(
            createFunctionRegex,
            `exports.create${categoryName} = async (req, res) => {
  try {
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ error: 'At least 1 image is required.' });
    }
    if (req.files.length > 5) {
      return res.status(400).json({ error: 'No more than 5 images allowed.' });
    }
    
    // Parse variants from form data
    const variants = [];
    const variantKeys = Object.keys(req.body).filter(key => key.startsWith('variants['));
    
    if (variantKeys.length > 0) {
      const variantIndices = new Set();
      variantKeys.forEach(key => {
        const match = key.match(/variants\\[(\\d+)\\]\\[(\\w+)\\]/);
        if (match) {
          const [, index, field] = match;
          variantIndices.add(parseInt(index));
        }
      });
      
      variantIndices.forEach(index => {
        const variant = {
          variantName: req.body[\`variants[\${index}][variantName]\`] || '',
          fixPrice: req.body[\`variants[\${index}][fixPrice]\`] || 0,
          discountPrice: req.body[\`variants[\${index}][discountPrice]\`] || 0
        };
        if (variant.variantName || variant.fixPrice) {
          variants.push(variant);
        }
      });
    }
    
    const photoUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file.buffer)));
    
    // Create product data with parsed variants
    const { variants: _, ...productBody } = req.body; // Remove variants from body
    const productData = { ...productBody, variants, photos: photoUrls, category:`
        );
        hasChanges = true;
        console.log('  ✓ Updated create function to handle variants');
      }
    }
    
    // Fix 2: Update update function to handle variants
    if (content.includes('let update = { ...req.body };')) {
      // Check if variants handling is already present
      if (!content.includes('// Parse variants from form data')) {
        const updateFunctionRegex = /let update = \{ \.\.\.req\.body \};/g;
        
        if (updateFunctionRegex.test(content)) {
          content = content.replace(
            updateFunctionRegex,
            `let { variants: _, ...update } = req.body; // Remove variants from body
        
    // Parse variants from form data
    const variants = [];
    const variantKeys = Object.keys(req.body).filter(key => key.startsWith('variants['));
    
    if (variantKeys.length > 0) {
      const variantIndices = new Set();
      variantKeys.forEach(key => {
        const match = key.match(/variants\\[(\\d+)\\]\\[(\\w+)\\]/);
        if (match) {
          const [, index, field] = match;
          variantIndices.add(parseInt(index));
        }
      });
      
      variantIndices.forEach(index => {
        const variant = {
          variantName: req.body[\`variants[\${index}][variantName]\`] || '',
          fixPrice: req.body[\`variants[\${index}][fixPrice]\`] || 0,
          discountPrice: req.body[\`variants[\${index}][discountPrice]\`] || 0
        };
        if (variant.variantName || variant.fixPrice) {
          variants.push(variant);
        }
      });
      
      update.variants = variants;
    }`
          );
          hasChanges = true;
          console.log('  ✓ Updated update function to handle variants');
        }
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✓ File updated: ${filePath}`);
    } else {
      console.log(`  - No changes needed: ${filePath}`);
    }
    
    return hasChanges;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to find all Paint controller files
function findPaintControllerFiles() {
  const paintControllersDir = path.join(__dirname, '..', 'backend', 'controllers', 'paint');
  const controllerFiles = [];
  
  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('Controller.js')) {
        controllerFiles.push(fullPath);
      }
    }
  }
  
  scanDirectory(paintControllersDir);
  return controllerFiles;
}

// Main execution
function main() {
  console.log('🔍 Finding all Paint controller files...');
  const files = findPaintControllerFiles();
  
  console.log(`📁 Found ${files.length} Paint controller files`);
  console.log('');
  
  let totalFixed = 0;
  
  for (const file of files) {
    const wasFixed = fixPaintController(file);
    if (wasFixed) totalFixed++;
    console.log('');
  }
  
  console.log(`🎉 Summary: Fixed ${totalFixed} out of ${files.length} controller files`);
  console.log('');
  console.log('✅ All Paint controller files have been checked and updated!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixPaintController, findPaintControllerFiles };
