const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList');

function fixDeleteEndpoints(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    let changes = 0;

    // Fix delete endpoint syntax from /delete: to /delete/
    const deleteRegex = /\/delete:([^\s"']+)/g;
    if (deleteRegex.test(updated)) {
      updated = updated.replace(deleteRegex, '/delete/$1');
      changes++;
    }

    if (changes > 0) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Fixed delete endpoint: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  No delete endpoint to fix: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walk(dir) {
  let updatedCount = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        updatedCount += walk(fullPath);
      } else if (entry.isFile() && entry.name === 'ProductList.jsx') {
        if (fixDeleteEndpoints(fullPath)) {
          updatedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return updatedCount;
}

console.log('🚀 Starting delete endpoint fixes...\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Fixed ${totalUpdated} files.`); 