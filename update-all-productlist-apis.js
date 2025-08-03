const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList');

// API mappings from api.js - exact matches
const API_MAPPINGS = {
  // Main categories
  'Adhesives': '/adhesives',
  'Brush': '/brush', 
  'Cements': '/cements',
  'Cleaning': '/cleaning',
  'Dry': '/dry',
  'Fiber': '/fiber',
  'Fitting': '/fitting',
  'Hardware': '/hardware',
  'Home': '/home',
  'HomeDecor': '/homedecor',
  'Uncategorized': '/uncategorized',
  
  // Electrical main categories
  'Electrical/Adaptors': '/electrical/adaptors',
  'Electrical/CeilingRoses': '/electrical/ceilingRoses',
  'Electrical/Dimmer': '/electrical/dimmer',
  'Electrical/DistributionBoards': '/electrical/distributionBoards',
  'Electrical/DoorBells': '/electrical/doorBells',
  'Electrical/DPswitch': '/electrical/dPswitch',
  'Electrical/EarthingAccessories': '/electrical/earthingAccessories',
  'Electrical/ELCBsRCCBs': '/electrical/eLCBsRCCBs',
  'Electrical/FlexibleConduit': '/electrical/flexibleConduit',
  'Electrical/FlexibleWires': '/electrical/flexibleWires',
  'Electrical/FuseCarriers': '/electrical/fuseCarriers',
  'Electrical/Holders': '/electrical/holders',
  'Electrical/Indicator': '/electrical/indicator',
  'Electrical/InsulationTapes': '/electrical/insulationTapes',
  'Electrical/Isolators': '/electrical/isolators',
  'Electrical/Jacks': '/electrical/jacks',
  'Electrical/KITKATFuses': '/electrical/kITKATFuses',
  'Electrical/MainSwitch': '/electrical/mainSwitch',
  'Electrical/MCB': '/electrical/mCB',
  'Electrical/ModularSurfaceBox': '/electrical/modularSurfaceBox',
  'Electrical/Motors': '/electrical/motors',
  'Electrical/MotorStarters': '/electrical/motorStarters',
  'Electrical/Others': '/electrical/others',
  'Electrical/PinTop': '/electrical/pinTop',
  'Electrical/Plug': '/electrical/plug',
  'Electrical/PowerStrips': '/electrical/powerStrips',
  'Electrical/PVCClips': '/electrical/pvCClips',
  'Electrical/Regulators': '/electrical/regulators',
  'Electrical/RotarySwitch': '/electrical/rotarySwitch',
  'Electrical/Sockets': '/electrical/sockets',
  'Electrical/SwitchAndSocket': '/electrical/switchAndSocket',
  'Electrical/Switches': '/electrical/switches',
  'Electrical/SwitchPlates': '/electrical/switchPlates',
  'Electrical/TravelAdaptor': '/electrical/travelAdaptor',
  'Electrical/TVOutlets': '/electrical/tVOutlets',
  'Electrical/UniSwitch': '/electrical/uniSwitch',
  'Electrical/WaterHeater': '/electrical/waterHeater',
  'Electrical/WiresAndCables': '/electrical/wiresAndCables',
  
  // Electrical Fittings
  'Electrical/ElectricalFittings/Accessories': '/electrical/accessories',
  'Electrical/ElectricalFittings/CircularDeepBox': '/electrical/circulardeepbox',
  'Electrical/ElectricalFittings/CircularSurfaceBox': '/electrical/circularsurfacebox',
  'Electrical/ElectricalFittings/RigidType': '/electrical/rigidtype',
  
  // Fans
  'Electrical/Fans/CabinetFans': '/electrical/cabinfans',
  'Electrical/Fans/CeilingFans': '/electrical/ceilingfans',
  'Electrical/Fans/PedestalFans': '/electrical/pedestalfans',
  'Electrical/Fans/TableFans': '/electrical/tablefans',
  'Electrical/Fans/VentilationExhaustFans': '/electrical/ventilationexhaustfans',
  'Electrical/Fans/WallMountingFans': '/electrical/wallmountingfans',
  
  // Lights
  'Electrical/Lights/CeilingLight': '/electrical/ceilinglight',
  'Electrical/Lights/CFL': '/electrical/cfl',
  'Electrical/Lights/DeskLight': '/electrical/desklight',
  'Electrical/Lights/FocusLight': '/electrical/focuslight',
  'Electrical/Lights/GardenLight': '/electrical/gardenlight',
  'Electrical/Lights/GateLight': '/electrical/gatelight',
  'Electrical/Lights/GLS': '/electrical/gls',
  'Electrical/Lights/Home': '/electrical/home',
  'Electrical/Lights/Lamps': '/electrical/lamps',
  'Electrical/Lights/LEDBatten': '/electrical/ledbatten',
  'Electrical/Lights/LEDBulbs': '/electrical/ledbulbs',
  'Electrical/Lights/LEDDownlightersSpotlight': '/electrical/leddownlightersspotlight',
  'Electrical/Lights/LEDLuminaires': '/electrical/ledluminaires',
  'Electrical/Lights/LEDPanelLight': '/electrical/ledpanellight',
  'Electrical/Lights/LEDSpotlight': '/electrical/ledspotlight',
  'Electrical/Lights/LEDStreetLight': '/electrical/ledstreetlight',
  'Electrical/Lights/LEDStrips': '/electrical/ledstrips',
  'Electrical/Lights/LEDSurfaceLight': '/electrical/ledsurfacelight',
  'Electrical/Lights/LightElectronics': '/electrical/lightelectronics',
  'Electrical/Lights/MirrorLight': '/electrical/mirrorlight',
  'Electrical/Lights/Reflections': '/electrical/reflections',
  'Electrical/Lights/StandardIncandescent': '/electrical/standardincandescent',
  'Electrical/Lights/TBulb': '/electrical/tbulb',
  'Electrical/Lights/TubeLight': '/electrical/tubelight',
  'Electrical/Lights/UnderwaterLights': '/electrical/underwaterlights',
  'Electrical/Lights/WallLight': '/electrical/walllight',
  
  // Pipe
  'Pipe/FinolexPipes': '/pipe/finolex-pipes',
  'Pipe/AshirvadPipes': '/pipe/ashirvad-pipes',
  'Pipe/AstralPipes': '/pipe/astral-pipes',
  'Pipe/NepulPipes': '/pipe/nepul-pipes',
  'Pipe/BirlaPipe': '/pipe/birla-pipes',
  'Pipe/PrincePipe': '/pipe/prince-pipes',
  'Pipe/PrakashPipe': '/pipe/prakash-pipes',
  'Pipe/SupremePipe': '/pipe/supreme-pipes',
  'Pipe/TataPipe': '/pipe/tata-pipes',
  'Pipe/TSAPipe': '/pipe/tsa-pipes',
  
  // PVC Mats
  'PvcMats/Door': '/pvcmats/door',
  'PvcMats/Floor': '/pvcmats/floor',
  
  // Roofer
  'Roofer/Metal': '/roofer/metal',
  'Roofer/Shingles': '/roofer/shingles',
  
  // WaterProofing
  'WaterProofing/Bathrooms': '/waterproofing/bathroom',
  'WaterProofing/CracksJoints': '/waterproofing/creacks-joints',
  'WaterProofing/Interiors': '/waterproofing/interiors'
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
        const apiPath = API_MAPPINGS[relativePath];
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

console.log('🚀 Starting ProductList API URL updates...\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`); 