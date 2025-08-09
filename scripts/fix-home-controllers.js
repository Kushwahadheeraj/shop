const fs = require('fs');
const path = require('path');

const homeControllersDir = path.join(__dirname, '../backend/controllers/home');

// List of home controllers to fix
const homeControllers = [
  'sanitaryImageController.js',
  'homeElectricalController.js',
  'offerController.js',
  'serviceController.js',
  'productToolsController.js',
  'popularProductsController.js',
  'homePaintsController.js',
  'itemsController.js',
  'categoriesController.js',
  'cardSliderController.js',
  'cardController.js',
  'brandsController.js',
  'electricImageController.js',
  'faucetImageController.js',
  'toolsImageController.js',
  'paintsImageController.js'
];

// Category mappings for home controllers
const categoryMappings = {
  'sanitaryImage': 'SanitaryImage',
  'homeElectrical': 'HomeElectrical',
  'offer': 'Offer',
  'service': 'Service',
  'productTools': 'ProductTools',
  'popularProducts': 'PopularProducts',
  'homePaints': 'HomePaints',
  'items': 'Items',
  'categories': 'Categories',
  'cardSlider': 'CardSlider',
  'card': 'Card',
  'brands': 'Brands',
  'electricImage': 'ElectricImage',
  'faucetImage': 'FaucetImage',
  'toolsImage': 'ToolsImage',
  'paintsImage': 'PaintsImage'
};

function fixHomeController(filePath, oldCategory, newCategory) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix category in create function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in create: ${path.basename(filePath)}`);
    }

    if (content.includes(`category: rest.category || '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: rest\.category \\|\\| '${oldCategory}'`, 'g'), `category: rest.category || '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in create: ${path.basename(filePath)}`);
    }

    // Fix category in update function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in update: ${path.basename(filePath)}`);
    }

    // Fix category in getAll function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in getAll: ${path.basename(filePath)}`);
    }

    // Fix category in getOne function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in getOne: ${path.basename(filePath)}`);
    }

    // Fix category in delete function
    if (content.includes(`category: '${oldCategory}'`)) {
      content = content.replace(new RegExp(`category: '${oldCategory}'`, 'g'), `category: '${newCategory}'`);
      modified = true;
      console.log(`✅ Fixed category in delete: ${path.basename(filePath)}`);
    }

    // Fix error response format
    if (content.includes('res.status(500).json({ message: err.message });')) {
      content = content.replace(/res\.status\(500\)\.json\(\{ message: err\.message \}\);/g, 'res.status(500).json({ error: err.message });');
      modified = true;
      console.log(`✅ Fixed error response format: ${path.basename(filePath)}`);
    }

    if (content.includes('res.status(404).json({ message: \'Not found\' });')) {
      content = content.replace(/res\.status\(404\)\.json\(\{ message: 'Not found' \}\);/g, 'res.status(404).json({ error: \'Not found\' });');
      modified = true;
      console.log(`✅ Fixed 404 error response format: ${path.basename(filePath)}`);
    }

    // Fix success response format to be consistent
    if (content.includes('success: false, message: \'Error')) {
      content = content.replace(/success: false, message: 'Error/g, 'success: false, error:');
      modified = true;
      console.log(`✅ Fixed success response format: ${path.basename(filePath)}`);
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

// Fix all home controllers
console.log('🔧 Fixing home controllers...\n');

let fixedCount = 0;
homeControllers.forEach(controller => {
  const filePath = path.join(homeControllersDir, controller);
  if (fs.existsSync(filePath)) {
    // Extract category name from filename
    const categoryName = controller.replace('Controller.js', '');
    const oldCategory = categoryMappings[categoryName] || categoryName;
    const newCategory = oldCategory; // Most home controllers already have proper capitalization
    
    if (fixHomeController(filePath, oldCategory, newCategory)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${controller}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} home controllers successfully!`);
