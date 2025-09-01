const fs = require('fs');
const path = require('path');

// Define the correct API endpoint mappings
const correctEndpoints = {
  'Wrench': 'wrench',
  'Spanners': 'spanners',
  'Socketset': 'socketset',
  'Plier': 'plier',
  'Multimeter': 'multimeter',
  'Lubrications': 'lubrications',
  'Hammer': 'hammer',
  'Cutters': 'cutters',
  'Crowbar': 'crowbar',
  'Clamps': 'clamps',
  'Chisels': 'chisels',
  'PowerTools/Drill': 'powertools/drill',
  'PowerTools/Grinders': 'powertools/grinders',
  'PowerTools/Marble Cutter': 'powertools/marble-cutter',
  'abrasives/CutOffWheel': 'abrasives/cutOffWheel',
  'abrasives/DiamondBlades': 'abrasives/diamondBlades'
};

// Function to fix a single file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix the API endpoints
    for (const [incorrect, correct] of Object.entries(correctEndpoints)) {
      const oldPattern = `\${API_BASE_URL}/tools/${incorrect}`;
      const newPattern = `\${API_BASE_URL}/tools/${correct}`;
      
      if (content.includes(oldPattern)) {
        content = content.replace(new RegExp(oldPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPattern);
        modified = true;
        console.log(`Fixed ${incorrect} -> ${correct} in ${filePath}`);
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively find and fix ProductForm.jsx files
function fixDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        fixDirectory(fullPath);
      } else if (item === 'ProductForm.jsx') {
        fixFile(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
}

// Main execution
const toolsDir = path.join(__dirname, '..', 'app', 'Dashboard', 'ProductAdd', 'Tools');
console.log('Starting to fix tools API endpoints...');
console.log('Tools directory:', toolsDir);

if (fs.existsSync(toolsDir)) {
  fixDirectory(toolsDir);
  console.log('Finished fixing tools API endpoints!');
} else {
  console.error('Tools directory not found:', toolsDir);
}
