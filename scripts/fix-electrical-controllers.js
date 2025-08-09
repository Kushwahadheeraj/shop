const fs = require('fs');
const path = require('path');

const electricalControllersDir = path.join(__dirname, '../backend/controllers/electrical');

// List of electrical controllers to fix
const electricalControllers = [
  'dimmerController.js',
  'distributionBoardsController.js',
  'ceilingRosesController.js',
  'doorBellsController.js',
  'dPswitchController.js',
  'earthingAccessoriesController.js',
  'eLCBsRCCBsController.js',
  'electricalFittingsController.js',
  'fanController.js',
  'flexibleConduitController.js',
  'flexibleWiresController.js',
  'fuseCarriersController.js',
  'holdersController.js',
  'indicatorController.js',
  'insulationTapesController.js',
  'isolatorsController.js',
  'jacksController.js',
  'kITKATFusesController.js',
  'lightsController.js',
  'mainSwitchController.js',
  'mCBController.js',
  'modularSurfaceBoxController.js',
  'motorsController.js',
  'motorStartersController.js',
  'othersController.js',
  'pinTopController.js',
  'plugController.js',
  'powerStripsController.js',
  'pvCClipsController.js',
  'regulatorsController.js',
  'rotarySwitchController.js',
  'socketsController.js',
  'switchAndSocketController.js',
  'switchesController.js',
  'switchPlatesController.js',
  'travelAdaptorController.js',
  'tVOutletsController.js',
  'uniSwitchController.js',
  'waterHeaterController.js',
  'wiresAndCablesController.js'
];

// Category mappings for electrical controllers
const categoryMappings = {
  'dimmer': 'Dimmer',
  'distributionBoards': 'DistributionBoards',
  'ceilingRoses': 'CeilingRoses',
  'doorBells': 'DoorBells',
  'dPswitch': 'DPSwitch',
  'earthingAccessories': 'EarthingAccessories',
  'eLCBsRCCBs': 'ELCBsRCCBs',
  'electricalFittings': 'ElectricalFittings',
  'fan': 'Fan',
  'flexibleConduit': 'FlexibleConduit',
  'flexibleWires': 'FlexibleWires',
  'fuseCarriers': 'FuseCarriers',
  'holders': 'Holders',
  'indicator': 'Indicator',
  'insulationTapes': 'InsulationTapes',
  'isolators': 'Isolators',
  'jacks': 'Jacks',
  'kITKATFuses': 'KITKATFuses',
  'lights': 'Lights',
  'mainSwitch': 'MainSwitch',
  'mCB': 'MCB',
  'modularSurfaceBox': 'ModularSurfaceBox',
  'motors': 'Motors',
  'motorStarters': 'MotorStarters',
  'others': 'Others',
  'pinTop': 'PinTop',
  'plug': 'Plug',
  'powerStrips': 'PowerStrips',
  'pvCClips': 'PVCClips',
  'regulators': 'Regulators',
  'rotarySwitch': 'RotarySwitch',
  'sockets': 'Sockets',
  'switchAndSocket': 'SwitchAndSocket',
  'switches': 'Switches',
  'switchPlates': 'SwitchPlates',
  'travelAdaptor': 'TravelAdaptor',
  'tVOutlets': 'TVOutlets',
  'uniSwitch': 'UniSwitch',
  'waterHeater': 'WaterHeater',
  'wiresAndCables': 'WiresAndCables'
};

function fixElectricalController(filePath, oldCategory, newCategory) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix category in create function
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

// Fix all electrical controllers
console.log('🔧 Fixing electrical controllers...\n');

let fixedCount = 0;
electricalControllers.forEach(controller => {
  const filePath = path.join(electricalControllersDir, controller);
  if (fs.existsSync(filePath)) {
    // Extract category name from filename
    const categoryName = controller.replace('Controller.js', '');
    const oldCategory = categoryMappings[categoryName] || categoryName;
    const newCategory = oldCategory; // Most electrical controllers already have proper capitalization
    
    if (fixElectricalController(filePath, oldCategory, newCategory)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${controller}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} electrical controllers successfully!`);
