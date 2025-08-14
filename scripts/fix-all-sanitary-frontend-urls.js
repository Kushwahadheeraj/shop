const fs = require('fs');
const path = require('path');

const formsDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Sanitary');

// Function to convert camelCase to kebab-case
function camelToKebab(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

// Function to process a single form file
function processForm(formPath, formName) {
  if (!fs.existsSync(formPath)) {
    return false;
  }
  
  let content = fs.readFileSync(formPath, 'utf8');
  
  // Check if already fixed
  if (content.includes('sanitary/acrylic-products/create')) {
    console.log(`⚠️  ${formName} already fixed, skipping...`);
    return true;
  }
  
  // Find and replace API URLs
  const urlPattern = /(\${API_BASE_URL}\/sanitary\/)([A-Za-z0-9\/]+)(\/create)/g;
  let match;
  let updated = false;
  
  while ((match = urlPattern.exec(content)) !== null) {
    const fullMatch = match[0];
    const prefix = match[1];
    const pathPart = match[2];
    const suffix = match[3];
    
    // Convert path to kebab-case
    const kebabPath = pathPart.split('/').map(part => camelToKebab(part)).join('/');
    const newUrl = `${prefix}${kebabPath}${suffix}`;
    
    content = content.replace(fullMatch, newUrl);
    console.log(`✅ Fixed URL in ${formName}: ${fullMatch} → ${newUrl}`);
    updated = true;
  }
  
  if (updated) {
    // Write the updated content back
    fs.writeFileSync(formPath, content, 'utf8');
    console.log(`✅ Updated ${formName}`);
    return true;
  } else {
    console.log(`⚠️  No URLs found to fix in ${formName}`);
    return false;
  }
}

// Function to process all forms in a directory recursively
function processDirectory(dirPath, dirName = '') {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subProcessed = processDirectory(itemPath, item);
      processedCount += subProcessed;
    } else if (item === 'ProductForm.jsx') {
      // Process form files
      const fullPath = path.join(dirName, item);
      if (processForm(itemPath, fullPath)) {
        processedCount++;
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting sanitary frontend URL fixes...\n');

// Process all forms recursively
const totalProcessed = processDirectory(formsDir);

console.log(`\n🎉 URL fixes completed! Total forms processed: ${totalProcessed}`);
console.log('All sanitary frontend forms have been updated with correct API URLs!');
