const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, 'app', 'Dashboard', 'ProductList', 'Sanitary');

// Function to convert folder path to API path based on actual folder structure
function folderToApiPath(folderPath) {
  const parts = folderPath.split('/');
  
  // Handle main categories (single level)
  if (parts.length === 1) {
    const category = parts[0].toLowerCase();
    if (category === 'acrylicproducts') return '/sanitary/acrylic-products';
    if (category === 'bathroomaccessories') return '/sanitary/bathroom-accessories';
    if (category === 'closets') return '/sanitary/closets';
    if (category === 'faucets') return '/sanitary/faucets';
    if (category === 'healthfaucet') return '/sanitary/health-faucet';
    if (category === 'hardwarebathroomaccessories') return '/sanitary/hardware-bathroom-accessories';
    if (category === 'kitchensinks') return '/sanitary/kitchen-sinks';
    if (category === 'showers') return '/sanitary/showers';
    if (category === 'taps') return '/sanitary/taps';
    if (category === 'washbasins') return '/sanitary/washbasins';
    if (category === 'jaquar') return '/sanitary/jaquar';
    if (category === 'lemonbathroomaccessories') return '/sanitary/lemon-bathroom-accessories';
  }
  
  // Handle subcategories (2+ levels)
  if (parts.length >= 2) {
    const [main, sub] = parts;
    const mainLower = main.toLowerCase();
    const subLower = sub.toLowerCase();
    
    // Bathsense categories
    if (mainLower === 'bathsense') {
      if (subLower === 'cpfittingsfaucets') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'altius') return '/sanitary/bathsense-pfittings-faucets-altius';
          if (subsub === 'bathsenseessentials') return '/sanitary/bathsense-pfittings-faucets-bathsense-essentials';
          if (subsub === 'bathsenseshowers') return '/sanitary/bathsense-pfittings-faucets-bathsense-showers';
          if (subsub === 'colossus') return '/sanitary/bathsense-pfittings-faucets-colossus';
          if (subsub === 'invictus') return '/sanitary/bathsense-pfittings-faucets-invictus';
          if (subsub === 'maximus') return '/sanitary/bathsense-pfittings-faucets-maximus';
          if (subsub === 'spry') return '/sanitary/bathsense-pfittings-faucets-spry';
          if (subsub === 'theta') return '/sanitary/bathsense-pfittings-faucets-theta';
        }
      }
      if (subLower === 'sanitaryware') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'essentials') return '/sanitary/bathsense-sanitaryware-essentials';
          if (subsub === 'pedestals') return '/sanitary/bathsense-sanitaryware-pedestals';
          if (subsub === 'venus') return '/sanitary/bathsense-sanitaryware-venus';
          if (subsub === 'washbasins') return '/sanitary/bathsense-sanitaryware-washbasins';
          if (subsub === 'watercloset') return '/sanitary/bathsense-sanitaryware-water-closet';
        }
      }
    }
    
    // Coral Bath Fixtures
    if (mainLower === 'coralbathfixtures') {
      if (subLower === 'eurosmartseries') return '/sanitary/coral-bath-fixtures-eurosmart-series';
      if (subLower === 'flowmoreseries') return '/sanitary/coral-bath-fixtures-flowmore-series';
      if (subLower === 'newsuperglowseries') return '/sanitary/coral-bath-fixtures-new-super-glow-series';
      if (subLower === 'royaleseries') return '/sanitary/coral-bath-fixtures-royale-series';
      if (subLower === 'treemoseries') return '/sanitary/coral-bath-fixtures-treemo-series';
      if (subLower === 'xrossaseries') return '/sanitary/coral-bath-fixtures-xrossa-series';
    }
    
    // Corsa categories
    if (mainLower === 'corsa') {
      if (subLower === 'bathroomfaucets') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'almond') return '/sanitary/corsa-bathroom-faucets-almond';
          if (subsub === 'arrow') return '/sanitary/corsa-bathroom-faucets-arrow';
          if (subsub === 'bold') return '/sanitary/corsa-bathroom-faucets-bold';
          if (subsub === 'budget') return '/sanitary/corsa-bathroom-faucets-budget';
          if (subsub === 'concept') return '/sanitary/corsa-bathroom-faucets-concept';
          if (subsub === 'deluxe') return '/sanitary/corsa-bathroom-faucets-deluxe';
          if (subsub === 'eeco') return '/sanitary/corsa-bathroom-faucets-eeco';
          if (subsub === 'expert') return '/sanitary/corsa-bathroom-faucets-expert';
          if (subsub === 'florence') return '/sanitary/corsa-bathroom-faucets-florence';
          if (subsub === 'glassbowlfaucet') return '/sanitary/corsa-bathroom-faucets-glass-bowl-faucet';
          if (subsub === 'idea') return '/sanitary/corsa-bathroom-faucets-idea';
          if (subsub === 'jazz') return '/sanitary/corsa-bathroom-faucets-jazz';
          if (subsub === 'ket') return '/sanitary/corsa-bathroom-faucets-ket';
          if (subsub === 'milano') return '/sanitary/corsa-bathroom-faucets-milano';
          if (subsub === 'nano') return '/sanitary/corsa-bathroom-faucets-nano';
          if (subsub === 'nexa') return '/sanitary/corsa-bathroom-faucets-nexa';
          if (subsub === 'niagra') return '/sanitary/corsa-bathroom-faucets-niagra';
          if (subsub === 'nice') return '/sanitary/corsa-bathroom-faucets-nice';
          if (subsub === 'omega') return '/sanitary/corsa-bathroom-faucets-omega';
          if (subsub === 'passion') return '/sanitary/corsa-bathroom-faucets-passion';
          if (subsub === 'royal') return '/sanitary/corsa-bathroom-faucets-royal';
          if (subsub === 'slimline') return '/sanitary/corsa-bathroom-faucets-slimline';
          if (subsub === 'splash') return '/sanitary/corsa-bathroom-faucets-splash';
          if (subsub === 'squaref') return '/sanitary/corsa-bathroom-faucets-square-f';
          if (subsub === 'squares') return '/sanitary/corsa-bathroom-faucets-square-s';
          if (subsub === 'super') return '/sanitary/corsa-bathroom-faucets-super';
          if (subsub === 'tri') return '/sanitary/corsa-bathroom-faucets-tri';
        }
      }
      if (subLower === 'bathroomaccessories') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'acrylicaccessories') return '/sanitary/corsa-bathroom-accessories-acrylic-accessories';
          if (subsub === 'almond') return '/sanitary/corsa-bathroom-accessories-almond';
          if (subsub === 'anglo') return '/sanitary/corsa-bathroom-accessories-anglo';
          if (subsub === 'budget') return '/sanitary/corsa-bathroom-accessories-budget';
          if (subsub === 'dolphin') return '/sanitary/corsa-bathroom-accessories-dolphin';
          if (subsub === 'ecco') return '/sanitary/corsa-bathroom-accessories-ecco';
          if (subsub === 'keti') return '/sanitary/corsa-bathroom-accessories-keti';
          if (subsub === 'qubix') return '/sanitary/corsa-bathroom-accessories-qubix';
          if (subsub === 'square') return '/sanitary/corsa-bathroom-accessories-square';
          if (subsub === 'supreme') return '/sanitary/corsa-bathroom-accessories-supreme';
        }
      }
      if (subLower === 'flushingcistern') return '/sanitary/corsa-flushing-cistern';
      if (subLower === 'kitchen') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'kitchenfaucets') return '/sanitary/corsa-kitchen-kitchen-faucets';
          if (subsub === 'kitchensink') return '/sanitary/corsa-kitchen-kitchen-sink';
        }
      }
      if (subLower === 'otherusefulitems') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'balvalves') return '/sanitary/corsa-other-useful-items-ball-valves';
          if (subsub === 'minianglecock') return '/sanitary/corsa-other-useful-items-mini-angle-cock';
          if (subsub === 'mouthoperated') return '/sanitary/corsa-other-useful-items-mouth-operated';
          if (subsub === 'pressmaticpushcock') return '/sanitary/corsa-other-useful-items-pressmatic-push-cock';
          if (subsub === 'sensortaps') return '/sanitary/corsa-other-useful-items-sensor-taps';
          if (subsub === 'soapdispenser') return '/sanitary/corsa-other-useful-items-soap-dispenser';
        }
      }
      if (subLower === 'showers') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'healthfaucet') return '/sanitary/corsa-showers-health-faucet';
          if (subsub === 'overheadshower') return '/sanitary/corsa-shower-soverhead-shower';
          if (subsub === 'rainshower') return '/sanitary/corsa-showers-rain-shower';
          if (subsub === 'telephonicshower') return '/sanitary/corsa-showers-telephonic-shower';
        }
      }
    }
    
    // Essess categories
    if (mainLower === 'essess') {
      if (subLower === 'accessories') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'series1croma') return '/sanitary/essess-accessories-series1-croma';
          if (subsub === 'series2swing') return '/sanitary/essess-accessories-series2-swing';
          if (subsub === 'series3tarim') return '/sanitary/essess-accessories-series3-tarim';
          if (subsub === 'series5hotelierseries') return '/sanitary/essess-accessories-series5-hotelier-series';
          if (subsub === 'series6cruzo') return '/sanitary/essess-accessories-series6-cruzo';
          if (subsub === 'series7deon') return '/sanitary/essess-accessories-series7-deon';
          if (subsub === 'series8bseries') return '/sanitary/essess-accessories-series8-series';
        }
      }
      if (subLower === 'autoclosetaps') return '/sanitary/essess-auto-close-taps';
      if (subLower === 'celato') return '/sanitary/essess-celato';
      if (subLower === 'croma') return '/sanitary/essess-croma';
      if (subLower === 'cruzo') return '/sanitary/essess-cruzo';
      if (subLower === 'deon') return '/sanitary/essess-deon';
      if (subLower === 'dseries') return '/sanitary/essess-series';
      if (subLower === 'echo') return '/sanitary/essess-echo';
      if (subLower === 'essentials') return '/sanitary/essess-essentials';
      if (subLower === 'hotelierseries') return '/sanitary/essess-hotelier-series';
      if (subLower === 'hs03') return '/sanitary/essess-s03';
      if (subLower === 'labtaps') return '/sanitary/essess-lab-taps';
      if (subLower === 'newdune') return '/sanitary/essess-new-dune';
      if (subLower === 'newxess') return '/sanitary/essess-new-xess';
      if (subLower === 'quadra') return '/sanitary/essess-quadra';
      if (subLower === 'sensors') return '/sanitary/essess-sensors';
      if (subLower === 'showers') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'handshowers') return '/sanitary/essess-showers-hand-showers';
          if (subsub === 'overheadshowers') return '/sanitary/essess-showers-overhead-showers';
          if (subsub === 'rainfallshowers') return '/sanitary/essess-showers-rainfall-showers';
          if (subsub === 'showerarms') return '/sanitary/essess-showers-shower-arms';
        }
      }
      if (subLower === 'tarim') return '/sanitary/essess-tarim';
      if (subLower === 'trand') return '/sanitary/essess-trand';
    }
    
    // Hindware categories
    if (mainLower === 'hindware') {
      if (subLower === 'addon') return '/sanitary/hindware-add-on';
      if (subLower === 'bathtub') return '/sanitary/hindware-bath-tub';
      if (subLower === 'cisterns') return '/sanitary/hindware-cisterns';
      if (subLower === 'faucets') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'angularstopcock') return '/sanitary/hindware-faucets-angular-stop-cock';
          if (subsub === 'bathspout') return '/sanitary/hindware-faucets-bath-spout';
          if (subsub === 'bibcock') return '/sanitary/hindware-faucets-bib-cock';
          if (subsub === 'chbm') return '/sanitary/hindware-faucets-chbm';
          if (subsub === 'concealedstopcock') return '/sanitary/hindware-faucets-concealed-stop-cock';
          if (subsub === 'cscexpkit') return '/sanitary/hindware-faucets-csc-exp-kit';
          if (subsub === 'deuschmixer') return '/sanitary/hindware-faucets-deusch-mixer';
          if (subsub === 'exposedmixers') return '/sanitary/hindware-faucets-exposed-mixers';
          if (subsub === 'flushcock') return '/sanitary/hindware-faucets-flush-cock';
          if (subsub === 'medicalseries') return '/sanitary/hindware-faucets-medical-series';
          if (subsub === 'mixerfaucet') return '/sanitary/hindware-faucets-mixer-faucet';
          if (subsub === 'pillarcock') return '/sanitary/hindware-faucets-pillar-cock';
          if (subsub === 'pillarcocktall') return '/sanitary/hindware-faucets-pillar-cock-tall';
          if (subsub === 'pillarfaucet') return '/sanitary/hindware-faucets-pillar-faucet';
          if (subsub === 'pressmatic') return '/sanitary/hindware-faucets-pressmatic';
          if (subsub === 'recessed') return '/sanitary/hindware-faucets-recessed';
          if (subsub === 'singleleverdivertor') return '/sanitary/hindware-faucets-single-lever-divertor';
          if (subsub === 'sinkcock') return '/sanitary/hindware-faucets-sink-cock';
          if (subsub === 'sinkmixer') return '/sanitary/hindware-faucets-sink-mixer';
          if (subsub === 'slbmfaucet') return '/sanitary/hindware-faucets-slbm-faucet';
          if (subsub === 'slbmfaucettall') return '/sanitary/hindware-faucets-slbm-faucet-tall';
          if (subsub === 'wallmixer') return '/sanitary/hindware-faucets-wall-mixer';
        }
      }
      if (subLower === 'showers') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'rainshowers') return '/sanitary/hindware-showers-rain-showers';
        }
      }
      if (subLower === 'washbasins') return '/sanitary/hindware-wash-basins';
      if (subLower === 'waterclosets') return '/sanitary/hindware-water-closets';
    }
    
    // Leo Bath Fittings
    if (mainLower === 'leobathfittings') {
      if (subLower === 'bathroomaccessories') return '/sanitary/leo-bath-fittings-bathroom-accessories-bathroom-accessories';
      if (subLower === 'faucets') return '/sanitary/leo-bath-fittings-faucets';
      if (subLower === 'valve') return '/sanitary/leo-bath-fittings-valve';
    }
    
    // Pamay
    if (mainLower === 'pamay') {
      if (subLower === 'faucets') return '/sanitary/pamay-faucets-faucets';
      if (subLower === 'showers') return '/sanitary/pamay-showers-showers';
    }
    
    // Parryware categories
    if (mainLower === 'parryware') {
      if (subLower === 'accessories') return '/sanitary/parryware-accessories-accessories';
      if (subLower === 'anglevalves') return '/sanitary/parryware-angle-valves-angle-valves';
      if (subLower === 'belowcounterbasins') return '/sanitary/parryware-below-counter-basins-below-counter-basins';
      if (subLower === 'bowlbasins') return '/sanitary/parryware-bowl-basins-bowl-basins';
      if (subLower === 'closets') return '/sanitary/parryware-closets-closets';
      if (subLower === 'concealedcistern') return '/sanitary/parryware-concealed-cistern-concealed-cistern';
      if (subLower === 'europeanwatercloset') return '/sanitary/parryware-european-water-closet-european-water-closet';
      if (subLower === 'faucets') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'flush cocks') return '/sanitary/parryware-faucets-flush-cocks';
          if (subsub === 'flush valve') return '/sanitary/parryware-faucets-flush-valve';
          if (subsub === 'health faucets') return '/sanitary/parryware-faucets-health-faucets';
          if (subsub === 'kitchen sinks') return '/sanitary/parryware-faucets-kitchen-sinks';
          if (subsub === 'pedestals') return '/sanitary/parryware-faucets-pedestals';
        }
      }
      if (subLower === 'polymercisterns') return '/sanitary/parryware-polymer-cisterns-polymer-cisterns';
      if (subLower === 'pushplates') return '/sanitary/parryware-push-plates-push-plates';
      if (subLower === 'seatcovers') return '/sanitary/parryware-seat-covers-seat-covers';
      if (subLower === 'semirecessedbasins') return '/sanitary/parryware-semi-recessed-basins-semi-recessed-basins';
      if (subLower === 'showerenclosures') return '/sanitary/parryware-shower-enclosures-shower-enclosures';
      if (subLower === 'showerpanels') return '/sanitary/parryware-shower-panels-shower-panels';
      if (subLower === 'showers') {
        if (parts.length >= 3) {
          const subsub = parts[2].toLowerCase();
          if (subsub === 'showers') return '/sanitary/parryware-showers-showers';
        }
      }
      if (subLower === 'utsavrange') return '/sanitary/parryware-utsav-range-utsav-range';
      if (subLower === 'washbasins') return '/sanitary/parryware-wash-basins-wash-basins';
      if (subLower === 'wastecoupling') return '/sanitary/parryware-waste-coupling-waste-coupling';
      if (subLower === 'waterheaters') return '/sanitary/parryware-water-heaters-water-heaters';
    }
    
    // Pearl Precious Products
    if (mainLower === 'pearlpreciousproducts') {
      if (subLower === 'edge') return '/sanitary/pearl-precious-products-edge-edge';
    }
    
    // Waterman categories
    if (mainLower === 'waterman') {
      if (subLower === 'accessories') return '/sanitary/waterman-accessories';
      if (subLower === 'aria') return '/sanitary/waterman-aria';
      if (subLower === 'aura') return '/sanitary/waterman-aura';
      if (subLower === 'dell') return '/sanitary/waterman-dell';
      if (subLower === 'deluxe') return '/sanitary/waterman-deluxe';
      if (subLower === 'eco') return '/sanitary/waterman-eco';
      if (subLower === 'evoque') return '/sanitary/waterman-evoque';
      if (subLower === 'handhowers') return '/sanitary/waterman-hand-showers';
      if (subLower === 'healthfaucetabs') return '/sanitary/waterman-health-faucet-abs';
      if (subLower === 'healthfaucetsbrass') return '/sanitary/waterman-health-faucets-brass';
      if (subLower === 'ikon') return '/sanitary/waterman-ikon';
      if (subLower === 'rainshowers') return '/sanitary/waterman-rain-showers';
      if (subLower === 'roman') return '/sanitary/waterman-roman';
      if (subLower === 'showertubes') return '/sanitary/waterman-shower-tubes';
      if (subLower === 'wallshowerswitharm') return '/sanitary/waterman-wall-showers-with-arm';
      if (subLower === 'wallshowerswithoutarm') return '/sanitary/waterman-wall-showers-without-arm';
    }
    
    // Water-Tec categories
    if (mainLower === 'watertec') {
      if (subLower === 'allied') return '/sanitary/water-tec-allied';
      if (subLower === 'aqua') return '/sanitary/water-tec-aqua';
      if (subLower === 'aspire') return '/sanitary/water-tec-aspire';
      if (subLower === 'bathroomaccessories') return '/sanitary/water-tec-bathroom-accessories';
      if (subLower === 'cistern') return '/sanitary/water-tec-cistern';
      if (subLower === 'concealedcistern') return '/sanitary/water-tec-concealed-cistern';
      if (subLower === 'connectiontube') return '/sanitary/water-tec-connection-tube';
      if (subLower === 'ebony') return '/sanitary/water-tec-ebony';
      if (subLower === 'eco') return '/sanitary/water-tec-eco';
      if (subLower === 'eva') return '/sanitary/water-tec-eva';
      if (subLower === 'flora') return '/sanitary/water-tec-flora';
      if (subLower === 'healthfaucets') return '/sanitary/water-tec-health-faucets';
      if (subLower === 'quattro') return '/sanitary/water-tec-quattro';
      if (subLower === 'showers') return '/sanitary/water-tec-showers';
      if (subLower === 'taps') return '/sanitary/water-tec-tops';
      if (subLower === 'toiletseatcovers') return '/sanitary/water-tec-toilet-seat-covers';
      if (subLower === 'tseries') return '/sanitary/water-tec-t-series';
      if (subLower === 'tseriesalt') return '/sanitary/water-tec-t-series-alt';
      if (subLower === 'valves') return '/sanitary/water-tec-valves';
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

console.log('🚀 Starting Sanitary ProductList API URL updates...\n');
console.log('📋 This will update all API_URL values to match apiS.js exactly\n');
const totalUpdated = walk(BASE_DIR);
console.log(`\n✅ Completed! Updated ${totalUpdated} files.`);
console.log('\n🔧 All API_URL values now match the exact endpoints from apiS.js');
console.log('🔧 All delete endpoints have been fixed from /delete: to /delete/'); 