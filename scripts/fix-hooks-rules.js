const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'app/Dashboard/BillManagement/page.js',
  'app/Dashboard/GSTBillManagement/page.js'
];

function fixHooksRules(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    console.log(`🔧 Fixing hooks rules in: ${filePath}`);
    
    // Find the early return pattern and remove duplicate functions after it
    const earlyReturnMatch = content.match(/(\s+if\s*\(\s*!isAuthenticated\s*\|\|\s*!isSeller\s*\)\s*\{[\s\S]*?return\s*\([\s\S]*?\);\s*\})/);
    
    if (earlyReturnMatch) {
      const earlyReturnEnd = earlyReturnMatch.index + earlyReturnMatch[0].length;
      
      // Find the next function definition after the early return
      const afterEarlyReturn = content.substring(earlyReturnEnd);
      const nextFunctionMatch = afterEarlyReturn.match(/(\s*\/\/\s*Fetch\s+\w+[\s\S]*?const\s+\w+\s*=\s*useCallback)/);
      
      if (nextFunctionMatch) {
        const duplicateStart = earlyReturnEnd + nextFunctionMatch.index;
        
        // Find where the duplicate functions end (look for the next non-function code)
        const afterDuplicates = content.substring(duplicateStart);
        const endMatch = afterDuplicates.match(/(\s*const\s+handle\w+\s*=\s*async\s*\(|const\s+format\w+\s*=\s*\(|return\s*\()/);
        
        if (endMatch) {
          const duplicateEnd = duplicateStart + endMatch.index;
          
          // Remove the duplicate functions
          content = content.substring(0, duplicateStart) + content.substring(duplicateEnd);
          
          console.log(`✅ Removed duplicate functions from: ${filePath}`);
        }
      }
    }
    
    // Fix missing dependencies in useCallback
    content = content.replace(
      /useCallback\([^,]+,\s*\[\s*([^\]]*)\s*\]\s*\)/g,
      (match, deps) => {
        // Add missing dependencies based on function content
        let newDeps = deps;
        
        if (match.includes('calculateStatsFromBills') && !deps.includes('calculateStatsFromBills')) {
          newDeps = newDeps ? `${newDeps}, calculateStatsFromBills` : 'calculateStatsFromBills';
        }
        
        if (match.includes('shops') && !deps.includes('shops')) {
          newDeps = newDeps ? `${newDeps}, shops` : 'shops';
        }
        
        // Remove unnecessary dependencies
        if (match.includes('searchTerm') && !match.includes('searchTerm')) {
          newDeps = newDeps.replace(/,\s*searchTerm/g, '').replace(/searchTerm,\s*/g, '');
        }
        
        return match.replace(`[${deps}]`, `[${newDeps}]`);
      }
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed hooks rules in: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('🚀 Fixing React Hooks rules violations...');

for (const file of filesToFix) {
  if (fs.existsSync(file)) {
    fixHooksRules(file);
  } else {
    console.log(`⚠️ File not found: ${file}`);
  }
}

console.log('✅ React Hooks rules violations fixed!');
