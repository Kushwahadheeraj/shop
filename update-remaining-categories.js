const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList');

// Complex API mappings for remaining categories
const COMPLEX_API_MAPPINGS = {
  // Locks - Door Accessories
  'Locks/DoorAccessories/ConcealedHinges': '/locks/door-accessories/concealed-hinges',
  'Locks/DoorAccessories/DoorEye': '/locks/door-accessories/door-eye',
  'Locks/DoorAccessories/DoorStopper': '/locks/door-accessories/door-stopper',
  'Locks/DoorAccessories/Hinges': '/locks/door-accessories/hinges',
  'Locks/DoorAccessories/MagneticDoorStoppers': '/locks/door-accessories/magnetic-door-stoppers',
  'Locks/DoorAccessories/WoodenSlidingDoorFittings': '/locks/door-accessories/wooden-sliding-door-fittings',
  'Locks/DoorAccessories/BallBearingDoorHinges': '/locks/door-accessories/ball-bearing-door-hinges',
  
  // Locks - Door Controls
  'Locks/DoorControls/DoorCloser': '/locks/door-controls/door-closer',
  'Locks/DoorControls/DoorStopper': '/locks/door-controls/door-stopper',
  'Locks/DoorControls/HydraulicDoorClosers': '/locks/door-controls/hydraulic-door-closers',
  
  // Locks - Door Handles
  'Locks/DoorHandles/DoorKings': '/locks/door-handles/door-kings',
  'Locks/DoorHandles/DoorPulls': '/locks/door-handles/door-pulls',
  
  // Locks - Door Locks
  'Locks/DoorLocks/DimpleKey': '/locks/door-locks/dimple-key',
  'Locks/DoorLocks/DiamantPadlocks': '/locks/door-locks/diamant-padlocks',
  'Locks/DoorLocks/DeadLocks': '/locks/door-locks/dead-locks',
  'Locks/DoorLocks/CylindricalLocks': '/locks/door-locks/cylindrical-locks',
  'Locks/DoorLocks/CupboardLocks': '/locks/door-locks/cupboard-locks',
  'Locks/DoorLocks/CentreShutterLocks': '/locks/door-locks/centre-shutter-locks',
  'Locks/DoorLocks/TriBoltLocks': '/locks/door-locks/tri-bolt-locks',
  'Locks/DoorLocks/SmartKey': '/locks/door-locks/smart-key',
  'Locks/DoorLocks/SideLock': '/locks/door-locks/side-lock',
  'Locks/DoorLocks/RimDeadLock': '/locks/door-locks/rim-dead-lock',
  'Locks/DoorLocks/PullHandlesForMainDoors': '/locks/door-locks/pull-handles-for-main-doors',
  'Locks/DoorLocks/NightLatch': '/locks/door-locks/night-latch',
  'Locks/DoorLocks/MainDoorLock': '/locks/door-locks/main-door-lock',
  'Locks/DoorLocks/KnobLocks': '/locks/door-locks/knob-locks',
  'Locks/DoorLocks/JemmyProofDoorLock': '/locks/door-locks/jemmy-proof-door-lock',
  'Locks/DoorLocks/DrawerLock': '/locks/door-locks/drawer-lock',
  'Locks/DoorLocks/DiscPadLocks': '/locks/door-locks/disc-pad-locks',
  
  // Locks - Folding Brackets
  'Locks/FoldingBrackets/ThickDoorHinge': '/locks/folding-brackets/thick-door-hinge',
  'Locks/FoldingBrackets/SoftCloseDrawerChannel': '/locks/folding-brackets/soft-close-drawer-channel',
  'Locks/FoldingBrackets/SlipOnHinge': '/locks/folding-brackets/slip-on-hinge',
  'Locks/FoldingBrackets/HeavyDutyDrawerSlides': '/locks/folding-brackets/heavy-duty-drawer-slides',
  'Locks/FoldingBrackets/FoldingBrackets': '/locks/folding-brackets/folding-brackets',
  'Locks/FoldingBrackets/DrawerChannels': '/locks/folding-brackets/drawer-channels',
  'Locks/FoldingBrackets/ClipOnSoftHinge': '/locks/folding-brackets/clip-on-soft-hinge',
  'Locks/FoldingBrackets/ClipOnSoftHinge4Hole': '/locks/folding-brackets/clip-on-soft-hinge-4-hole',
  'Locks/FoldingBrackets/CabinetHinge': '/locks/folding-brackets/cabinet-hinge',
  'Locks/FoldingBrackets/BlindCornerHinge': '/locks/folding-brackets/blind-corner-hinge',
  
  // Locks - Furniture Fittings
  'Locks/FurnitureFittings/Nuvo': '/locks/furniture-fittings/nuvo',
  'Locks/FurnitureFittings/MultiPurposeLock': '/locks/furniture-fittings/multi-purpose-lock',
  'Locks/FurnitureFittings/FurnitureFittings': '/locks/furniture-fittings/furniture-fittings',
  'Locks/FurnitureFittings/DrawerLocks': '/locks/furniture-fittings/drawer-locks',
  'Locks/FurnitureFittings/DrawerCupboardLock': '/locks/furniture-fittings/drawer-cupboard-lock',
  'Locks/FurnitureFittings/Curvo': '/locks/furniture-fittings/curvo',
  'Locks/FurnitureFittings/Supernova': '/locks/furniture-fittings/supernova',
  'Locks/FurnitureFittings/TableLock': '/locks/furniture-fittings/table-lock',
  
  // Locks - Glass Hardware
  'Locks/GlassHardware/SlidingSystem': '/locks/glass-hardware/sliding-system',
  'Locks/GlassHardware/ShowerCubicleHinge': '/locks/glass-hardware/shower-cubicle-hinge',
  'Locks/GlassHardware/GlassHardware': '/locks/glass-hardware/glass-hardware',
  'Locks/GlassHardware/GlassDoorPullHandle': '/locks/glass-hardware/glass-door-pull-handle',
  'Locks/GlassHardware/GlassDoorLock': '/locks/glass-hardware/glass-door-lock',
  'Locks/GlassHardware/GlassDoorFitting': '/locks/glass-hardware/glass-door-fitting',
  'Locks/GlassHardware/FloorSpring': '/locks/glass-hardware/floor-spring',
  'Locks/GlassHardware/FloorSpringComboSet': '/locks/glass-hardware/floor-spring-combo-set',
  
  // Locks - Lever Mortise Locks
  'Locks/LeverMortiseLocks/LeverMortiseLocks': '/locks/lever-mortise-locks/lever-mortise-locks',
  'Locks/LeverMortiseLocks/ExshiSecurityCylinders': '/locks/lever-mortise-locks/exshi-security-cylinders',
  'Locks/LeverMortiseLocks/EuroprofileMortisePinCylinderWithMasterKey': '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key',
  'Locks/LeverMortiseLocks/EuroprofileMortisePinCylinder': '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder',
  'Locks/LeverMortiseLocks/EuroprofileMortiseLockBodies': '/locks/lever-mortise-locks/europrofile-mortise-lock-bodies',
  'Locks/LeverMortiseLocks/CombipackWith6LeverMortiseLock': '/locks/lever-mortise-locks/combipack-with-6-lever-mortise-lock',
  
  // Locks - Padlocks
  'Locks/Padlocks/UltraShutterLocks': '/locks/padlocks/ultra-shutter-locks',
  'Locks/Padlocks/SquareTypePadlock': '/locks/padlocks/square-type-padlock',
  'Locks/Padlocks/RoundTypePadlock': '/locks/padlocks/round-type-padlock',
  'Locks/Padlocks/PremiumPadlocks': '/locks/padlocks/premium-padlocks',
  'Locks/Padlocks/Padlocks': '/locks/padlocks/padlocks',
  'Locks/Padlocks/DiscPadlocks': '/locks/padlocks/disc-padlocks',
  
  // Locks - Popular Mortise Series
  'Locks/PopularMortiseSeries/Victoria': '/locks/popular-mortise-series/victoria',
  'Locks/PopularMortiseSeries/TowyLowHeightDesign': '/locks/popular-mortise-series/towy-low-height-design',
  'Locks/PopularMortiseSeries/SSDTypeTubeLever': '/locks/popular-mortise-series/ssd-type-tube-lever',
  'Locks/PopularMortiseSeries/PullHandles': '/locks/popular-mortise-series/pull-handles',
  'Locks/PopularMortiseSeries/PopularMortiseSeries': '/locks/popular-mortise-series/popular-mortise-series',
  'Locks/PopularMortiseSeries/Oliver': '/locks/popular-mortise-series/oliver',
  'Locks/PopularMortiseSeries/NEH16': '/locks/popular-mortise-series/neh16',
  'Locks/PopularMortiseSeries/NEH15LowHeightDesign': '/locks/popular-mortise-series/neh15-low-height-design',
  'Locks/PopularMortiseSeries/NEH14': '/locks/popular-mortise-series/neh14',
  'Locks/PopularMortiseSeries/NEH13': '/locks/popular-mortise-series/neh13',
  'Locks/PopularMortiseSeries/NEH12': '/locks/popular-mortise-series/neh12',
  'Locks/PopularMortiseSeries/NEH06': '/locks/popular-mortise-series/neh06',
  'Locks/PopularMortiseSeries/NEH11': '/locks/popular-mortise-series/neh11',
  'Locks/PopularMortiseSeries/NEH10': '/locks/popular-mortise-series/neh10',
  'Locks/PopularMortiseSeries/NEH09': '/locks/popular-mortise-series/neh09',
  'Locks/PopularMortiseSeries/NEH08': '/locks/popular-mortise-series/neh08',
  'Locks/PopularMortiseSeries/NEH07': '/locks/popular-mortise-series/neh07',
  'Locks/PopularMortiseSeries/NEH05': '/locks/popular-mortise-series/neh05',
  'Locks/PopularMortiseSeries/NEH04': '/locks/popular-mortise-series/neh04',
  'Locks/PopularMortiseSeries/Matiz': '/locks/popular-mortise-series/matiz',
  'Locks/PopularMortiseSeries/MainDoorSet': '/locks/popular-mortise-series/main-door-set',
  'Locks/PopularMortiseSeries/Gloria': '/locks/popular-mortise-series/gloria',
  'Locks/PopularMortiseSeries/CylindricalLocks': '/locks/popular-mortise-series/cylindrical-locks',
  'Locks/PopularMortiseSeries/CornerFetchSeries': '/locks/popular-mortise-series/corner-fetch-series',
  'Locks/PopularMortiseSeries/CombiSet': '/locks/popular-mortise-series/combi-set',
  'Locks/PopularMortiseSeries/ClassicLock': '/locks/popular-mortise-series/classic-lock',
  'Locks/PopularMortiseSeries/BM06': '/locks/popular-mortise-series/bm06',
  'Locks/PopularMortiseSeries/BM04': '/locks/popular-mortise-series/bm04',
  'Locks/PopularMortiseSeries/BM02': '/locks/popular-mortise-series/bm02',
  'Locks/PopularMortiseSeries/BM01': '/locks/popular-mortise-series/bm01',
  
  // Locks - Premium Mortise Series
  'Locks/PremiumMortiseSeries/SEHSeries': '/locks/premium-mortise-series/seh-series',
  'Locks/PremiumMortiseSeries/PremiumMortiseSeries': '/locks/premium-mortise-series/premium-mortise-series',
  'Locks/PremiumMortiseSeries/Phoenix': '/locks/premium-mortise-series/phoenix',
  'Locks/PremiumMortiseSeries/Orbit': '/locks/premium-mortise-series/orbit',
  'Locks/PremiumMortiseSeries/Mercury': '/locks/premium-mortise-series/mercury',
  'Locks/PremiumMortiseSeries/EVVA3KSRegalisMortise': '/locks/premium-mortise-series/evva3ks-regalis-mortise',
  'Locks/PremiumMortiseSeries/EuroprofileBrassHandleSet240mm': '/locks/premium-mortise-series/europrofile-brass-handle-set-240mm',
  'Locks/PremiumMortiseSeries/CombipackWith240mmEuroMortiseLock': '/locks/premium-mortise-series/combipack-with-240mm-euro-mortise-lock',
  'Locks/PremiumMortiseSeries/AllureRossetteSeries': '/locks/premium-mortise-series/allure-rossette-series',
  
  // Locks - Rim Locks
  'Locks/RimLocks/UltraXLVertibolt': '/locks/rim-locks/ultra-xl-vertibolt',
  'Locks/RimLocks/UltraXLTwinbolt': '/locks/rim-locks/ultra-xl-twinbolt',
  'Locks/RimLocks/UltraXLTribolt': '/locks/rim-locks/ultra-xl-tribolt',
  'Locks/RimLocks/UltraXLRimDeadbolt': '/locks/rim-locks/ultra-xl-rim-deadbolt',
  'Locks/RimLocks/UltraVertibolt': '/locks/rim-locks/ultra-vertibolt',
  'Locks/RimLocks/UltraTribolt': '/locks/rim-locks/ultra-tribolt',
  'Locks/RimLocks/UltraRetrofitAdaptor': '/locks/rim-locks/ultra-retrofit-adaptor',
  'Locks/RimLocks/UltraLatchboltCarton': '/locks/rim-locks/ultra-latchbolt-carton',
  'Locks/RimLocks/RimLocks': '/locks/rim-locks/rim-locks',
  'Locks/RimLocks/PinCylinderRimLocks': '/locks/rim-locks/pin-cylinder-rim-locks',
  'Locks/RimLocks/PentaboltAries': '/locks/rim-locks/pentabolt-aries',
  'Locks/RimLocks/NightLatch7Lever': '/locks/rim-locks/night-latch-7-lever',
  'Locks/RimLocks/ExsAstro': '/locks/rim-locks/exs-astro',
  'Locks/RimLocks/ExsAltrix': '/locks/rim-locks/exs-altrix',
  
  // Locks - Main categories
  'Locks/PatchFittings': '/locks/patch-fittings',
  'Locks/MortiseLockBody': '/locks/mortise-lock-body',
  'Locks/MorticeLocks': '/locks/mortice-locks',
  
  // Paint categories
  'Paint/AcrylicEmulsionPaint': '/paint/acrylic-emulsion-paint',
  'Paint/AdhesiveThinner/Adhesive': '/paint/adhesive-thinner-adhesive',
  'Paint/AdhesiveThinner/Thinner': '/paint/adhesive-thinner-thinner',
  'Paint/AspaPaints': '/paint/aspa-paints',
  'Paint/AutomativePaints/AspaPaints': '/paint/automative-paints-aspa-paints',
  'Paint/BrushesRollers/PaintBrushes': '/paint/brushes-rollers-paint-brushes',
  'Paint/BrushesRollers/Rollers': '/paint/brushes-rollers-rollers',
  'Paint/BrushesRollers/SprayPaints': '/paint/brushes-rollers-spray-paints',
  'Paint/Distemper/AcrylicDistemper': '/paint/distemper-acrylic-distemper',
  'Paint/Distemper/SyntheticDistemper': '/paint/distemper-synthetic-distemper',
  'Paint/Emulsion/ExteriorEmulsion': '/paint/emulsion-exterior-emulsion',
  'Paint/Emulsion/InteriorEmulsion': '/paint/emulsion-interior-emulsion',
  'Paint/Emulsion/TileGuard': '/paint/emulsion-tile-guard',
  'Paint/Emulsion/WallTexture': '/paint/emulsion-wall-texture',
  'Paint/Enamel/GlossEnamel': '/paint/enamel-gloss-enamel',
  'Paint/Enamel/SatinEnamel': '/paint/enamel-satin-enamel',
  'Paint/Enamel/SyntheticEnamel': '/paint/enamel-synthetic-enamel',
  'Paint/ExteriorPaints': '/paint/exterior-paints',
  'Paint/FloorPaints': '/paint/floor-paints',
  'Paint/IndustrialCoatings': '/paint/industrial-coatings',
  'Paint/InteriorPaints': '/paint/interior-paints',
  'Paint/PaintingAccessories/PaintingTools': '/paint/painting-accessories-painting-tools',
  'Paint/PaintingAccessories/SandpaperRolls': '/paint/painting-accessories-sandpaper-rolls',
  'Paint/PaintingAccessories/Stencils': '/paint/painting-accessories-stencils',
  'Paint/PaintingTools': '/paint/painting-tools',
  'Paint/Primer/AcrylicPrimer': '/paint/primer-acrylic-primer',
  'Paint/Primer/CementPrimer': '/paint/primer-cement-primer',
  'Paint/Primer/ExteriorPrimer': '/paint/primer-exterior-primer',
  'Paint/Primer/InteriorPrimer': '/paint/primer-interior-primer',
  'Paint/Primer/MetalPrimer': '/paint/primer-metal-primer',
  'Paint/Primer/SolventPrimer': '/paint/primer-solvent-primer',
  'Paint/Primer/WoodPrimer': '/paint/primer-wood-primer',
  'Paint/PrimerAndWallPutty': '/paint/primer-and-wall-putty',
  'Paint/Sanitizer': '/paint/sanitizer',
  'Paint/SprayPaints': '/paint/spray-paints',
  'Paint/Stainers/UniversalStainers': '/paint/stainers-universal-stainers',
  'Paint/Stainers/WoodStainers': '/paint/stainers-wood-stainers',
  'Paint/Stainers/Thinners': '/paint/stainers-thinners',
  'Paint/Stencils': '/paint/stencils',
  'Paint/TileGuard': '/paint/tile-guard',
  'Paint/TopBrands/DulexPaints': '/paint/top-brands-dulex-paints',
  'Paint/TopBrands/AsianPaints': '/paint/top-brands-asian-paints',
  'Paint/TopBrands/NerolocPaints': '/paint/top-brands-neroloc-paints',
  'Paint/TopBrands/JKWallPutty': '/paint/top-brands-jk-wall-putty',
  'Paint/WallPutty/AcrylicWallPutty': '/paint/wall-putty-acrylic-wall-putty',
  'Paint/WallPutty/KPFWallPutty': '/paint/wall-putty-kpf-wall-putty',
  'Paint/WallPutty/PowderWallPutty': '/paint/wall-putty-powder-wall-putty',
  'Paint/WallStickersWallpapers': '/paint/wall-stickers-wallpapers',
  'Paint/Waterproofing/CrackFillers': '/paint/waterproofing-crack-fillers',
  'Paint/Waterproofing/WaterproofBasecoat': '/paint/waterproofing-waterproof-basecoat',
  'Paint/WoodFinishes/GlassCoatings': '/paint/wood-finishes-glass-coatings',
  'Paint/WoodFinishes/Melamyne': '/paint/wood-finishes-melamyne',
  'Paint/WoodFinishes/NC': '/paint/wood-finishes-nc',
  'Paint/WoodFinishes/Polish': '/paint/wood-finishes-polish',
  'Paint/WoodFinishes/PU': '/paint/wood-finishes-pu',
  'Paint/WoodFinishes/Sealer': '/paint/wood-finishes-sealer',
  'Paint/WoodFinishes/VarnishBlackBoardPaint': '/paint/wood-finishes-varnish-black-board-paint',
  'Paint/WoodFinishes/WoodPutty': '/paint/wood-finishes-wood-putty',
  'Paint/WoodMetal': '/paint/wood-metal',
  
  // Tools categories
  'Tools/Abrasives/CutOffWheel': '/tools/abrasives/cutOffWheel',
  'Tools/Abrasives/DiamondBlades': '/tools/abrasives/diamondBlades',
  'Tools/AllenKeys': '/tools/allen-keys',
  'Tools/Brush': '/tools/brush',
  'Tools/CarpenterPincer': '/tools/carpenter-pincer',
  'Tools/CentrePunches': '/tools/centre-punches',
  'Tools/Chisels': '/tools/chisels',
  'Tools/Clamps': '/tools/clamps',
  'Tools/Cutters': '/tools/cutters',
  'Tools/Files': '/tools/files',
  'Tools/GardenTools': '/tools/garden-tools',
  'Tools/GearPullers': '/tools/gear-pullers',
  'Tools/GlassCutter': '/tools/glass-cutter',
  'Tools/Gluegun': '/tools/gluegun',
  'Tools/GreaseGun': '/tools/grease-gun',
  'Tools/HacksawBlades': '/tools/hacksaw-blades',
  'Tools/Hammer': '/tools/hammer',
  'Tools/HammerDrlls': '/tools/hammer-drlls',
  'Tools/Handtools': '/tools/handtools',
  'Tools/Level': '/tools/level',
  'Tools/Lubrications': '/tools/lubrications',
  'Tools/MeasurementScale': '/tools/measurement-scale',
  'Tools/MeasuringTape': '/tools/measuring-tape',
  'Tools/Multimeter': '/tools/multimeter',
  'Tools/Plier': '/tools/plier',
  'Tools/PolishingAccessories': '/tools/polishing-accessories',
  'Tools/PowerTools/Drill': '/tools/powertools/drill',
  'Tools/PowerTools/Grinders': '/tools/powertools/grinders',
  'Tools/PowerTools/MarbleCutter': '/tools/powertools/marble-cutter',
  'Tools/Saw': '/tools/saw',
  'Tools/ScrewDriver': '/tools/screw-driver',
  'Tools/SiliconGun': '/tools/silicon-gun',
  'Tools/Socketset': '/tools/socketset',
  'Tools/Spanners': '/tools/spanners',
  'Tools/SpareMalets': '/tools/spare-malets',
  'Tools/ToolCompartments': '/tools/tool-compartments',
  'Tools/Toolkitset': '/tools/toolkitset',
  'Tools/VariousToolBits': '/tools/various-tool-bits',
  'Tools/WoodChisel': '/tools/wood-chisel',
  'Tools/WoodItems': '/tools/wood-items',
  'Tools/Wrench': '/tools/wrench'
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
        updatedCount += walk(fullPath, relativePath);
      } else if (entry.isFile() && entry.name === 'ProductList.jsx') {
        const apiPath = COMPLEX_API_MAPPINGS[relativePath];
        if (apiPath) {
          if (updateFile(fullPath, apiPath)) {
            updatedCount++;
          }
        } else {
          console.log(`⚠️  No API mapping found for: ${relativePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }
  
  return updatedCount;
}

console.log('🚀 Starting complex ProductList API URL updates...\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`); 