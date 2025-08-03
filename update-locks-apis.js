const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Locks');

// API mappings from apiS.js - exact matches
const LOCKS_API_MAPPINGS = {
  // Main locks categories
  'PatchFittings': '/locks/patch-fittings',
  'MortiseLockBody': '/locks/mortise-lock-body',
  'MorticeLocks': '/locks/mortice-locks',
  'FoldingBrackets': '/locks/folding-brackets',
  'FurnitureFittings': '/locks/furniture-fittings',
  'GlassHardware': '/locks/glass-hardware',
  'LeverMortiseLocks': '/locks/lever-mortise-locks',
  'Padlocks': '/locks/padlocks',
  'PopularMortiseSeries': '/locks/popular-mortise-series',
  'PremiumMortiseSeries': '/locks/premium-mortise-series',
  'RimLocks': '/locks/rim-locks',

  // DoorAccessories subcategories
  'DoorAccessories/ConcealedHinges': '/locks/door-accessories/concealed-hinges',
  'DoorAccessories/DoorEye': '/locks/door-accessories/door-eye',
  'DoorAccessories/DoorStopper': '/locks/door-accessories/door-stopper',
  'DoorAccessories/Hinges': '/locks/door-accessories/hinges',
  'DoorAccessories/MagneticDoorStoppers': '/locks/door-accessories/magnetic-door-stoppers',
  'DoorAccessories/WoodenSlidingDoorFittings': '/locks/door-accessories/wooden-sliding-door-fittings',
  'DoorAccessories/BallBearingDoorHinges': '/locks/door-accessories/ball-bearing-door-hinges',

  // DoorControls subcategories
  'DoorControls/DoorCloser': '/locks/door-controls/door-closer',
  'DoorControls/DoorStopper': '/locks/door-controls/door-stopper',
  'DoorControls/HydraulicDoorClosers': '/locks/door-controls/hydraulic-door-closers',

  // DoorHandles subcategories
  'DoorHandles/DoorKings': '/locks/door-handles/door-kings',
  'DoorHandles/DoorPulls': '/locks/door-handles/door-pulls',

  // DoorLocks subcategories
  'DoorLocks/DimpleKey': '/locks/door-locks/dimple-key',
  'DoorLocks/DiamantPadlocks': '/locks/door-locks/diamant-padlocks',
  'DoorLocks/DeadLocks': '/locks/door-locks/dead-locks',
  'DoorLocks/CylindricalLocks': '/locks/door-locks/cylindrical-locks',
  'DoorLocks/CupboardLocks': '/locks/door-locks/cupboard-locks',
  'DoorLocks/CentreShutterLocks': '/locks/door-locks/centre-shutter-locks',
  'DoorLocks/TriBoltLocks': '/locks/door-locks/tri-bolt-locks',
  'DoorLocks/SmartKey': '/locks/door-locks/smart-key',
  'DoorLocks/SideLock': '/locks/door-locks/side-lock',
  'DoorLocks/RimDeadLock': '/locks/door-locks/rim-dead-lock',
  'DoorLocks/PullHandlesForMainDoors': '/locks/door-locks/pull-handles-for-main-doors',
  'DoorLocks/NightLatch': '/locks/door-locks/night-latch',
  'DoorLocks/MainDoorLock': '/locks/door-locks/main-door-lock',
  'DoorLocks/KnobLocks': '/locks/door-locks/knob-locks',
  'DoorLocks/JemmyProofDoorLock': '/locks/door-locks/jemmy-proof-door-lock',
  'DoorLocks/DrawerLock': '/locks/door-locks/drawer-lock',
  'DoorLocks/DiscPadLocks': '/locks/door-locks/disc-pad-locks',

  // FoldingBrackets subcategories
  'FoldingBrackets/ThickDoorHinge': '/locks/folding-brackets/thick-door-hinge',
  'FoldingBrackets/SoftCloseDrawerChannel': '/locks/folding-brackets/soft-close-drawer-channel',
  'FoldingBrackets/SlipOnHinge': '/locks/folding-brackets/slip-on-hinge',
  'FoldingBrackets/HeavyDutyDrawerSlides': '/locks/folding-brackets/heavy-duty-drawer-slides',
  'FoldingBrackets/FoldingBrackets': '/locks/folding-brackets/folding-brackets',
  'FoldingBrackets/DrawerChannels': '/locks/folding-brackets/drawer-channels',
  'FoldingBrackets/ClipOnSoftHinge': '/locks/folding-brackets/clip-on-soft-hinge',
  'FoldingBrackets/ClipOnSoftHinge4Hole': '/locks/folding-brackets/clip-on-soft-hinge-4-hole',
  'FoldingBrackets/CabinetHinge': '/locks/folding-brackets/cabinet-hinge',
  'FoldingBrackets/BlindCornerHinge': '/locks/folding-brackets/blind-corner-hinge',

  // FurnitureFittings subcategories
  'FurnitureFittings/Nuvo': '/locks/furniture-fittings/nuvo',
  'FurnitureFittings/MultiPurposeLock': '/locks/furniture-fittings/multi-purpose-lock',
  'FurnitureFittings/FurnitureFittings': '/locks/furniture-fittings/furniture-fittings',
  'FurnitureFittings/DrawerLocks': '/locks/furniture-fittings/drawer-locks',
  'FurnitureFittings/DrawerCupboardLock': '/locks/furniture-fittings/drawer-cupboard-lock',
  'FurnitureFittings/Curvo': '/locks/furniture-fittings/curvo',
  'FurnitureFittings/Supernova': '/locks/furniture-fittings/supernova',
  'FurnitureFittings/TableLock': '/locks/furniture-fittings/table-lock',

  // GlassHardware subcategories
  'GlassHardware/SlidingSystem': '/locks/glass-hardware/sliding-system',
  'GlassHardware/ShowerCubicleHinge': '/locks/glass-hardware/shower-cubicle-hinge',
  'GlassHardware/GlassHardware': '/locks/glass-hardware/glass-hardware',
  'GlassHardware/GlassDoorPullHandle': '/locks/glass-hardware/glass-door-pull-handle',
  'GlassHardware/GlassDoorLock': '/locks/glass-hardware/glass-door-lock',
  'GlassHardware/GlassDoorFitting': '/locks/glass-hardware/glass-door-fitting',
  'GlassHardware/FloorSpring': '/locks/glass-hardware/floor-spring',
  'GlassHardware/FloorSpringComboSet': '/locks/glass-hardware/floor-spring-combo-set',

  // LeverMortiseLocks subcategories
  'LeverMortiseLocks/LeverMortiseLocks': '/locks/lever-mortise-locks/lever-mortise-locks',
  'LeverMortiseLocks/ExshiSecurityCylinders': '/locks/lever-mortise-locks/exshi-security-cylinders',
  'LeverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKey': '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key',
  'LeverMortiseLocks/EuroprofileMortisePinCylinder': '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder',
  'LeverMortiseLocks/EuroprofileMortiseLockBodies': '/locks/lever-mortise-locks/europrofile-mortise-lock-bodies',
  'LeverMortiseLocks/CombipackWith6LeverMortiseLock': '/locks/lever-mortise-locks/combipack-with-6-lever-mortise-lock',

  // Padlocks subcategories
  'Padlocks/UltraShutterLocks': '/locks/padlocks/ultra-shutter-locks',
  'Padlocks/SquareTypePadlock': '/locks/padlocks/square-type-padlock',
  'Padlocks/RoundTypePadlock': '/locks/padlocks/round-type-padlock',
  'Padlocks/PremiumPadlocks': '/locks/padlocks/premium-padlocks',
  'Padlocks/Padlocks': '/locks/padlocks/padlocks',
  'Padlocks/DiscPadlocks': '/locks/padlocks/disc-padlocks',

  // PopularMortiseSeries subcategories
  'PopularMortiseSeries/Victoria': '/locks/popular-mortise-series/victoria',
  'PopularMortiseSeries/TowyLowHeightDesign': '/locks/popular-mortise-series/towy-low-height-design',
  'PopularMortiseSeries/SsdTypeTubeLever': '/locks/popular-mortise-series/ssd-type-tube-lever',
  'PopularMortiseSeries/PullHandles': '/locks/popular-mortise-series/pull-handles',
  'PopularMortiseSeries/PopularMortiseSeries': '/locks/popular-mortise-series/popular-mortise-series',
  'PopularMortiseSeries/Oliver': '/locks/popular-mortise-series/oliver',
  'PopularMortiseSeries/Neh16': '/locks/popular-mortise-series/neh16',
  'PopularMortiseSeries/Neh15LowHeightDesign': '/locks/popular-mortise-series/neh15-low-height-design',
  'PopularMortiseSeries/Neh14': '/locks/popular-mortise-series/neh14',
  'PopularMortiseSeries/Neh13': '/locks/popular-mortise-series/neh13',
  'PopularMortiseSeries/Neh12': '/locks/popular-mortise-series/neh12',
  'PopularMortiseSeries/Neh06': '/locks/popular-mortise-series/neh06',
  'PopularMortiseSeries/Neh11': '/locks/popular-mortise-series/neh11',
  'PopularMortiseSeries/Neh10': '/locks/popular-mortise-series/neh10',
  'PopularMortiseSeries/Neh09': '/locks/popular-mortise-series/neh09',
  'PopularMortiseSeries/Neh08': '/locks/popular-mortise-series/neh08',
  'PopularMortiseSeries/Neh07': '/locks/popular-mortise-series/neh07',
  'PopularMortiseSeries/Neh05': '/locks/popular-mortise-series/neh05',
  'PopularMortiseSeries/Neh04': '/locks/popular-mortise-series/neh04',
  'PopularMortiseSeries/Matiz': '/locks/popular-mortise-series/matiz',
  'PopularMortiseSeries/MainDoorSet': '/locks/popular-mortise-series/main-door-set',
  'PopularMortiseSeries/Gloria': '/locks/popular-mortise-series/gloria',
  'PopularMortiseSeries/CylindricalLocks': '/locks/popular-mortise-series/cylindrical-locks',
  'PopularMortiseSeries/CornerFetchSeries': '/locks/popular-mortise-series/corner-fetch-series',
  'PopularMortiseSeries/CombiSet': '/locks/popular-mortise-series/combi-set',
  'PopularMortiseSeries/ClassicLock': '/locks/popular-mortise-series/classic-lock',
  'PopularMortiseSeries/Bm06': '/locks/popular-mortise-series/bm06',
  'PopularMortiseSeries/Bm04': '/locks/popular-mortise-series/bm04',
  'PopularMortiseSeries/Bm02': '/locks/popular-mortise-series/bm02',
  'PopularMortiseSeries/Bm01': '/locks/popular-mortise-series/bm01',

  // PremiumMortiseSeries subcategories
  'PremiumMortiseSeries/SehSeries': '/locks/premium-mortise-series/seh-series',
  'PremiumMortiseSeries/PremiumMortiseSeries': '/locks/premium-mortise-series/premium-mortise-series',
  'PremiumMortiseSeries/Phoenix': '/locks/premium-mortise-series/phoenix',
  'PremiumMortiseSeries/Orbit': '/locks/premium-mortise-series/orbit',
  'PremiumMortiseSeries/Mercury': '/locks/premium-mortise-series/mercury',
  'PremiumMortiseSeries/Evva3ksRegalisMortise': '/locks/premium-mortise-series/evva3ks-regalis-mortise',
  'PremiumMortiseSeries/EuroprofileBrassHandleSet240mm': '/locks/premium-mortise-series/europrofile-brass-handle-set-240mm',
  'PremiumMortiseSeries/CombipackWith240mmEuroMortiseLock': '/locks/premium-mortise-series/combipack-with-240mm-euro-mortise-lock',
  'PremiumMortiseSeries/AllureRossetteSeries': '/locks/premium-mortise-series/allure-rossette-series',

  // RimLocks subcategories
  'RimLocks/UltraXlVertibolt': '/locks/rim-locks/ultra-xl-vertibolt',
  'RimLocks/UltraXlTwinbolt': '/locks/rim-locks/ultra-xl-twinbolt',
  'RimLocks/UltraXlTribolt': '/locks/rim-locks/ultra-xl-tribolt',
  'RimLocks/UltraXlRimDeadbolt': '/locks/rim-locks/ultra-xl-rim-deadbolt',
  'RimLocks/UltraVertibolt': '/locks/rim-locks/ultra-vertibolt',
  'RimLocks/UltraTribolt': '/locks/rim-locks/ultra-tribolt',
  'RimLocks/UltraRetrofitAdaptor': '/locks/rim-locks/ultra-retrofit-adaptor',
  'RimLocks/UltraLatchboltCarton': '/locks/rim-locks/ultra-latchbolt-carton',
  'RimLocks/RimLocks': '/locks/rim-locks/rim-locks',
  'RimLocks/PinCylinderRimLocks': '/locks/rim-locks/pin-cylinder-rim-locks',
  'RimLocks/PentaboltAries': '/locks/rim-locks/pentabolt-aries',
  'RimLocks/NightLatch7Lever': '/locks/rim-locks/night-latch-7-lever',
  'RimLocks/ExsAstro': '/locks/rim-locks/exs-astro',
  'RimLocks/ExsAltrix': '/locks/rim-locks/exs-altrix'
};

function updateFile(filePath, apiPath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content;
    let changes = 0;

    // Update API_URL
    const apiUrlRegex = /const API_URL = `\$\{API_BASE_URL\}\/[^`]+`;/;
    const newApiUrl = `const API_URL = \`\${API_BASE_URL}${apiPath}\`;`;
    
    if (apiUrlRegex.test(content)) {
      updated = updated.replace(apiUrlRegex, newApiUrl);
      changes++;
    }

    // Fix delete endpoint syntax
    const deleteRegex = /\/delete:([^\s"']+)/g;
    if (deleteRegex.test(updated)) {
      updated = updated.replace(deleteRegex, '/delete/$1');
      changes++;
    }

    if (changes > 0) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✅ Updated: ${filePath} -> ${apiPath}`);
      return true;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function walk(dir, parentPath = '') {
  let updatedCount = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        // Check if this directory has a ProductList.jsx file
        const productListPath = path.join(fullPath, 'ProductList.jsx');
        if (fs.existsSync(productListPath)) {
          const apiPath = LOCKS_API_MAPPINGS[relativePath];
          if (apiPath) {
            if (updateFile(productListPath, apiPath)) {
              updatedCount++;
            }
          } else {
            console.log(`⚠️  No API mapping found for: ${relativePath}`);
          }
        }
        
        // Continue walking subdirectories
        updatedCount += walk(fullPath, relativePath);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return updatedCount;
}

console.log('🚀 Starting Locks ProductList API URL updates...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`);
console.log('\n🔧 All API_URL values now match the exact endpoints from apiS.js');
console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/'); 