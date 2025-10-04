const fs = require('fs');

// Fix BillManagement page
function fixBillManagement() {
  const filePath = 'app/Dashboard/BillManagement/page.js';
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('🔧 Fixing BillManagement hooks...');
  
  // Find the early return and remove everything after it until the next non-hook function
  const earlyReturnIndex = content.indexOf('if (!isAuthenticated() || !isSeller()) {');
  const returnEndIndex = content.indexOf('  }', earlyReturnIndex) + 3;
  
  // Find the next non-hook function (starts with const handle or const format)
  const afterReturn = content.substring(returnEndIndex);
  const nextFunctionMatch = afterReturn.match(/\n\s*(const\s+(handle|format)\w+\s*=)/);
  
  if (nextFunctionMatch) {
    const duplicateEndIndex = returnEndIndex + nextFunctionMatch.index;
    
    // Remove the duplicate functions
    content = content.substring(0, returnEndIndex) + '\n' + content.substring(duplicateEndIndex);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed BillManagement hooks');
  }
}

// Fix GSTBillManagement page
function fixGSTBillManagement() {
  const filePath = 'app/Dashboard/GSTBillManagement/page.js';
  let content = fs.readFileSync(filePath, 'utf8');
  
  console.log('🔧 Fixing GSTBillManagement hooks...');
  
  // Find the early return and remove everything after it until the next non-hook function
  const earlyReturnIndex = content.indexOf('if (!isAuthenticated() || !isSeller()) {');
  const returnEndIndex = content.indexOf('  }', earlyReturnIndex) + 3;
  
  // Find the next non-hook function
  const afterReturn = content.substring(returnEndIndex);
  const nextFunctionMatch = afterReturn.match(/\n\s*(const\s+(handle|format)\w+\s*=)/);
  
  if (nextFunctionMatch) {
    const duplicateEndIndex = returnEndIndex + nextFunctionMatch.index;
    
    // Remove the duplicate functions
    content = content.substring(0, returnEndIndex) + '\n' + content.substring(duplicateEndIndex);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Fixed GSTBillManagement hooks');
  }
}

console.log('🚀 Fixing React Hooks rules violations...');
fixBillManagement();
fixGSTBillManagement();
console.log('✅ React Hooks rules violations fixed!');
