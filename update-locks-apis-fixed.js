const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Locks');

// API mappings from apiS.js - exact matches with correct folder names
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

  // DoorAccessories subcategories - correct folder names
  'DoorAccessories/ConcealedHinges': '/locks/door-accessories/concealed-hinges',
  'DoorAccessories/DoorEye': '/locks/door-accessories/door-eye',
  'DoorAccessories/DoorStopper': '/locks/door-accessories/door-stopper',
  'DoorAccessories/Hinges': '/locks/door-accessories/hinges',
  'DoorAccessories/MagneticDoorStoppers': '/locks/door-accessories/magnetic-door-stoppers',
  'DoorAccessories/WoodenSlidingDoorFittings': '/locks/door-accessories/wooden-sliding-door-fittings',
  'DoorAccessories/BallBearingDoorHinges': '/locks/door-accessories/ball-bearing-door-hinges',
  'DoorAccessories/AluminiumTowerBolt': '/locks/door-accessories/aluminium-tower-bolt',

  // DoorControls subcategories - correct folder names
  'DoorControls/DoorClosers': '/locks/door-controls/door-closer',
  'DoorControls/DoorStopper': '/locks/door-controls/door-stopper',
  'DoorControls/HydraulicDoorClosers': '/locks/door-controls/hydraulic-door-closers',

  // DoorHandles subcategories - correct folder names
  'DoorHandles/DoorKing': '/locks/door-handles/door-kings',
  'DoorHandles/DoorPulls': '/locks/door-handles/door-pulls',

  // DoorLocks subcategories - correct folder names
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

  // FoldingBrackets subcategories - correct folder names
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

  // FurnitureFittings subcategories - correct folder names
  'FurnitureFittings/Nuvo': '/locks/furniture-fittings/nuvo',
  'FurnitureFittings/MultiPurposeLock': '/locks/furniture-fittings/multi-purpose-lock',
  'FurnitureFittings/FurnitureFittings': '/locks/furniture-fittings/furniture-fittings',
  'FurnitureFittings/DrawerLocks': '/locks/furniture-fittings/drawer-locks',
  'FurnitureFittings/DrawerCupboardLock': '/locks/furniture-fittings/drawer-cupboard-lock',
  'FurnitureFittings/Curvo': '/locks/furniture-fittings/curvo',
  'FurnitureFittings/Supernova': '/locks/furniture-fittings/supernova',
  'FurnitureFittings/TableLock': '/locks/furniture-fittings/table-lock',
  'FurnitureFittings/BallBearingDrawerChannel': '/locks/furniture-fittings/ball-bearing-drawer-channel',
  'FurnitureFittings/BlindCornerHinge': '/locks/furniture-fittings/blind-corner-hinge',
  'FurnitureFittings/CabinetHinge': '/locks/furniture-fittings/cabinet-hinge',
  'FurnitureFittings/ClipOnSoftHinge': '/locks/furniture-fittings/clip-on-soft-hinge',
  'FurnitureFittings/ClipOnSoftHinge4Hole': '/locks/furniture-fittings/clip-on-soft-hinge-4-hole',
  'FurnitureFittings/DrawerChannels': '/locks/furniture-fittings/drawer-channels',
  'FurnitureFittings/FoldingBrackets': '/locks/furniture-fittings/folding-brackets',
  'FurnitureFittings/HeavyDutyDrawerSlides': '/locks/furniture-fittings/heavy-duty-drawer-slides',
  'FurnitureFittings/SlipOnHinge': '/locks/furniture-fittings/slip-on-hinge',
  'FurnitureFittings/SoftCloseDrawerChannel': '/locks/furniture-fittings/soft-close-drawer-channel',
  'FurnitureFittings/ThickDoorHinge': '/locks/furniture-fittings/thick-door-hinge',

  // FurnitureLocks subcategories - correct folder names
  'FurnitureLocks/CamLock': '/locks/furniture-locks/cam-lock',
  'FurnitureLocks/Curvo': '/locks/furniture-locks/curvo',
  'FurnitureLocks/DrawerCupboardLock': '/locks/furniture-locks/drawer-cupboard-lock',
  'FurnitureLocks/DrawerLocks': '/locks/furniture-locks/drawer-locks',
  'FurnitureLocks/MultiPurposeLock': '/locks/furniture-locks/multi-purpose-lock',
  'FurnitureLocks/Nuvo': '/locks/furniture-locks/nuvo',
  'FurnitureLocks/Supernova': '/locks/furniture-locks/supernova',
  'FurnitureLocks/TableLock': '/locks/furniture-locks/table-lock',

  // GlassHardware subcategories - correct folder names
  'GlassHardware/SlidingSystem': '/locks/glass-hardware/sliding-system',
  'GlassHardware/ShowerCubicleHinge': '/locks/glass-hardware/shower-cubicle-hinge',
  'GlassHardware/GlassHardware': '/locks/glass-hardware/glass-hardware',
  'GlassHardware/GlassDoorPullHandle': '/locks/glass-hardware/glass-door-pull-handle',
  'GlassHardware/GlassDoorLock': '/locks/glass-hardware/glass-door-lock',
  'GlassHardware/GlassDoorFitting': '/locks/glass-hardware/glass-door-fitting',
  'GlassHardware/FloorSpring': '/locks/glass-hardware/floor-spring',
  'GlassHardware/FloorSpringComboSet': '/locks/glass-hardware/floor-spring-combo-set',

  // LeverMortiseLocks subcategories - correct folder names
  'LeverMortiseLocks/LeverMortiseLocks': '/locks/lever-mortise-locks/lever-mortise-locks',
  'LeverMortiseLocks/EXSHISECURITYCYLINDERS': '/locks/lever-mortise-locks/exshi-security-cylinders',
  'LeverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKey': '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key',
  'LeverMortiseLocks/EuroprofileMortisePinCylinder': '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder',
  'LeverMortiseLocks/EuroprofileMortiseLockBodies': '/locks/lever-mortise-locks/europrofile-mortise-lock-bodies',
  'LeverMortiseLocks/COMBIPACKWITH6LEVERMORTISELOCK': '/locks/lever-mortise-locks/combipack-with-6-lever-mortise-lock',

  // Padlocks subcategories - correct folder names
  'Padlocks/UltraShutterLocks': '/locks/padlocks/ultra-shutter-locks',
  'Padlocks/SquareTypePadlock': '/locks/padlocks/square-type-padlock',
  'Padlocks/RoundTypePadlock': '/locks/padlocks/round-type-padlock',
  'Padlocks/PremiumPadlocks': '/locks/padlocks/premium-padlocks',
  'Padlocks/Padlocks': '/locks/padlocks/padlocks',
  'Padlocks/DiscPadlocks': '/locks/padlocks/disc-padlocks',

  // PopularMortiseSeries subcategories - correct folder names
  'PopularMortiseSeries/Victoria': '/locks/popular-mortise-series/victoria',
  'PopularMortiseSeries/TowyLowHeightDesign': '/locks/popular-mortise-series/towy-low-height-design',
  'PopularMortiseSeries/SSDTypeTubeLever': '/locks/popular-mortise-series/ssd-type-tube-lever',
  'PopularMortiseSeries/PullHandles': '/locks/popular-mortise-series/pull-handles',
  'PopularMortiseSeries/PopularMortiseSeries': '/locks/popular-mortise-series/popular-mortise-series',
  'PopularMortiseSeries/Oliver': '/locks/popular-mortise-series/oliver',
  'PopularMortiseSeries/NEH16': '/locks/popular-mortise-series/neh16',
  'PopularMortiseSeries/NEH15': '/locks/popular-mortise-series/neh15-low-height-design',
  'PopularMortiseSeries/NEH14': '/locks/popular-mortise-series/neh14',
  'PopularMortiseSeries/NEH13': '/locks/popular-mortise-series/neh13',
  'PopularMortiseSeries/NEH12': '/locks/popular-mortise-series/neh12',
  'PopularMortiseSeries/NEH11': '/locks/popular-mortise-series/neh11',
  'PopularMortiseSeries/NEH10': '/locks/popular-mortise-series/neh10',
  'PopularMortiseSeries/NEH09': '/locks/popular-mortise-series/neh09',
  'PopularMortiseSeries/NEH08': '/locks/popular-mortise-series/neh08',
  'PopularMortiseSeries/NEH07': '/locks/popular-mortise-series/neh07',
  'PopularMortiseSeries/NEH06': '/locks/popular-mortise-series/neh06',
  'PopularMortiseSeries/NEH05': '/locks/popular-mortise-series/neh05',
  'PopularMortiseSeries/NEH04': '/locks/popular-mortise-series/neh04',
  'PopularMortiseSeries/Matiz': '/locks/popular-mortise-series/matiz',
  'PopularMortiseSeries/MainDoorSet': '/locks/popular-mortise-series/main-door-set',
  'PopularMortiseSeries/Gloria': '/locks/popular-mortise-series/gloria',
  'PopularMortiseSeries/CylindricalLocks': '/locks/popular-mortise-series/cylindrical-locks',
  'PopularMortiseSeries/CornerFetchSeries': '/locks/popular-mortise-series/corner-fetch-series',
  'PopularMortiseSeries/CombiSet': '/locks/popular-mortise-series/combi-set',
  'PopularMortiseSeries/ClassicLock': '/locks/popular-mortise-series/classic-lock',
  'PopularMortiseSeries/BM06': '/locks/popular-mortise-series/bm06',
  'PopularMortiseSeries/BM04': '/locks/popular-mortise-series/bm04',
  'PopularMortiseSeries/BM02': '/locks/popular-mortise-series/bm02',
  'PopularMortiseSeries/BM01': '/locks/popular-mortise-series/bm01',

  // PremiumMortiseSeries subcategories - correct folder names
  'PremiumMortiseSeries/SEHSeries': '/locks/premium-mortise-series/seh-series',
  'PremiumMortiseSeries/PremiumMortiseSeries': '/locks/premium-mortise-series/premium-mortise-series',
  'PremiumMortiseSeries/Phoenix': '/locks/premium-mortise-series/phoenix',
  'PremiumMortiseSeries/Orbit': '/locks/premium-mortise-series/orbit',
  'PremiumMortiseSeries/Mercury': '/locks/premium-mortise-series/mercury',
  'PremiumMortiseSeries/EvvaKSRegalis Mortise': '/locks/premium-mortise-series/evva3ks-regalis-mortise',
  'PremiumMortiseSeries/EuroprofileBrassHandleSet': '/locks/premium-mortise-series/europrofile-brass-handle-set-240mm',
  'PremiumMortiseSeries/CombipackWithEuroMortiseLock': '/locks/premium-mortise-series/combipack-with-240mm-euro-mortise-lock',
  'PremiumMortiseSeries/AllureRossetteSeries': '/locks/premium-mortise-series/allure-rossette-series',

  // RimLocks subcategories - correct folder names
  'RimLocks/UltraXLRimDeadbolt': '/locks/rim-locks/ultra-xl-rim-deadbolt',
  'RimLocks/UltraXLTwinbolt': '/locks/rim-locks/ultra-xl-twinbolt',
  'RimLocks/UltraXLTribolt': '/locks/rim-locks/ultra-xl-tribolt',
  'RimLocks/UltraXLVertibolt': '/locks/rim-locks/ultra-xl-vertibolt',
  'RimLocks/UltraVertibolt': '/locks/rim-locks/ultra-vertibolt',
  'RimLocks/UltraTribolt': '/locks/rim-locks/ultra-tribolt',
  'RimLocks/UltraRetrofitAdaptor': '/locks/rim-locks/ultra-retrofit-adaptor',
  'RimLocks/UltraLatchboltCarton': '/locks/rim-locks/ultra-latchbolt-carton',
  'RimLocks/RimLocks': '/locks/rim-locks/rim-locks',
  'RimLocks/PinCylinderRimLocks': '/locks/rim-locks/pin-cylinder-rim-locks',
  'RimLocks/PentaboltAries': '/locks/rim-locks/pentabolt-aries',
  'RimLocks/NightLatchLever': '/locks/rim-locks/night-latch-7-lever',
  'RimLocks/EXSAstro': '/locks/rim-locks/exs-astro',
  'RimLocks/EXSAltrix': '/locks/rim-locks/exs-altrix'
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

console.log('🚀 Starting Locks ProductList API URL updates (Fixed)...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`);
console.log('\n🔧 All API_URL values now match the exact endpoints from apiS.js');
console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/'); 