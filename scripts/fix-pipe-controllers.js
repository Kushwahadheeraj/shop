const fs = require('fs');
const path = require('path');

const pipeControllersDir = path.join(__dirname, '../backend/controllers/pipe');

// List of pipe controllers to fix
const pipeControllers = [
  'princePipesControllers.js',
  'supremePipesControllers.js',
  'birlaPipesControllers.js',
  'prakashPipesControllers.js',
  'ashirvadPipesController.js',
  'astralPipesController.js',
  'finolexPipesController.js',
  'nepulPipes.js'
];

// Category mappings
const categoryMappings = {
  'princePipes': 'PrincePipes',
  'supremePipes': 'SupremePipes',
  'birlaPipes': 'BirlaPipes',
  'prakashPipes': 'PrakashPipes',
  'ashirvadPipes': 'AshirvadPipes',
  'astralPipes': 'AstralPipes',
  'finolexPipes': 'FinolexPipes',
  'nepulPipes': 'NepulPipes'
};

function fixPipeController(filePath, oldCategory, newCategory) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix category in create function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in create: ${filePath}`);
    }

    // Fix category in update function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in update: ${filePath}`);
    }

    // Fix error response format
    if (content.includes('res.status(500).json({ message: err.message });')) {
      content = content.replace(/res\.status\(500\)\.json\(\{ message: err\.message \}\);/g, 'res.status(500).json({ error: err.message });');
      modified = true;
      console.log(`✅ Fixed error response format: ${filePath}`);
    }

    if (content.includes('res.status(404).json({ message: \'Not found\' });')) {
      content = content.replace(/res\.status\(404\)\.json\(\{ message: 'Not found' \}\);/g, 'res.status(404).json({ error: \'Not found\' });');
      modified = true;
      console.log(`✅ Fixed 404 error response format: ${filePath}`);
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

// Fix all pipe controllers
console.log('🔧 Fixing pipe controllers...\n');

let fixedCount = 0;
pipeControllers.forEach(controller => {
  const filePath = path.join(pipeControllersDir, controller);
  if (fs.existsSync(filePath)) {
    // Extract category name from filename
    const categoryName = controller.replace('Controller.js', '').replace('s.js', '');
    const oldCategory = categoryName.charAt(0).toLowerCase() + categoryName.slice(1);
    const newCategory = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    
    if (fixPipeController(filePath, oldCategory, newCategory)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${controller}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} pipe controllers successfully!`);
