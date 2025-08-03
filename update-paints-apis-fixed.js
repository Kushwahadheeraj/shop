const fs = require('fs');
const path = require('path');

const PAINTS_FILE_PATH = path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Home', 'Paints', 'ProductList.jsx');

function updatePaintsFile() {
  try {
    let content = fs.readFileSync(PAINTS_FILE_PATH, 'utf8');
    let updated = content;
    let changes = 0;

    // Update API_URL from /home/paints to /paint/paints
    const apiUrlRegex = /const API_URL = `\$\{API_BASE_URL\}\/home\/paints`;/;
    const newApiUrl = `const API_URL = \`\${API_BASE_URL}/paint/paints\`;`;
    
    if (apiUrlRegex.test(content)) {
      updated = updated.replace(apiUrlRegex, newApiUrl);
      changes++;
      console.log('✅ Updated API_URL from /home/paints to /paint/paints');
    }

    // Fix delete endpoint syntax from /delete: to /delete/
    const deleteRegex = /\/delete:([^\s"']+)/g;
    if (deleteRegex.test(updated)) {
      updated = updated.replace(deleteRegex, '/delete/$1');
      changes++;
      console.log('✅ Fixed delete endpoint syntax from /delete: to /delete/');
    }

    if (changes > 0) {
      fs.writeFileSync(PAINTS_FILE_PATH, updated, 'utf8');
      console.log(`✅ Successfully updated ${PAINTS_FILE_PATH}`);
      console.log(`✅ Made ${changes} changes to the file`);
      return true;
    } else {
      console.log('⏭️  No changes needed - file is already up to date');
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${PAINTS_FILE_PATH}:`, error.message);
    return false;
  }
}

console.log('🚀 Starting Paints ProductList API URL update...\n');
console.log('📋 This will update the API_URL to match apiS.js exactly\n');
console.log('📋 Target file: ' + PAINTS_FILE_PATH + '\n');

const updated = updatePaintsFile();

if (updated) {
  console.log('\n✅ Successfully updated Paints ProductList.jsx!');
  console.log('🔧 API_URL now matches the exact endpoint from apiS.js: /paint/paints');
  console.log('🔧 Delete endpoint has been fixed from /delete: to /delete/');
} else {
  console.log('\n⏭️  No updates were needed - file is already correct');
} 