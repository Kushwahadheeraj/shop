const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList');

// Function to convert folder path to API path
function folderToApiPath(folderPath) {
  const parts = folderPath.split('/');
  
  // Handle main categories
  if (parts.length === 1) {
    const category = parts[0].toLowerCase();
    if (category === 'homedecor') return '/homedecor';
    if (category === 'pvcmats') return '/pvcmats';
    if (category === 'waterproofing') return '/waterproofing';
    return `/${category}`;
  }
  
  // Handle subcategories
  if (parts.length === 2) {
    const [main, sub] = parts;
    const mainLower = main.toLowerCase();
    const subLower = sub.toLowerCase();
    
    // Electrical subcategories
    if (mainLower === 'electrical') {
      // Handle special cases
      if (subLower === 'dpswitch') return '/electrical/dPswitch';
      if (subLower === 'elcbsrccbs') return '/electrical/eLCBsRCCBs';
      if (subLower === 'kitkatfuses') return '/electrical/kITKATFuses';
      if (subLower === 'mcb') return '/electrical/mCB';
      if (subLower === 'pvclips') return '/electrical/pvCClips';
      if (subLower === 'tvoutlets') return '/electrical/tVOutlets';
      if (subLower === 'uniswitch') return '/electrical/uniSwitch';
      
      // Handle camelCase conversions
      const camelCase = sub.replace(/([A-Z])/g, (match, letter, index) => {
        return index === 0 ? letter.toLowerCase() : letter;
      });
      return `/electrical/${camelCase}`;
    }
    
    // Pipe subcategories
    if (mainLower === 'pipe') {
      if (subLower === 'finolexpipes') return '/pipe/finolex-pipes';
      if (subLower === 'ashirvadpipes') return '/pipe/ashirvad-pipes';
      if (subLower === 'astralpipes') return '/pipe/astral-pipes';
      if (subLower === 'nepulpipes') return '/pipe/nepul-pipes';
      if (subLower === 'birlapipe') return '/pipe/birla-pipes';
      if (subLower === 'princepipe') return '/pipe/prince-pipes';
      if (subLower === 'prakashpipe') return '/pipe/prakash-pipes';
      if (subLower === 'supremepipe') return '/pipe/supreme-pipes';
      if (subLower === 'tatapipe') return '/pipe/tata-pipes';
      if (subLower === 'tsapipe') return '/pipe/tsa-pipes';
    }
    
    // PVC Mats subcategories
    if (mainLower === 'pvcmats') {
      return `/pvcmats/${subLower}`;
    }
    
    // Roofer subcategories
    if (mainLower === 'roofer') {
      return `/roofer/${subLower}`;
    }
    
    // WaterProofing subcategories
    if (mainLower === 'waterproofing') {
      if (subLower === 'cracksjoints') return '/waterproofing/creacks-joints';
      return `/waterproofing/${subLower}`;
    }
  }
  
  // Handle deeper nested categories (3+ levels)
  if (parts.length >= 3) {
    const [main, sub, subsub] = parts;
    const mainLower = main.toLowerCase();
    
    // Electrical Fittings
    if (mainLower === 'electrical' && sub.toLowerCase() === 'electricalfittings') {
      const subsubLower = subsub.toLowerCase();
      if (subsubLower === 'circulardeepbox') return '/electrical/circulardeepbox';
      if (subsubLower === 'circularsurfacebox') return '/electrical/circularsurfacebox';
      if (subsubLower === 'rigidtype') return '/electrical/rigidtype';
      if (subsubLower === 'accessories') return '/electrical/accessories';
    }
    
    // Electrical Fans
    if (mainLower === 'electrical' && sub.toLowerCase() === 'fans') {
      const subsubLower = subsub.toLowerCase();
      return `/electrical/${subsubLower}`;
    }
    
    // Electrical Lights
    if (mainLower === 'electrical' && sub.toLowerCase() === 'lights') {
      const subsubLower = subsub.toLowerCase();
      return `/electrical/${subsubLower}`;
    }
    
    // Locks categories
    if (mainLower === 'locks') {
      const subLower = sub.toLowerCase();
      const subsubLower = subsub.toLowerCase();
      
      // Door Accessories
      if (subLower === 'dooraccessories') {
        if (subsubLower === 'concealedhinges') return '/locks/door-accessories/concealed-hinges';
        if (subsubLower === 'dooreye') return '/locks/door-accessories/door-eye';
        if (subsubLower === 'doorstopper') return '/locks/door-accessories/door-stopper';
        if (subsubLower === 'hinges') return '/locks/door-accessories/hinges';
        if (subsubLower === 'magneticdoorstoppers') return '/locks/door-accessories/magnetic-door-stoppers';
        if (subsubLower === 'woodenslidingdoorfittings') return '/locks/door-accessories/wooden-sliding-door-fittings';
        if (subsubLower === 'ballbearingdoorhinges') return '/locks/door-accessories/ball-bearing-door-hinges';
      }
      
      // Door Controls
      if (subLower === 'doorcontrols') {
        if (subsubLower === 'doorcloser') return '/locks/door-controls/door-closer';
        if (subsubLower === 'doorstopper') return '/locks/door-controls/door-stopper';
        if (subsubLower === 'hydraulicdoorclosers') return '/locks/door-controls/hydraulic-door-closers';
      }
      
      // Door Handles
      if (subLower === 'doorhandles') {
        if (subsubLower === 'doorkings') return '/locks/door-handles/door-kings';
        if (subsubLower === 'doorpulls') return '/locks/door-handles/door-pulls';
      }
      
      // Door Locks
      if (subLower === 'doorlocks') {
        if (subsubLower === 'dimplekey') return '/locks/door-locks/dimple-key';
        if (subsubLower === 'diamantpadlocks') return '/locks/door-locks/diamant-padlocks';
        if (subsubLower === 'deadlocks') return '/locks/door-locks/dead-locks';
        if (subsubLower === 'cylindricallocks') return '/locks/door-locks/cylindrical-locks';
        if (subsubLower === 'cupboardlocks') return '/locks/door-locks/cupboard-locks';
        if (subsubLower === 'centreshutterlocks') return '/locks/door-locks/centre-shutter-locks';
        if (subsubLower === 'triboltlocks') return '/locks/door-locks/tri-bolt-locks';
        if (subsubLower === 'smartkey') return '/locks/door-locks/smart-key';
        if (subsubLower === 'sidelock') return '/locks/door-locks/side-lock';
        if (subsubLower === 'rimdeadlock') return '/locks/door-locks/rim-dead-lock';
        if (subsubLower === 'pullhandlesformaindoors') return '/locks/door-locks/pull-handles-for-main-doors';
        if (subsubLower === 'nightlatch') return '/locks/door-locks/night-latch';
        if (subsubLower === 'maindoorlock') return '/locks/door-locks/main-door-lock';
        if (subsubLower === 'knoblocks') return '/locks/door-locks/knob-locks';
        if (subsubLower === 'jemmyproofdoorlock') return '/locks/door-locks/jemmy-proof-door-lock';
        if (subsubLower === 'drawerlock') return '/locks/door-locks/drawer-lock';
        if (subsubLower === 'discpadlocks') return '/locks/door-locks/disc-pad-locks';
      }
      
      // Folding Brackets
      if (subLower === 'foldingbrackets') {
        if (subsubLower === 'thickdoorhinge') return '/locks/folding-brackets/thick-door-hinge';
        if (subsubLower === 'softclosedrawerchannel') return '/locks/folding-brackets/soft-close-drawer-channel';
        if (subsubLower === 'sliponhinge') return '/locks/folding-brackets/slip-on-hinge';
        if (subsubLower === 'heavydutydrawerslides') return '/locks/folding-brackets/heavy-duty-drawer-slides';
        if (subsubLower === 'foldingbrackets') return '/locks/folding-brackets/folding-brackets';
        if (subsubLower === 'drawerchannels') return '/locks/folding-brackets/drawer-channels';
        if (subsubLower === 'cliponsofthinge') return '/locks/folding-brackets/clip-on-soft-hinge';
        if (subsubLower === 'cliponsofthinge4hole') return '/locks/folding-brackets/clip-on-soft-hinge-4-hole';
        if (subsubLower === 'cabinethinge') return '/locks/folding-brackets/cabinet-hinge';
        if (subsubLower === 'blindcornerhinge') return '/locks/folding-brackets/blind-corner-hinge';
      }
      
      // Furniture Fittings
      if (subLower === 'furniturefittings') {
        if (subsubLower === 'nuvo') return '/locks/furniture-fittings/nuvo';
        if (subsubLower === 'multipurposelock') return '/locks/furniture-fittings/multi-purpose-lock';
        if (subsubLower === 'furniturefittings') return '/locks/furniture-fittings/furniture-fittings';
        if (subsubLower === 'drawerlocks') return '/locks/furniture-fittings/drawer-locks';
        if (subsubLower === 'drawercupboardlock') return '/locks/furniture-fittings/drawer-cupboard-lock';
        if (subsubLower === 'curvo') return '/locks/furniture-fittings/curvo';
        if (subsubLower === 'supernova') return '/locks/furniture-fittings/supernova';
        if (subsubLower === 'tablelock') return '/locks/furniture-fittings/table-lock';
      }
      
      // Glass Hardware
      if (subLower === 'glasshardware') {
        if (subsubLower === 'slidingsystem') return '/locks/glass-hardware/sliding-system';
        if (subsubLower === 'showercubiclehinge') return '/locks/glass-hardware/shower-cubicle-hinge';
        if (subsubLower === 'glasshardware') return '/locks/glass-hardware/glass-hardware';
        if (subsubLower === 'glassdoorpullhandle') return '/locks/glass-hardware/glass-door-pull-handle';
        if (subsubLower === 'glassdoorlock') return '/locks/glass-hardware/glass-door-lock';
        if (subsubLower === 'glassdoorfitting') return '/locks/glass-hardware/glass-door-fitting';
        if (subsubLower === 'floorspring') return '/locks/glass-hardware/floor-spring';
        if (subsubLower === 'floorspringcomboset') return '/locks/glass-hardware/floor-spring-combo-set';
      }
      
      // Lever Mortise Locks
      if (subLower === 'levermortiselocks') {
        if (subsubLower === 'levermortiselocks') return '/locks/lever-mortise-locks/lever-mortise-locks';
        if (subsubLower === 'exshisecuritycylinders') return '/locks/lever-mortise-locks/exshi-security-cylinders';
        if (subsubLower === 'europrofilemortisepincylinderwithmasterkey') return '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder-with-master-key';
        if (subsubLower === 'europrofilemortisepincylinder') return '/locks/lever-mortise-locks/europrofile-mortise-pin-cylinder';
        if (subsubLower === 'europrofilemortiselockbodies') return '/locks/lever-mortise-locks/europrofile-mortise-lock-bodies';
        if (subsubLower === 'combipackwith6levermortiselock') return '/locks/lever-mortise-locks/combipack-with-6-lever-mortise-lock';
      }
      
      // Padlocks
      if (subLower === 'padlocks') {
        if (subsubLower === 'ultrashutterlocks') return '/locks/padlocks/ultra-shutter-locks';
        if (subsubLower === 'squaretypepadlock') return '/locks/padlocks/square-type-padlock';
        if (subsubLower === 'roundtypepadlock') return '/locks/padlocks/round-type-padlock';
        if (subsubLower === 'premiumpadlocks') return '/locks/padlocks/premium-padlocks';
        if (subsubLower === 'padlocks') return '/locks/padlocks/padlocks';
        if (subsubLower === 'discpadlocks') return '/locks/padlocks/disc-padlocks';
      }
      
      // Popular Mortise Series
      if (subLower === 'popularmortiseseries') {
        if (subsubLower === 'victoria') return '/locks/popular-mortise-series/victoria';
        if (subsubLower === 'towylowheightdesign') return '/locks/popular-mortise-series/towy-low-height-design';
        if (subsubLower === 'ssdtypetubelever') return '/locks/popular-mortise-series/ssd-type-tube-lever';
        if (subsubLower === 'pullhandles') return '/locks/popular-mortise-series/pull-handles';
        if (subsubLower === 'popularmortiseseries') return '/locks/popular-mortise-series/popular-mortise-series';
        if (subsubLower === 'oliver') return '/locks/popular-mortise-series/oliver';
        if (subsubLower === 'neh16') return '/locks/popular-mortise-series/neh16';
        if (subsubLower === 'neh15lowheightdesign') return '/locks/popular-mortise-series/neh15-low-height-design';
        if (subsubLower === 'neh14') return '/locks/popular-mortise-series/neh14';
        if (subsubLower === 'neh13') return '/locks/popular-mortise-series/neh13';
        if (subsubLower === 'neh12') return '/locks/popular-mortise-series/neh12';
        if (subsubLower === 'neh06') return '/locks/popular-mortise-series/neh06';
        if (subsubLower === 'neh11') return '/locks/popular-mortise-series/neh11';
        if (subsubLower === 'neh10') return '/locks/popular-mortise-series/neh10';
        if (subsubLower === 'neh09') return '/locks/popular-mortise-series/neh09';
        if (subsubLower === 'neh08') return '/locks/popular-mortise-series/neh08';
        if (subsubLower === 'neh07') return '/locks/popular-mortise-series/neh07';
        if (subsubLower === 'neh05') return '/locks/popular-mortise-series/neh05';
        if (subsubLower === 'neh04') return '/locks/popular-mortise-series/neh04';
        if (subsubLower === 'matiz') return '/locks/popular-mortise-series/matiz';
        if (subsubLower === 'maindoorset') return '/locks/popular-mortise-series/main-door-set';
        if (subsubLower === 'gloria') return '/locks/popular-mortise-series/gloria';
        if (subsubLower === 'cylindricallocks') return '/locks/popular-mortise-series/cylindrical-locks';
        if (subsubLower === 'cornerfetchseries') return '/locks/popular-mortise-series/corner-fetch-series';
        if (subsubLower === 'combiset') return '/locks/popular-mortise-series/combi-set';
        if (subsubLower === 'classiclock') return '/locks/popular-mortise-series/classic-lock';
        if (subsubLower === 'bm06') return '/locks/popular-mortise-series/bm06';
        if (subsubLower === 'bm04') return '/locks/popular-mortise-series/bm04';
        if (subsubLower === 'bm02') return '/locks/popular-mortise-series/bm02';
        if (subsubLower === 'bm01') return '/locks/popular-mortise-series/bm01';
      }
      
      // Premium Mortise Series
      if (subLower === 'premiummortiseseries') {
        if (subsubLower === 'sehseries') return '/locks/premium-mortise-series/seh-series';
        if (subsubLower === 'premiummortiseseries') return '/locks/premium-mortise-series/premium-mortise-series';
        if (subsubLower === 'phoenix') return '/locks/premium-mortise-series/phoenix';
        if (subsubLower === 'orbit') return '/locks/premium-mortise-series/orbit';
        if (subsubLower === 'mercury') return '/locks/premium-mortise-series/mercury';
        if (subsubLower === 'evva3ksregalismortise') return '/locks/premium-mortise-series/evva3ks-regalis-mortise';
        if (subsubLower === 'europrofilebrasshandleset240mm') return '/locks/premium-mortise-series/europrofile-brass-handle-set-240mm';
        if (subsubLower === 'combipackwith240mmeuromortiselock') return '/locks/premium-mortise-series/combipack-with-240mm-euro-mortise-lock';
        if (subsubLower === 'allurerossetteseries') return '/locks/premium-mortise-series/allure-rossette-series';
      }
      
      // Rim Locks
      if (subLower === 'rimlocks') {
        if (subsubLower === 'ultraxlvertibolt') return '/locks/rim-locks/ultra-xl-vertibolt';
        if (subsubLower === 'ultraxltwinbolt') return '/locks/rim-locks/ultra-xl-twinbolt';
        if (subsubLower === 'ultraxltribolt') return '/locks/rim-locks/ultra-xl-tribolt';
        if (subsubLower === 'ultraxlrimdeadbolt') return '/locks/rim-locks/ultra-xl-rim-deadbolt';
        if (subsubLower === 'ultravertibolt') return '/locks/rim-locks/ultra-vertibolt';
        if (subsubLower === 'ultratribolt') return '/locks/rim-locks/ultra-tribolt';
        if (subsubLower === 'ultraretrofitadaptor') return '/locks/rim-locks/ultra-retrofit-adaptor';
        if (subsubLower === 'ultralatchboltcarton') return '/locks/rim-locks/ultra-latchbolt-carton';
        if (subsubLower === 'rimlocks') return '/locks/rim-locks/rim-locks';
        if (subsubLower === 'pincylinderrimlocks') return '/locks/rim-locks/pin-cylinder-rim-locks';
        if (subsubLower === 'pentaboltaries') return '/locks/rim-locks/pentabolt-aries';
        if (subsubLower === 'nightlatch7lever') return '/locks/rim-locks/night-latch-7-lever';
        if (subsubLower === 'exsastro') return '/locks/rim-locks/exs-astro';
        if (subsubLower === 'exsaltrix') return '/locks/rim-locks/exs-altrix';
      }
    }
  }
  
  // If no mapping found, return null
  return null;
}

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
        const apiPath = folderToApiPath(relativePath);
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

console.log('🚀 Starting comprehensive ProductList API URL updates...\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`); 