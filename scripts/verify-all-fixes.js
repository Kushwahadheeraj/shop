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

// Function to check for remaining issues
function checkController(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for lowercase category names
    const lowercaseCategoryMatches = content.match(/category:\s*'([a-z][a-zA-Z]*)'/g);
    if (lowercaseCategoryMatches) {
      issues.push(`❌ Lowercase category found: ${lowercaseCategoryMatches.join(', ')}`);
    }
    
    // Check for old error response format
    if (content.includes('res.status(500).json({ message: err.message });')) {
      issues.push('❌ Old error response format found');
    }
    
    if (content.includes('res.status(404).json({ message: \'Not found\' });')) {
      issues.push('❌ Old 404 error response format found');
    }
    
    // Check for model name mismatches
    const modelMismatches = [
      'Uncategorized.findByIdAndDelete',
      'Lighting.findByIdAndDelete',
      'HomeDecor.findByIdAndDelete',
      'Home.findByIdAndDelete',
      'Hardware.findByIdAndDelete',
      'Fitting.findByIdAndDelete',
      'Fiber.findByIdAndDelete',
      'Brush.findByIdAndDelete',
      'Cleaning.findByIdAndDelete',
      'Adhesives.findByIdAndDelete',
      'Cements.findByIdAndDelete',
      'Dry.findByIdAndDelete'
    ];
    
    modelMismatches.forEach(mismatch => {
      if (content.includes(mismatch)) {
        issues.push(`❌ Model name mismatch found: ${mismatch}`);
      }
    });
    
    return issues;
  } catch (error) {
    return [`❌ Error reading file: ${error.message}`];
  }
}

// Main execution
console.log('🔍 Verifying all controller fixes...\n');

const controllersDir = path.join(__dirname, '../backend/controllers');
const allControllerFiles = findControllerFiles(controllersDir);

console.log(`📁 Found ${allControllerFiles.length} controller files to verify...\n`);

let filesWithIssues = 0;
let totalIssues = 0;

allControllerFiles.forEach(filePath => {
  const relativePath = path.relative(controllersDir, filePath);
  const issues = checkController(filePath);
  
  if (issues.length > 0) {
    console.log(`\n📄 ${relativePath}:`);
    issues.forEach(issue => {
      console.log(`  ${issue}`);
    });
    filesWithIssues++;
    totalIssues += issues.length;
  }
});

console.log(`\n📊 Verification Summary:`);
console.log(`✅ Files without issues: ${allControllerFiles.length - filesWithIssues}`);
console.log(`❌ Files with issues: ${filesWithIssues}`);
console.log(`🔧 Total issues found: ${totalIssues}`);

if (filesWithIssues === 0) {
  console.log(`\n🎉 All controllers have been successfully fixed!`);
} else {
  console.log(`\n⚠️  Some controllers still need attention.`);
}
